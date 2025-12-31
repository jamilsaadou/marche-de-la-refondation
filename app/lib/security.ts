import { NextRequest } from 'next/server';

// Système de rate limiting en mémoire (pour production, utilisez Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const ipBlockList = new Set<string>();

// Configuration du rate limiting
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // max 100 requêtes par fenêtre
  blockDurationMs: 60 * 60 * 1000, // Bloquer pour 1 heure après abus
};

const SENSITIVE_ENDPOINTS_CONFIG = {
  '/api/auth/login': { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 tentatives en 15min
  '/api/demandes': { windowMs: 60 * 1000, maxRequests: 3 }, // 3 soumissions par minute
  '/api/upload': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads par minute
};

/**
 * Obtenir l'IP du client
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

/**
 * Nettoyer les entrées expirées du rate limiter
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime && !entry.blocked) {
      rateLimitStore.delete(key);
    }
    if (entry.blocked && entry.blockUntil && now > entry.blockUntil) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Vérifier le rate limit
 */
export function checkRateLimit(
  request: NextRequest,
  endpoint?: string
): { allowed: boolean; remaining: number; resetTime: number; reason?: string } {
  const ip = getClientIP(request);
  const pathname = request.nextUrl.pathname;
  const key = `${ip}:${pathname}`;
  
  // Vérifier si l'IP est dans la liste noire
  if (ipBlockList.has(ip)) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + RATE_LIMIT_CONFIG.blockDurationMs,
      reason: 'IP bloquée pour activité suspecte',
    };
  }
  
  // Nettoyer périodiquement
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }
  
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  // Utiliser la config spécifique à l'endpoint si elle existe
  const config = endpoint && SENSITIVE_ENDPOINTS_CONFIG[endpoint as keyof typeof SENSITIVE_ENDPOINTS_CONFIG] 
    || RATE_LIMIT_CONFIG;
  
  if (!entry) {
    // Première requête
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }
  
  // Vérifier si bloqué
  if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil,
      reason: 'Trop de requêtes - IP temporairement bloquée',
    };
  }
  
  // Réinitialiser si la fenêtre est expirée
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + config.windowMs;
    entry.blocked = false;
    delete entry.blockUntil;
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Incrémenter le compteur
  entry.count++;
  
  // Vérifier si la limite est dépassée
  if (entry.count > config.maxRequests) {
    entry.blocked = true;
    entry.blockUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil,
      reason: 'Limite de requêtes dépassée',
    };
  }
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Bloquer une IP manuellement
 */
export function blockIP(ip: string) {
  ipBlockList.add(ip);
}

/**
 * Débloquer une IP
 */
export function unblockIP(ip: string) {
  ipBlockList.delete(ip);
}

/**
 * Vérifier si une IP est bloquée
 */
export function isIPBlocked(ip: string): boolean {
  return ipBlockList.has(ip);
}

/**
 * Valider et nettoyer les inputs
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Enlever les caractères dangereux
    .substring(0, 10000); // Limiter la longueur
}

/**
 * Valider un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un numéro de téléphone
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

/**
 * Détecter des patterns suspects dans les inputs
 */
export function detectSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /\bSELECT\b.*\bFROM\b/i, // SQL injection
    /\bUNION\b.*\bSELECT\b/i,
    /\bDROP\b.*\bTABLE\b/i,
    /\bINSERT\b.*\bINTO\b/i,
    /\bUPDATE\b.*\bSET\b/i,
    /\bDELETE\b.*\bFROM\b/i,
    /\.\.\//g, // Directory traversal
    /\0/g, // Null bytes
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Valider les types MIME des fichiers
 */
export function isValidFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Générer un nom de fichier sécurisé
 */
export function generateSecureFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = originalName.split('.').pop()?.toLowerCase() || '';
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100);
  
  return `${timestamp}_${random}_${safeName}`;
}

/**
 * Headers de sécurité HTTP
 */
export function getSecurityHeaders() {
  return {
    // Protéger contre le clickjacking
    'X-Frame-Options': 'DENY',
    // Protéger contre les attaques XSS
    'X-Content-Type-Options': 'nosniff',
    // Forcer HTTPS en production
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    // Protection XSS du navigateur
    'X-XSS-Protection': '1; mode=block',
    // Contrôler les referrers
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com https://*.hcaptcha.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: http:",
      "connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com",
      "frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com",
      "worker-src 'self' blob:",
    ].join('; '),
  };
}

/**
 * Créer une réponse avec headers de sécurité
 */
export function createSecureResponse(data: any, status: number = 200) {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getSecurityHeaders(),
    },
  });
  
  return response;
}

/**
 * Logger les événements de sécurité
 */
export function logSecurityEvent(event: {
  type: 'rate_limit' | 'blocked_ip' | 'suspicious_input' | 'invalid_file' | 'failed_auth';
  ip: string;
  endpoint?: string;
  details?: string;
}) {
  const timestamp = new Date().toISOString();
  console.warn(`[SECURITY] ${timestamp} - ${event.type}`, {
    ip: event.ip,
    endpoint: event.endpoint,
    details: event.details,
  });
  
  // TODO: En production, envoyer à un service de monitoring
}

/**
 * Vérifier la force d'un mot de passe
 */
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un caractère spécial' };
  }
  
  return { valid: true };
}

/**
 * Générer un token CSRF
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
