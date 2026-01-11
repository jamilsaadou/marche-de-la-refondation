import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { 
  checkRateLimit, 
  getClientIP, 
  logSecurityEvent,
  generateSecureFileName,
  isValidFileType
} from '@/app/lib/security';

// Types MIME autorisés avec vérification stricte
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf'
];

// Extensions autorisées
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'];

// Taille maximale: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Vérifier les magic bytes du fichier pour détecter le vrai type
 */
async function verifyFileType(buffer: Buffer): Promise<string | null> {
  // Magic bytes pour les types de fichiers
  const signatures: { [key: string]: number[] } = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
  };
  
  for (const [mimeType, signature] of Object.entries(signatures)) {
    if (signature.every((byte, index) => buffer[index] === byte)) {
      return mimeType;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    // Vérifier le rate limit spécifique aux uploads
    const rateLimitResult = checkRateLimit(request, '/api/upload');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trop de tentatives d\'upload. Veuillez réessayer dans quelques instants.' 
        },
        { status: 429 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérification 1: Taille du fichier
    if (file.size === 0) {
      logSecurityEvent({
        type: 'invalid_file',
        ip: clientIP,
        endpoint: '/api/upload',
        details: 'Fichier vide',
      });
      return NextResponse.json(
        { success: false, message: 'Le fichier est vide' },
        { status: 400 }
      );
    }
    
    if (file.size > MAX_FILE_SIZE) {
      logSecurityEvent({
        type: 'invalid_file',
        ip: clientIP,
        endpoint: '/api/upload',
        details: `Fichier trop volumineux: ${file.size} bytes`,
      });
      return NextResponse.json(
        { success: false, message: 'Le fichier est trop volumineux. Taille maximale: 5MB' },
        { status: 400 }
      );
    }

    // Vérification 2: Extension du fichier
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      logSecurityEvent({
        type: 'invalid_file',
        ip: clientIP,
        endpoint: '/api/upload',
        details: `Extension non autorisée: ${fileExt}`,
      });
      return NextResponse.json(
        { success: false, message: 'Type de fichier non autorisé. Seuls JPG, PNG et PDF sont acceptés.' },
        { status: 400 }
      );
    }

    // Vérification 3: Type MIME déclaré
    if (!isValidFileType(file.type, ALLOWED_MIME_TYPES)) {
      logSecurityEvent({
        type: 'invalid_file',
        ip: clientIP,
        endpoint: '/api/upload',
        details: `Type MIME non autorisé: ${file.type}`,
      });
      return NextResponse.json(
        { success: false, message: 'Type de fichier non autorisé. Seuls JPG, PNG et PDF sont acceptés.' },
        { status: 400 }
      );
    }

    // Lire le contenu du fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Vérification 4: Vérifier les magic bytes (signature réelle du fichier)
    const actualMimeType = await verifyFileType(buffer);
    if (!actualMimeType || !ALLOWED_MIME_TYPES.includes(actualMimeType)) {
      logSecurityEvent({
        type: 'invalid_file',
        ip: clientIP,
        endpoint: '/api/upload',
        details: `Magic bytes invalides. Type déclaré: ${file.type}, Type réel: ${actualMimeType}`,
      });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Le fichier ne correspond pas au type déclaré. Upload refusé pour des raisons de sécurité.' 
        },
        { status: 400 }
      );
    }
    
    // Vérification 5: Scanner pour du contenu malveillant dans les noms de fichiers
    const dangerousPatterns = [
      /\.\./g,  // Directory traversal
      /[<>:"|?*]/g,  // Caractères invalides
      /\x00/g,  // Null bytes
      /\.\.$/,  // Double extensions cachées
    ];
    
    if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
      logSecurityEvent({
        type: 'suspicious_input',
        ip: clientIP,
        endpoint: '/api/upload',
        details: `Nom de fichier suspect: ${file.name}`,
      });
      return NextResponse.json(
        { success: false, message: 'Nom de fichier invalide' },
        { status: 400 }
      );
    }
    
    // Générer un nom de fichier sécurisé
    const fileName = generateSecureFileName(file.name);
    
    // Créer le dossier uploads s'il n'existe pas
    // Utiliser UPLOADS_DIR si défini (pour production), sinon utiliser le dossier local
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads', 'documents');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà ou erreur de permissions
      console.log('Dossier uploads:', uploadsDir, error);
    }
    
    // Sauvegarder le fichier
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Retourner l'URL du fichier
    const fileUrl = `/uploads/documents/${fileName}`;
    
    console.log(`[UPLOAD SUCCESS] IP: ${clientIP}, File: ${fileName}, Size: ${file.size} bytes`);
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    logSecurityEvent({
      type: 'invalid_file',
      ip: clientIP,
      endpoint: '/api/upload',
      details: `Erreur serveur: ${error}`,
    });
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'upload du fichier' 
      },
      { status: 500 }
    );
  }
}
