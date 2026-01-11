import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { checkRateLimit, getClientIP, logSecurityEvent } from '@/app/lib/security';

/**
 * API pour servir les fichiers uploadés de manière sécurisée
 * GET /api/files/[filename]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const clientIP = getClientIP(request);
  
  try {
    // Vérifier le rate limit
    const rateLimitResult = checkRateLimit(request, '/api/files');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    const filename = params.filename;

    // Validation du nom de fichier pour éviter les attaques de traversée de répertoires
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      logSecurityEvent({
        type: 'suspicious_input',
        ip: clientIP,
        endpoint: '/api/files',
        details: `Nom de fichier suspect: ${filename}`,
      });
      return NextResponse.json(
        { success: false, message: 'Nom de fichier invalide' },
        { status: 400 }
      );
    }

    // Construire le chemin complet du fichier
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'documents', filename);

    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Déterminer le type MIME basé sur l'extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Retourner le fichier avec les bons headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la lecture du fichier:', error);
    
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { success: false, message: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    logSecurityEvent({
      type: 'invalid_file',
      ip: clientIP,
      endpoint: '/api/files',
      details: `Erreur lors de la lecture du fichier: ${error.message}`,
    });

    return NextResponse.json(
      { success: false, message: 'Erreur lors de la lecture du fichier' },
      { status: 500 }
    );
  }
}
