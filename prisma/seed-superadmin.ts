import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création du super administrateur...\n');

  const superAdminData = {
    email: 'me.jamilou@gmail.com',
    password: await bcrypt.hash('123456', 10),
    nom: 'Jamilou',
    prenom: 'Admin',
    role: 'SUPER_ADMIN',
    actif: true,
  };

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.admin.findUnique({
      where: { email: superAdminData.email },
    });

    if (existingUser) {
      console.log(`⚠️  L'utilisateur ${superAdminData.email} existe déjà.`);
      console.log('   Mise à jour des informations...\n');
      
      // Mettre à jour l'utilisateur existant
      const updatedUser = await prisma.admin.update({
        where: { email: superAdminData.email },
        data: {
          password: superAdminData.password,
          nom: superAdminData.nom,
          prenom: superAdminData.prenom,
          role: superAdminData.role,
          actif: superAdminData.actif,
        },
      });

      console.log(`✅ Utilisateur ${updatedUser.email} mis à jour avec succès!\n`);
    } else {
      // Créer le nouvel utilisateur
      const newUser = await prisma.admin.create({
        data: superAdminData,
      });

      console.log(`✅ Super administrateur ${newUser.email} créé avec succès!\n`);
    }

    console.log('🎉 Opération terminée avec succès!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔐 IDENTIFIANTS DE CONNEXION');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Email       : ${superAdminData.email}`);
    console.log(`   Mot de passe: 123456`);
    console.log(`   Rôle        : SUPER_ADMIN`);
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!\n');

  } catch (error) {
    console.error(`❌ Erreur lors de la création du super admin:`, error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
