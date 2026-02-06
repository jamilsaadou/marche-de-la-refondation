import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

// GET - Obtenir les performances des jurys (SUPER_ADMIN uniquement)
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

    // Vérifier que l'utilisateur est SUPER_ADMIN
    const currentUser = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Accès réservé au Super Administrateur' },
        { status: 403 }
      );
    }

    // Récupérer tous les membres du jury et président actifs
    const juryMembers = await prisma.admin.findMany({
      where: {
        role: { in: ['JURY', 'PRESIDENT_JURY'] },
        actif: true
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Récupérer toutes les évaluations avec leurs relations
    const evaluations = await prisma.evaluation.findMany({
      include: {
        evaluateur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            role: true
          }
        },
        demande: {
          select: {
            id: true,
            numeroReference: true,
            nom: true,
            prenom: true,
            nomEntreprise: true,
            status: true,
            secteurActivite: true
          }
        }
      },
      orderBy: {
        dateEvaluation: 'desc'
      }
    });

    // Récupérer le total des demandes en attente d'évaluation
    const totalDemandes = await prisma.demandeExposant.count();
    const demandesEnAttente = await prisma.demandeExposant.count({
      where: { status: 'EN_ATTENTE' }
    });

    // Calculer les performances par jury
    const performancesParJury = juryMembers.map(jury => {
      const juryEvals = evaluations.filter(e => e.evaluateurId === jury.id);
      const scores = juryEvals.map(e => e.scoreTotal);

      const scoreMoyen = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

      const scoreMin = scores.length > 0 ? Math.min(...scores) : 0;
      const scoreMax = scores.length > 0 ? Math.max(...scores) : 0;

      // Écart-type des scores
      const ecartType = scores.length > 1
        ? Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - scoreMoyen, 2), 0) / (scores.length - 1))
        : 0;

      // Distribution des décisions (pour le président)
      const decisions = juryEvals
        .filter(e => e.decision)
        .reduce((acc: Record<string, number>, e) => {
          if (e.decision) {
            acc[e.decision] = (acc[e.decision] || 0) + 1;
          }
          return acc;
        }, {});

      // Évaluations par mois (6 derniers mois)
      const evalParMois: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        evalParMois[key] = 0;
      }
      juryEvals.forEach(e => {
        const d = new Date(e.dateEvaluation);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (evalParMois[key] !== undefined) {
          evalParMois[key]++;
        }
      });

      // Distribution des scores par tranches
      const distributionScores = {
        '0-20': 0,
        '21-40': 0,
        '41-60': 0,
        '61-80': 0,
        '81-100': 0
      };
      scores.forEach(s => {
        if (s <= 20) distributionScores['0-20']++;
        else if (s <= 40) distributionScores['21-40']++;
        else if (s <= 60) distributionScores['41-60']++;
        else if (s <= 80) distributionScores['61-80']++;
        else distributionScores['81-100']++;
      });

      // Dernière évaluation
      const derniereEvaluation = juryEvals.length > 0
        ? juryEvals[0].dateEvaluation
        : null;

      return {
        jury: {
          id: jury.id,
          nom: jury.nom,
          prenom: jury.prenom,
          email: jury.email,
          role: jury.role,
          createdAt: jury.createdAt
        },
        totalEvaluations: juryEvals.length,
        scoreMoyen: Math.round(scoreMoyen * 10) / 10,
        scoreMin: Math.round(scoreMin * 10) / 10,
        scoreMax: Math.round(scoreMax * 10) / 10,
        ecartType: Math.round(ecartType * 10) / 10,
        decisions,
        evalParMois,
        distributionScores,
        derniereEvaluation
      };
    });

    // Répartition des évaluations par heure (0-23)
    const evaluationsParHeure: Record<string, number> = {};
    for (let h = 0; h < 24; h++) {
      evaluationsParHeure[String(h).padStart(2, '0')] = 0;
    }
    evaluations.forEach(e => {
      const hour = new Date(e.dateEvaluation).getHours();
      const key = String(hour).padStart(2, '0');
      evaluationsParHeure[key] = (evaluationsParHeure[key] || 0) + 1;
    });

    // Évaluations globales par mois (6 derniers mois)
    const evaluationsParMoisGlobal: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      evaluationsParMoisGlobal[key] = 0;
    }
    evaluations.forEach(e => {
      const d = new Date(e.dateEvaluation);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (evaluationsParMoisGlobal[key] !== undefined) {
        evaluationsParMoisGlobal[key]++;
      }
    });

    // Statistiques globales
    const totalEvaluations = evaluations.length;
    const scoreMoyenGlobal = totalEvaluations > 0
      ? evaluations.reduce((sum, e) => sum + e.scoreTotal, 0) / totalEvaluations
      : 0;

    // Taux de complétion global
    const evaluationsFinales = evaluations.filter(e => e.estValidationFinale);
    const demandesApprouvees = evaluationsFinales.filter(e => e.decision === 'APPROUVE').length;
    const demandesRejetees = evaluationsFinales.filter(e => e.decision === 'REJETE').length;

    // Activité récente (10 dernières évaluations)
    const activiteRecente = evaluations.slice(0, 10).map(e => ({
      id: e.id,
      evaluateur: `${e.evaluateur.prenom} ${e.evaluateur.nom}`,
      roleEvaluateur: e.evaluateur.role,
      demande: e.demande.numeroReference,
      candidat: `${e.demande.prenom} ${e.demande.nom}`,
      entreprise: e.demande.nomEntreprise,
      score: e.scoreTotal,
      decision: e.decision,
      date: e.dateEvaluation
    }));

    return NextResponse.json({
      success: true,
      data: {
        performancesParJury,
        statistiquesGlobales: {
          totalEvaluations,
          scoreMoyenGlobal: Math.round(scoreMoyenGlobal * 10) / 10,
          totalDemandes,
          demandesEnAttente,
          demandesApprouvees,
          demandesRejetees,
          totalJurys: juryMembers.filter(j => j.role === 'JURY').length,
          totalPresidents: juryMembers.filter(j => j.role === 'PRESIDENT_JURY').length,
          evaluationsParHeure,
          evaluationsParMoisGlobal
        },
        activiteRecente
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des performances:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
