import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Créer un administrateur par défaut
  console.log('Création de l\'administrateur...');
  
  const hashedPassword = await bcrypt.hash('Admin123@marche', 10);
  
  await prisma.admin.deleteMany(); // Supprimer les anciens admins
  
  await prisma.admin.create({
    data: {
      email: 'admin@marche.ne',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'Système',
      role: 'ADMIN',
      actif: true,
    },
  });
  
  console.log('✅ Administrateur créé: admin@marche.ne / Admin123@marche');

  // Créer plusieurs demandes de test
  const demandes = [
    {
      numeroReference: 'EXP-12345-001',
      typeInscription: 'moi-meme',
      localisation: 'niamey',
      nom: 'Hamidou',
      prenom: 'Moussa',
      nationalite: 'Nigérienne',
      age: 35,
      sexe: 'Homme',
      telephone: '00227 96 12 34 56',
      email: 'hamidou.moussa@email.com',
      adresse: '123 Rue du Commerce, Niamey',
      nomEntreprise: 'Savonnerie du Niger',
      secteurActivite: 'Artisanat',
      registreCommerce: 'RC-2023-001',
      produitsProposes: 'Savons artisanaux, Huiles essentielles',
      listeProduitsDetaillee: 'Savon noir naturel, Savon au beurre de karité, Huile de baobab, Huile de neem',
      capaciteProduction: '500 unités par semaine',
      experienceAnterieure: '5 ans dans la fabrication de savons artisanaux',
      sitePreference: 'Site N°1 - Ex-OPVN',
      tailleKiosque: '10-15 m²',
      nombreEmployes: 3,
      acceptEngagement: true,
      acceptFraisStand: true,
      status: 'EN_ATTENTE',
    },
    {
      numeroReference: 'EXP-12345-002',
      typeInscription: 'moi-meme',
      localisation: 'niamey',
      nom: 'Abdoulaye',
      prenom: 'Fatima',
      nationalite: 'Nigérienne',
      age: 28,
      sexe: 'Femme',
      telephone: '00227 97 23 45 67',
      email: 'fatima.abdoulaye@email.com',
      adresse: '456 Avenue de la République, Niamey',
      nomEntreprise: 'Tissage Traditionnel Niger',
      secteurActivite: 'Textile',
      registreCommerce: 'RC-2023-002',
      produitsProposes: 'Pagnes tissés, Boubous brodés',
      listeProduitsDetaillee: 'Pagnes traditionnels, Boubous homme et femme, Sacs en tissu, Nappes décoratives',
      capaciteProduction: '50 pièces par mois',
      experienceAnterieure: '8 ans dans le tissage traditionnel',
      sitePreference: 'Site N°2 - Ex-Marché Djémadjé',
      tailleKiosque: '15-20 m²',
      nombreEmployes: 5,
      acceptEngagement: true,
      acceptFraisStand: true,
      status: 'EN_ATTENTE',
    },
    {
      numeroReference: 'EXP-12345-003',
      typeInscription: 'autre-personne',
      localisation: 'region',
      region: 'Maradi',
      nom: 'Ibrahim',
      prenom: 'Salamatou',
      nationalite: 'Nigérienne',
      age: 42,
      sexe: 'Femme',
      telephone: '00227 98 34 56 78',
      email: 'salamatou.ibrahim@email.com',
      adresse: '789 Quartier Sabon Gari, Maradi',
      nomEntreprise: 'Arachides du Sahel',
      secteurActivite: 'Agroalimentaire',
      registreCommerce: 'RC-2023-003',
      produitsProposes: 'Huile d\'arachide, Pâte d\'arachide',
      listeProduitsDetaillee: 'Huile d\'arachide pure, Pâte d\'arachide naturelle, Arachides grillées, Tourteaux d\'arachide',
      capaciteProduction: '200 litres d\'huile par semaine',
      experienceAnterieure: '10 ans dans la transformation d\'arachides',
      sitePreference: 'Site N°1 - Ex-OPVN',
      tailleKiosque: '20-25 m²',
      nombreEmployes: 8,
      acceptEngagement: true,
      acceptFraisStand: true,
      status: 'APPROUVE',
    },
    {
      numeroReference: 'EXP-12345-004',
      typeInscription: 'moi-meme',
      localisation: 'niamey',
      nom: 'Oumarou',
      prenom: 'Ali',
      nationalite: 'Nigérienne',
      age: 31,
      sexe: 'Homme',
      telephone: '00227 99 45 67 89',
      email: 'ali.oumarou@email.com',
      adresse: '321 Boulevard Mali Béro, Niamey',
      nomEntreprise: 'Cuir du Niger',
      secteurActivite: 'Maroquinerie',
      registreCommerce: 'RC-2023-004',
      produitsProposes: 'Sacs en cuir, Chaussures, Ceintures',
      listeProduitsDetaillee: 'Sacs à main en cuir, Porte-monnaie, Sandales en cuir, Ceintures artisanales',
      capaciteProduction: '100 articles par mois',
      experienceAnterieure: '6 ans dans le travail du cuir',
      sitePreference: 'Site N°2 - Ex-Marché Djémadjé',
      tailleKiosque: '10-15 m²',
      nombreEmployes: 4,
      acceptEngagement: true,
      acceptFraisStand: true,
      status: 'EN_ATTENTE',
    },
    {
      numeroReference: 'EXP-12345-005',
      typeInscription: 'moi-meme',
      localisation: 'region',
      region: 'Zinder',
      nom: 'Mahamadou',
      prenom: 'Aïcha',
      nationalite: 'Nigérienne',
      age: 38,
      sexe: 'Femme',
      telephone: '00227 90 56 78 90',
      email: null,
      adresse: '654 Rue du Marché, Zinder',
      nomEntreprise: 'Épices du Damagaram',
      secteurActivite: 'Commerce',
      registreCommerce: null,
      produitsProposes: 'Épices locales, Condiments traditionnels',
      listeProduitsDetaillee: 'Piment sec, Gingembre moulu, Ail séché, Oignon séché, Mélanges d\'épices',
      capaciteProduction: '50 kg par semaine',
      experienceAnterieure: '12 ans dans le commerce d\'épices',
      sitePreference: 'Site N°1 - Ex-OPVN',
      tailleKiosque: '5-10 m²',
      nombreEmployes: 2,
      acceptEngagement: true,
      acceptFraisStand: true,
      status: 'REJETE',
      raisonRejet: 'Dossier incomplet - Registre de commerce manquant',
    },
  ];

  console.log('Suppression des anciennes demandes...');
  await prisma.demandeExposant.deleteMany();

  console.log('Création des demandes de test...');
  for (const demande of demandes) {
    await prisma.demandeExposant.create({
      data: demande,
    });
    console.log(`Demande créée: ${demande.numeroReference} - ${demande.prenom} ${demande.nom}`);
  }

  console.log('✅ 5 demandes de test ont été créées avec succès!');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
