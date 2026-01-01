import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

// GET - Obtenir les statistiques d'évaluation pour une demande
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

    if (!numeroReference) {
      return NextResponse.json(
        { success: false, message: 'Numéro de référence manquant' },
        { status: 400 }
      );
    }

    // Trouver la demande
    const demande = await prisma.demandeExposant.findUnique({
      where: { numeroReference }
    });

    if (!demande) {
      return NextResponse.json(
        { success: false, message: 'Demande non trouvée' },
        { status: 404 }
      );
    }

    // Récupérer tous les membres du jury actifs
    const juryMembers = await prisma.admin.findMany({
      where: {
        role: 'JURY',
        actif: true
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true
      }
    });

    // Récupérer le président du jury
    const president = await prisma.admin.findFirst({
      where: {
        role: 'PRESIDENT_JURY',
        actif: true
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true
      }
    });

    // Récupérer toutes les évaluations pour cette demande
    const evaluations = await prisma.evaluation.findMany({
      where: {
        demandeId: demande.id
      },
      include: {
        evaluateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        dateEvaluation: 'asc'
      }
    });

    // Séparer les évaluations des jurys et du président
    const juryEvaluations = evaluations.filter(e => e.evaluateur.role === 'JURY');
    const presidentEvaluation = evaluations.find(e => e.evaluateur.role === 'PRESIDENT_JURY');

    // Identifier quels jurys ont déjà évalué
    const juryEvaluationIds = juryEvaluations.map(e => e.evaluateurId);
    const juryMembersNotEvaluated = juryMembers.filter(
      m => !juryEvaluationIds.includes(m.id)
    );

    // Calculer le score moyen des jurys
    const averageJuryScore = juryEvaluations.length > 0
      ? juryEvaluations.reduce((sum, e) => sum + e.scoreTotal, 0) / juryEvaluations.length
      : 0;

    // Vérifier si tous les jurys ont évalué
    const allJuriesEvaluated = juryMembers.length > 0 && juryMembersNotEvaluated.length === 0;

    // Vérifier si le président peut valider
    const canPresidentValidate = allJuriesEvaluated && !presidentEvaluation;

    // Formater les évaluations
    const formattedEvaluations = evaluations.map(e => ({
      ...e,
      scores: JSON.parse(e.scores),
      commentaires: e.commentaires ? JSON.parse(e.commentaires) : null
    }));

    return NextResponse.json({
      success: true,
      data: {
        demande: {
          id: demande.id,
          numeroReference: demande.numeroReference,
          status: demande.status
        },
        juryMembers: {
          total: juryMembers.length,
          evaluated: juryEvaluations.length,
          notEvaluated: juryMembersNotEvaluated,
          list: juryMembers
        },
        president: president,
        evaluations: {
          all: formattedEvaluations,
          jury: juryEvaluations.map(e => ({
            ...e,
            scores: JSON.parse(e.scores),
            commentaires: e.commentaires ? JSON.parse(e.commentaires) : null
          })),
          president: presidentEvaluation ? {
            ...presidentEvaluation,
            scores: JSON.parse(presidentEvaluation.scores),
            commentaires: presidentEvaluation.commentaires ? JSON.parse(presidentEvaluation.commentaires) : null
          } : null
        },
        statistics: {
          averageJuryScore,
          allJuriesEvaluated,
          canPresidentValidate,
          hasPresidentValidated: !!presidentEvaluation,
          finalDecision: presidentEvaluation?.decision || null
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
