import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/app/lib/auth';

// POST - Déconnexion utilisateur
export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Créer la réponse
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    });

    // Supprimer le cookie d'authentification
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
