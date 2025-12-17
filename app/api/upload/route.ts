import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Type de fichier non autorisé. Seuls JPG, PNG et PDF sont acceptés.' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Le fichier est trop volumineux. Taille maximale: 5MB' },
        { status: 400 }
      );
    }

    // Créer un nom de fichier unique
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Générer un nom unique avec timestamp et nom original
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }
    
    // Sauvegarder le fichier
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Retourner l'URL du fichier
    const fileUrl = `/uploads/documents/${fileName}`;
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'upload du fichier' 
      },
      { status: 500 }
    );
  }
}
