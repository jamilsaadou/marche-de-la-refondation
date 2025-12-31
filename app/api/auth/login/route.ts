import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';
import { generateToken } from '@/app/lib/auth';
import { 
  checkRateLimit, 
  getClientIP, 
  logSecurityEvent,
  isValidEmail,
  sanitizeInput
} from '@/app/lib/security';

// Suivre les tentatives de connexion échouées par IP
const failedLoginAttempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>();

// Bloquer après 5 tentatives échouées
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    // Vérifier le rate limit strict pour la connexion
    const rateLimitResult = checkRateLimit(request, '/api/auth/login');
    if (!rateLimitResult.allowed) {
      logSecurityEvent({
        type: 'rate_limit',
        ip: clientIP,
        endpoint: '/api/auth/login',
        details: 'Trop de tentatives de connexion',
      });
      return NextResponse.json(
        { success: false, message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    // Vérifier si l'IP est bloquée pour tentatives échouées
    const ipAttempts = failedLoginAttempts.get(clientIP);
    if (ipAttempts?.blocked) {
      const timeRemaining = Math.ceil((ipAttempts.lastAttempt + BLOCK_DURATION - Date.now()) / 60000);
      if (timeRemaining > 0) {
        logSecurityEvent({
          type: 'blocked_ip',
          ip: clientIP,
          endpoint: '/api/auth/login',
          details: `IP bloquée pour tentatives échouées - ${timeRemaining}min restantes`,
        });
        return NextResponse.json(
          { 
            success: false, 
            message: `Trop de tentatives échouées. Veuillez réessayer dans ${timeRemaining} minutes.` 
          },
          { status: 403 }
        );
      } else {
        // Débloquer si le temps est écoulé
        failedLoginAttempts.delete(clientIP);
      }
    }

    const body = await request.json();
    let { email, password } = body;

    // Validation des inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Nettoyer et valider l'email
    email = sanitizeInput(email).toLowerCase();
    
    if (!isValidEmail(email)) {
      logSecurityEvent({
        type: 'failed_auth',
        ip: clientIP,
        endpoint: '/api/auth/login',
        details: `Format d'email invalide: ${email}`,
      });
      return NextResponse.json(
        { success: false, message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Limiter la longueur du mot de passe
    if (password.length > 128) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe trop long' },
        { status: 400 }
      );
    }

    // Ajouter un délai artificiel pour rendre le brute force plus difficile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Chercher l'admin dans la base de données
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // Ne pas révéler si l'email existe ou non
      recordFailedAttempt(clientIP);
      logSecurityEvent({
        type: 'failed_auth',
        ip: clientIP,
        endpoint: '/api/auth/login',
        details: `Email non trouvé: ${email}`,
      });
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si le compte est actif
    if (!admin.actif) {
      logSecurityEvent({
        type: 'failed_auth',
        ip: clientIP,
        endpoint: '/api/auth/login',
        details: `Tentative de connexion à un compte désactivé: ${email}`,
      });
      return NextResponse.json(
        { success: false, message: 'Votre compte a été désactivé. Contactez un administrateur.' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      recordFailedAttempt(clientIP);
      logSecurityEvent({
        type: 'failed_auth',
        ip: clientIP,
        endpoint: '/api/auth/login',
        details: `Mot de passe incorrect pour: ${email}`,
      });
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Connexion réussie - réinitialiser les tentatives échouées
    failedLoginAttempts.delete(clientIP);

    // Créer le token JWT en utilisant la fonction generateToken
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      nom: admin.nom,
      prenom: admin.prenom,
    }, '24h');

    // Logger le succès
    console.log(`[LOGIN SUCCESS] IP: ${clientIP}, User: ${email}, Role: ${admin.role}`);

    // Retourner le token et les informations de l'admin
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role,
      },
      message: 'Connexion réussie',
    });

    // Définir le cookie httpOnly pour plus de sécurité
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    logSecurityEvent({
      type: 'failed_auth',
      ip: clientIP,
      endpoint: '/api/auth/login',
      details: `Erreur serveur: ${error}`,
    });
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

/**
 * Enregistrer une tentative de connexion échouée
 */
function recordFailedAttempt(ip: string) {
  const attempts = failedLoginAttempts.get(ip) || { count: 0, lastAttempt: 0, blocked: false };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  
  if (attempts.count >= MAX_FAILED_ATTEMPTS) {
    attempts.blocked = true;
    console.warn(`[SECURITY] IP ${ip} bloquée après ${attempts.count} tentatives échouées`);
  }
  
  failedLoginAttempts.set(ip, attempts);
}
