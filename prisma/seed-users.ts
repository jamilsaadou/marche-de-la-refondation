import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed des utilisateurs...');

  // Supprimer tous les utilisateurs existants (optionnel, à décommenter si besoin)
  // await prisma.admin.deleteMany({});
  // console.log('✓ Utilisateurs existants supprimés');

  // Créer les utilisateurs avec différents rôles
  const users = [
    {
      email: 'superadmin@marche-refondation.ne',
      password: await bcrypt.hash('SuperAdmin@2024', 10),
      nom: 'Mahamadou',
      prenom: 'Issoufou',
      role: 'SUPER_ADMIN',
      actif: true,
    },
    {
      email: 'admin@marche-refondation.ne',
      password: await bcrypt.hash('Admin@2024', 10),
      nom: 'Aissata',
      prenom: 'Abdoulaye',
      role: 'ADMIN',
      actif: true,
    },
    {
      email: 'superviseur@marche-refondation.ne',
      password: await bcrypt.hash('Superviseur@2024', 10),
      nom: 'Ibrahim',
      prenom: 'Saidou',
      role: 'SUPERVISEUR',
      actif: true,
    },
    {
      email: 'jury1@marche-refondation.ne',
      password: await bcrypt.hash('Jury@2024', 10),
      nom: 'Aïcha',
      prenom: 'Moussa',
      role: 'JURY',
      actif: true,
    },
    {
      email: 'jury2@marche-refondation.ne',
      password: await bcrypt.hash('Jury@2024', 10),
      nom: 'Amadou',
      prenom: 'Hassan',
      role: 'JURY',
      actif: true,
    },
    {
      email: 'jury3@marche-refondation.ne',
      password: await bcrypt.hash('Jury@2024', 10),
      nom: 'Mariama',
      prenom: 'Ali',
      role: 'JURY',
      actif: true,
    },
    {
      email: 'gestionnaire1@marche-refondation.ne',
      password: await bcrypt.hash('Gestionnaire@2024', 10),
      nom: 'Ousmane',
      prenom: 'Garba',
      role: 'GESTIONNAIRE',
      actif: true,
    },
    {
      email: 'gestionnaire2@marche-refondation.ne',
      password: await bcrypt.hash('Gestionnaire@2024', 10),
      nom: 'Fati',
      prenom: 'Abdou',
      role: 'GESTIONNAIRE',
      actif: true,
    },
    {
      email: 'comptable@marche-refondation.ne',
      password: await bcrypt.hash('Comptable@2024', 10),
      nom: 'Harouna',
      prenom: 'Issa',
      role: 'COMPTABLE',
      actif: true,
    },
    {
      email: 'test.inactif@marche-refondation.ne',
      password: await bcrypt.hash('Test@2024', 10),
      nom: 'Test',
      prenom: 'Inactif',
      role: 'JURY',
      actif: false,
    },
  ];

  console.log(`\n📝 Création de ${users.length} utilisateurs...\n`);

  for (const userData of users) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.admin.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⚠️  ${userData.email} existe déjà, ignoré`);
        continue;
      }

      const user = await prisma.admin.create({
        data: userData,
      });

      console.log(`✅ ${user.email} créé (${user.role})`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création de ${userData.email}:`, error);
    }
  }

  console.log('\n🎉 Seed des utilisateurs terminé avec succès!\n');
  
  // Afficher un récapitulatif
  const totalUsers = await prisma.admin.count();
  const activeUsers = await prisma.admin.count({ where: { actif: true } });
  
  console.log('📊 Récapitulatif:');
  console.log(`   Total utilisateurs: ${totalUsers}`);
  console.log(`   Utilisateurs actifs: ${activeUsers}`);
  console.log(`   Utilisateurs inactifs: ${totalUsers - activeUsers}\n`);

  // Afficher les identifiants de connexion
  console.log('🔐 Identifiants de connexion créés:\n');
  console.log('┌─────────────────────┬──────────────────────────────────────┬─────────────────────┐');
  console.log('│ Rôle                │ Email                                │ Mot de passe        │');
  console.log('├─────────────────────┼──────────────────────────────────────┼─────────────────────┤');
  console.log('│ SUPER_ADMIN         │ superadmin@marche-refondation.ne     │ SuperAdmin@2024     │');
  console.log('│ ADMIN               │ admin@marche-refondation.ne          │ Admin@2024          │');
  console.log('│ SUPERVISEUR         │ superviseur@marche-refondation.ne    │ Superviseur@2024    │');
  console.log('│ JURY                │ jury1@marche-refondation.ne          │ Jury@2024           │');
  console.log('│ JURY                │ jury2@marche-refondation.ne          │ Jury@2024           │');
  console.log('│ JURY                │ jury3@marche-refondation.ne          │ Jury@2024           │');
  console.log('│ GESTIONNAIRE        │ gestionnaire1@marche-refondation.ne  │ Gestionnaire@2024   │');
  console.log('│ GESTIONNAIRE        │ gestionnaire2@marche-refondation.ne  │ Gestionnaire@2024   │');
  console.log('│ COMPTABLE           │ comptable@marche-refondation.ne      │ Comptable@2024      │');
  console.log('│ JURY (INACTIF)      │ test.inactif@marche-refondation.ne   │ Test@2024           │');
  console.log('└─────────────────────┴──────────────────────────────────────┴─────────────────────┘\n');
  
  console.log('⚠️  IMPORTANT: Changez ces mots de passe après la première connexion!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
