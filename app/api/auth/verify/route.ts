import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/app/lib/auth';

// GET - Vérifier la session utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    // Retourner les informations de l'utilisateur si la session est valide
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de la session:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la vérification de la session' },
      { status: 500 }
    );
  }
}
