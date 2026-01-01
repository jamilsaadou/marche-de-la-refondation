import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';
import { sendApprovalEmail, sendRejectionEmail } from '@/app/lib/email';

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
      decision,
      estValidationFinale
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

    // Récupérer l'utilisateur pour vérifier son rôle
    const user = await prisma.admin.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà évalué cette demande
    const existingEvaluation = await prisma.evaluation.findUnique({
      where: {
        demandeId_evaluateurId: {
          demandeId: demande.id,
          evaluateurId: decoded.id
        }
      }
    });

    if (existingEvaluation) {
      return NextResponse.json(
        { success: false, message: 'Vous avez déjà évalué cette demande' },
        { status: 400 }
      );
    }

    // Seul le président peut donner une décision finale
    const isPresident = user.role === 'PRESIDENT_JURY';
    const canMakeFinalDecision = isPresident && estValidationFinale;

    // Vérifier que tous les jurys ont évalué avant la validation finale
    if (canMakeFinalDecision) {
      const juryMembers = await prisma.admin.findMany({
        where: {
          role: 'JURY',
          actif: true
        }
      });

      const evaluationsForDemande = await prisma.evaluation.findMany({
        where: {
          demandeId: demande.id
        },
        include: {
          evaluateur: true
        }
      });

      const juryEvaluations = evaluationsForDemande.filter(
        e => e.evaluateur.role === 'JURY'
      );

      if (juryEvaluations.length < juryMembers.length) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Tous les membres du jury doivent évaluer avant la validation finale (${juryEvaluations.length}/${juryMembers.length})` 
          },
          { status: 400 }
        );
      }
    }

    // Créer l'évaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        demandeId: demande.id,
        evaluateurId: decoded.id,
        scores: JSON.stringify(scores),
        commentaires: commentaires ? JSON.stringify(commentaires) : null,
        scoreTotal: parseFloat(scoreTotal),
        decision: canMakeFinalDecision ? decision : null,
        estValidationFinale: canMakeFinalDecision || false,
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

    // Mettre à jour le statut de la demande seulement si c'est une validation finale
    if (canMakeFinalDecision && decision) {
      await prisma.demandeExposant.update({
        where: { id: demande.id },
        data: {
          status: decision,
          dateDecision: new Date(),
          notesAdmin: commentaires ? JSON.stringify(commentaires) : null,
        }
      });

      // Envoyer un email de décision si l'email est fourni
      if (demande.email) {
        const candidateName = `${demande.prenom} ${demande.nom}`;
        try {
          if (decision === 'APPROUVE') {
            await sendApprovalEmail(
              demande.email,
              candidateName,
              demande.numeroReference
            );
            console.log(`Email d'approbation envoyé à ${demande.email}`);
          } else if (decision === 'REJETE') {
            const reason = commentaires?.raisonRejet || body.raisonRejet || undefined;
            await sendRejectionEmail(
              demande.email,
              candidateName,
              demande.numeroReference,
              reason
            );
            console.log(`Email de rejet envoyé à ${demande.email}`);
          }
        } catch (emailError) {
          // Ne pas bloquer l'évaluation si l'email échoue
          console.error('Erreur lors de l\'envoi de l\'email de décision:', emailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: canMakeFinalDecision 
        ? 'Validation finale enregistrée avec succès' 
        : 'Évaluation enregistrée avec succès',
      data: evaluation
    });

  } catch (error: any) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    
    // Gérer l'erreur de contrainte unique
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Vous avez déjà évalué cette demande' },
        { status: 400 }
      );
    }
    
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
