import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';
import { generateToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Chercher l'admin dans la base de données
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si le compte est actif
    if (!admin.actif) {
      return NextResponse.json(
        { success: false, message: 'Votre compte a été désactivé. Contactez un administrateur.' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Créer le token JWT en utilisant la fonction generateToken
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      nom: admin.nom,
      prenom: admin.prenom,
    }, '24h');

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
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
