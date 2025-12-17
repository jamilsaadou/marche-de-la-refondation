import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise-a-changer';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

/**
 * Génère un token JWT pour un utilisateur
 */
export function generateToken(payload: UserPayload, expiresIn: string = '24h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

/**
 * Vérifie et décode un token JWT
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
}

/**
 * Extrait le token depuis l'en-tête Authorization ou les cookies
 */
export function extractToken(request: NextRequest): string | null {
  // 1. Essayer depuis l'en-tête Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. Essayer depuis les cookies
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(request: NextRequest): UserPayload | null {
  const token = extractToken(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Middleware d'authentification pour les routes API
 * Retourne l'utilisateur si authentifié, null sinon
 */
export function requireAuth(request: NextRequest): UserPayload | null {
  const user = isAuthenticated(request);
  
  if (!user) {
    return null;
  }

  return user;
}

/**
 * Vérifie si l'utilisateur a le rôle requis
 */
export function hasRole(user: UserPayload | null, allowedRoles: string[]): boolean {
  if (!user) {
    return false;
  }
  
  return allowedRoles.includes(user.role);
}

/**
 * Middleware pour vérifier les rôles
 */
export function requireRole(request: NextRequest, allowedRoles: string[]): UserPayload | null {
  const user = requireAuth(request);
  
  if (!user || !hasRole(user, allowedRoles)) {
    return null;
  }

  return user;
}
