import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getClientIP, getSecurityHeaders, logSecurityEvent } from './app/lib/security';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtenir l'IP du client
  const clientIP = getClientIP(request);
  
  // Appliquer le rate limiting
  const rateLimitResult = checkRateLimit(request, pathname);
  
  if (!rateLimitResult.allowed) {
    // Logger l'événement de sécurité
    logSecurityEvent({
      type: 'rate_limit',
      ip: clientIP,
      endpoint: pathname,
      details: rateLimitResult.reason,
    });
    
    // Retourner une erreur 429 (Too Many Requests)
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: rateLimitResult.reason || 'Trop de requêtes. Veuillez réessayer plus tard.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          ...getSecurityHeaders(),
        },
      }
    );
  }
  
  // Créer la réponse avec les headers de sécurité
  const response = NextResponse.next();
  
  // Ajouter les headers de sécurité à toutes les réponses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Ajouter les headers de rate limiting
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimitResult.resetTime));
  
  return response;
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     * - fichiers publics (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|docx)$).*)',
  ],
};
