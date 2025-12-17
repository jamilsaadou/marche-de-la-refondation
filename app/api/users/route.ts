import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';
import { requireRole, isAuthenticated } from '@/app/lib/auth';

// GET - Récupérer tous les utilisateurs (Admin uniquement)
export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur a le rôle admin
    const user = requireRole(request, ['SUPER_ADMIN', 'ADMIN']);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé. Rôle admin requis.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const actif = searchParams.get('actif');
    
    // Construire le filtre
    const where: any = {};
    if (role) where.role = role;
    if (actif !== null) where.actif = actif === 'true';

    const users = await prisma.admin.findMany({
      where,
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        actif: true,
        createdAt: true,
        updatedAt: true,
        // Ne pas retourner le mot de passe
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur (Admin uniquement)
export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur a le rôle admin
    const user = requireRole(request, ['SUPER_ADMIN', 'ADMIN']);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé. Rôle admin requis.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, nom, prenom, role } = body;

    // Validation des champs requis
    if (!email || !password || !nom || !prenom || !role) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Validation du rôle
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'SUPERVISEUR', 'JURY', 'GESTIONNAIRE', 'COMPTABLE'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Rôle invalide' },
        { status: 400 }
      );
    }

    // Seul SUPER_ADMIN peut créer d'autres SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Vous n\'avez pas l\'autorisation de créer un Super Admin' },
        { status: 403 }
      );
    }

    // Validation du mot de passe (minimum 8 caractères)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role,
        actif: true,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        actif: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: newUser,
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, email, nom, prenom, role, actif, password } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Seul un admin peut modifier les autres utilisateurs
    // Un utilisateur peut modifier son propre profil (sauf le rôle et actif)
    const isOwnProfile = user.id === id;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user.role);

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Construire les données à mettre à jour
    const updateData: any = {};
    
    if (email && email !== existingUser.email) {
      // Vérifier que le nouvel email n'est pas déjà utilisé
      const emailExists = await prisma.admin.findUnique({
        where: { email },
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Cet email est déjà utilisé' },
          { status: 409 }
        );
      }
      updateData.email = email;
    }
    
    if (nom) updateData.nom = nom;
    if (prenom) updateData.prenom = prenom;
    
    // Seul un admin peut modifier le rôle et le statut actif
    if (isAdmin) {
      if (role) {
        // Seul SUPER_ADMIN peut créer/modifier des SUPER_ADMIN
        if (role === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
          return NextResponse.json(
            { success: false, message: 'Vous n\'avez pas l\'autorisation de définir le rôle Super Admin' },
            { status: 403 }
          );
        }
        updateData.role = role;
      }
      if (actif !== undefined) updateData.actif = actif;
    }
    
    // Si le mot de passe est fourni
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        actif: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur (Admin uniquement)
export async function DELETE(request: NextRequest) {
  try {
    const user = requireRole(request, ['SUPER_ADMIN', 'ADMIN']);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé. Rôle admin requis.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher un utilisateur de se supprimer lui-même
    if (user.id === id) {
      return NextResponse.json(
        { success: false, message: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    // Seul SUPER_ADMIN peut supprimer un autre SUPER_ADMIN
    if (existingUser.role === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Vous n\'avez pas l\'autorisation de supprimer un Super Admin' },
        { status: 403 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
