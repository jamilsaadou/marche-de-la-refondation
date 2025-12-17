import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

// Cette route permet de créer le premier admin
// À utiliser une seule fois pour initialiser le système
export async function POST(request: NextRequest) {
  try {
    // Vérifier s'il existe déjà un admin
    const existingAdmin = await prisma.admin.findFirst();
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Un administrateur existe déjà' },
        { status: 400 }
      );
    }

    // Créer le mot de passe hashé
    const hashedPassword = await bcrypt.hash('Admin@2024', 10);

    // Créer l'admin par défaut
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@marche-refondation.ne',
        password: hashedPassword,
        nom: 'Admin',
        prenom: 'Super',
        role: 'SUPER_ADMIN',
        actif: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin créé avec succès',
      credentials: {
        email: 'admin@marche-refondation.ne',
        password: 'Admin@2024',
        note: 'Veuillez changer ce mot de passe après la première connexion',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création de l\'admin' },
      { status: 500 }
    );
  }
}
