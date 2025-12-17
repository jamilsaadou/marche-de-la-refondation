import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAuthenticated } from '@/app/lib/auth';

// Fonction pour générer un numéro de référence unique
function generateReferenceNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EXP-${timestamp}-${random}`;
}

// POST - Créer une nouvelle demande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Générer un numéro de référence unique
    const numeroReference = generateReferenceNumber();
    
    // Créer la demande dans la base de données
    const demande = await prisma.demandeExposant.create({
      data: {
        numeroReference,
        typeInscription: body.typeInscription,
        localisation: body.localisation,
        region: body.region || null,
        nom: body.nom,
        prenom: body.prenom,
        nationalite: body.nationalite,
        age: parseInt(body.age),
        sexe: body.sexe,
        telephone: body.telephone,
        email: body.email || null,
        adresse: body.adresse,
        nomEntreprise: body.nomEntreprise || null,
        secteurActivite: body.secteurActivite,
        registreCommerce: body.registreCommerce || null,
        produitsProposes: body.produitsProposés || body.produitsProposes,
        listeProduitsDetaillee: body.listeProduitsDetaillée || body.listeProduitsDetaillee,
        capaciteProduction: body.capaciteProduction,
        experienceAnterieure: body.experienceAnterieure,
        sitePreference: body.sitePreference,
        tailleKiosque: body.tailleKiosque,
        nombreEmployes: parseInt(body.nombreEmployes),
        acceptEngagement: body.acceptEngagement,
        acceptFraisStand: body.acceptFraisStand,
        // Enregistrer les URLs des documents uploadés
        carteIdentiteUrl: body.carteIdentiteUrl || null,
        registreCommerceDocUrl: body.registreCommerceDocUrl || null,
        listeProduitsFileUrl: body.listeProduitsFileUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      numeroReference: demande.numeroReference,
      message: 'Votre demande a été enregistrée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la création de la demande:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'enregistrement de votre demande' 
      },
      { status: 500 }
    );
  }
}

// GET - Récupérer toutes les demandes ou une demande spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const numeroReference = searchParams.get('numeroReference');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const adminAccess = searchParams.get('admin') === 'true';

    // Si c'est un accès admin, vérifier l'authentification
    if (adminAccess) {
      const user = isAuthenticated(request);
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Non autorisé' },
          { status: 401 }
        );
      }
    }

    // Si un numéro de référence est fourni, retourner cette demande spécifique
    if (numeroReference) {
      const demande = await prisma.demandeExposant.findUnique({
        where: { numeroReference },
      });

      if (!demande) {
        return NextResponse.json(
          { success: false, message: 'Demande non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: demande });
    }

    // Sinon, retourner la liste des demandes avec pagination (pour admin seulement)
    if (!adminAccess && !numeroReference) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const where = status ? { status } : {};
    
    const [demandes, total] = await Promise.all([
      prisma.demandeExposant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.demandeExposant.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: demandes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de la récupération des demandes' 
      },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le statut d'une demande (Admin uniquement)
export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { numeroReference, status, notesAdmin, raisonRejet, evaluationScores } = body;

    if (!numeroReference || !status) {
      return NextResponse.json(
        { success: false, message: 'Numéro de référence et statut requis' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      notesAdmin,
    };

    // Si le statut est rejeté ou approuvé, ajouter la date de décision
    if (status === 'REJETE' || status === 'APPROUVE') {
      updateData.dateDecision = new Date();
      if (status === 'REJETE' && raisonRejet) {
        updateData.raisonRejet = raisonRejet;
      }
      // Stocker les scores d'évaluation dans les notes admin si fournis
      if (evaluationScores) {
        updateData.notesAdmin = JSON.stringify({
          notes: notesAdmin,
          evaluationScores: evaluationScores,
          evaluatedBy: user.email,
          evaluatedAt: new Date().toISOString()
        });
      }
    }

    const demande = await prisma.demandeExposant.update({
      where: { numeroReference },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: demande,
      message: `La demande a été ${status === 'APPROUVE' ? 'approuvée' : status === 'REJETE' ? 'rejetée' : 'mise à jour'} avec succès`,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de la mise à jour de la demande' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une demande (Admin uniquement)
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const numeroReference = searchParams.get('numeroReference');

    if (!numeroReference) {
      return NextResponse.json(
        { success: false, message: 'Numéro de référence requis' },
        { status: 400 }
      );
    }

    await prisma.demandeExposant.delete({
      where: { numeroReference },
    });

    return NextResponse.json({
      success: true,
      message: 'La demande a été supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Une erreur est survenue lors de la suppression de la demande' 
      },
      { status: 500 }
    );
  }
}
