import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/suivi-demande?numeroReference=XXX
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const numeroReference = searchParams.get('numeroReference');

    if (!numeroReference) {
      return NextResponse.json(
        { error: 'Le numéro de référence est requis' },
        { status: 400 }
      );
    }

    // Rechercher la demande par numéro de référence
    const demande = await prisma.demandeExposant.findUnique({
      where: {
        numeroReference: numeroReference.trim().toUpperCase(),
      },
      include: {
        evaluations: {
          include: {
            evaluateur: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
          orderBy: {
            dateEvaluation: 'desc',
          },
          take: 1, // Prendre seulement la dernière évaluation
        },
      },
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Aucune demande trouvée avec ce numéro de référence' },
        { status: 404 }
      );
    }

    // Mapper le statut
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE': 'pending',
      'APPROUVE': 'approved',
      'REJETE': 'rejected',
    };

    // Construire la réponse
    const response: any = {
      referenceNumber: demande.numeroReference,
      status: statusMap[demande.status] || 'pending',
      submittedDate: demande.createdAt.toISOString().split('T')[0],
      applicantName: `${demande.prenom} ${demande.nom}`,
      businessName: demande.nomEntreprise || 'Entreprise Individuelle',
      email: demande.email || 'Non fourni',
      phone: demande.telephone,
      category: demande.secteurActivite,
      reviewDate: demande.dateDecision?.toISOString().split('T')[0],
      rejectionReason: demande.raisonRejet,
    };

    // Ajouter les prochaines étapes selon le statut
    if (demande.status === 'APPROUVE') {
      response.assignedSite = {
        name: demande.sitePreference,
        kiosk: 'À confirmer', // Vous pouvez ajouter un champ dans le schéma pour le numéro de kiosque
        size: demande.tailleKiosque,
        coordinates: getCoordinates(demande.sitePreference),
      };
      response.nextSteps = [
        'Contacter notre service au +227 XX XX XX XX pour finaliser votre dossier',
        'Préparer les documents requis (contrat, caution)',
        'Planifier la signature du contrat dans les 7 jours',
        'Payer la caution de garantie',
      ];
    } else if (demande.status === 'EN_ATTENTE') {
      response.nextSteps = [
        'Votre dossier est en cours d\'examen',
        'Vous recevrez une réponse sous 24-48 heures',
        'Vérifiez régulièrement votre email',
      ];
    } else if (demande.status === 'REJETE') {
      response.nextSteps = [
        'Corriger les documents manquants ou les informations incorrectes',
        'Soumettre une nouvelle demande avec les documents complets',
        'Contacter notre service pour plus d\'informations',
      ];
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la demande' },
      { status: 500 }
    );
  }
}

// Fonction helper pour obtenir les coordonnées selon le site
function getCoordinates(siteName: string): [number, number] {
  const sitesCoordinates: { [key: string]: [number, number] } = {
    'Site N°1 - Ex-OPVN': [13.514167, 2.108889],
    'Site N°2 - Harobanda': [13.512778, 2.112222],
    'Site N°3 - Yantala': [13.523889, 2.115556],
    'Site N°4 - Terminus': [13.517778, 2.123333],
    'Site N°5 - Boukoki': [13.509444, 2.131111],
    'Site N°6 - Lazaret': [13.506667, 2.126667],
    'Site N°7 - Talladjé': [13.513333, 2.133889],
  };

  // Retourner les coordonnées correspondantes ou des coordonnées par défaut
  return sitesCoordinates[siteName] || [13.514167, 2.108889];
}
