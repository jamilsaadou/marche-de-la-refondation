import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

// POST - Créer une nouvelle évaluation
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token manquant' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      numeroReference, 
      scores, 
      commentaires, 
      scoreTotal, 
      decision 
    } = body;

    if (!numeroReference || !scores || scoreTotal === undefined) {
      return NextResponse.json(
        { success: false, message: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Trouver la demande par numéro de référence
    const demande = await prisma.demandeExposant.findUnique({
      where: { numeroReference }
    });

    if (!demande) {
      return NextResponse.json(
        { success: false, message: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    // Créer l'évaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        demandeId: demande.id,
        evaluateurId: decoded.id,
        scores: JSON.stringify(scores),
        commentaires: commentaires ? JSON.stringify(commentaires) : null,
        scoreTotal: parseFloat(scoreTotal),
        decision: decision || null,
      },
      include: {
        evaluateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
          }
        }
      }
    });

    // Mettre à jour le statut de la demande si une décision est prise
    if (decision) {
      await prisma.demandeExposant.update({
        where: { id: demande.id },
        data: {
          status: decision,
          dateDecision: new Date(),
          notesAdmin: commentaires ? JSON.stringify(commentaires) : null,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Évaluation enregistrée avec succès',
      data: evaluation
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET - Récupérer les évaluations
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token manquant' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const numeroReference = searchParams.get('numeroReference');
    const demandeId = searchParams.get('demandeId');

    let whereClause: any = {};

    if (numeroReference) {
      const demande = await prisma.demandeExposant.findUnique({
        where: { numeroReference }
      });
      if (demande) {
        whereClause.demandeId = demande.id;
      }
    } else if (demandeId) {
      whereClause.demandeId = demandeId;
    }

    const evaluations = await prisma.evaluation.findMany({
      where: whereClause,
      include: {
        evaluateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true,
          }
        },
        demande: {
          select: {
            numeroReference: true,
            nom: true,
            prenom: true,
            nomEntreprise: true,
          }
        }
      },
      orderBy: {
        dateEvaluation: 'desc'
      }
    });

    // Parser les JSON avant de renvoyer
    const evaluationsFormatted = evaluations.map((evaluation: any) => ({
      ...evaluation,
      scores: JSON.parse(evaluation.scores),
      commentaires: evaluation.commentaires ? JSON.parse(evaluation.commentaires) : null,
    }));

    return NextResponse.json({
      success: true,
      data: evaluationsFormatted
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
