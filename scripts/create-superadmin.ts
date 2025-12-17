#!/usr/bin/env ts-node

/**
 * Script pour créer un super administrateur en production
 * Usage: npx ts-node scripts/create-superadmin.ts
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function main() {
  console.log('\n🔐 Création d\'un Super Administrateur\n');
  console.log('=' .repeat(50));
  console.log('\n⚠️  ATTENTION: Ce script est destiné à la production.');
  console.log('   Assurez-vous d\'utiliser des identifiants sécurisés!\n');

  try {
    // Demander les informations
    const nom = await question('Nom: ');
    if (!nom.trim()) {
      console.error('❌ Le nom est obligatoire');
      process.exit(1);
    }

    const prenom = await question('Prénom: ');
    if (!prenom.trim()) {
      console.error('❌ Le prénom est obligatoire');
      process.exit(1);
    }

    let email = '';
    while (!email) {
      email = await question('Email: ');
      if (!validateEmail(email)) {
        console.error('❌ Email invalide. Veuillez réessayer.');
        email = '';
      }
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`\n❌ Un utilisateur avec l'email ${email} existe déjà!`);
      const update = await question('\nVoulez-vous mettre à jour cet utilisateur? (oui/non): ');
      
      if (update.toLowerCase() !== 'oui') {
        console.log('\n❌ Opération annulée.');
        process.exit(0);
      }
    }

    let password = '';
    while (!password) {
      password = await question('\nMot de passe (min 8 caractères, majuscule, minuscule, chiffre et caractère spécial): ');
      if (!validatePassword(password)) {
        console.error('❌ Mot de passe trop faible. Doit contenir:');
        console.error('   - Au moins 8 caractères');
        console.error('   - Une majuscule');
        console.error('   - Une minuscule');
        console.error('   - Un chiffre');
        console.error('   - Un caractère spécial (@$!%*?&)');
        password = '';
      }
    }

    const passwordConfirm = await question('Confirmer le mot de passe: ');
    if (password !== passwordConfirm) {
      console.error('\n❌ Les mots de passe ne correspondent pas!');
      process.exit(1);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Confirmation finale
    console.log('\n📋 Récapitulatif:');
    console.log('─'.repeat(50));
    console.log(`   Nom: ${nom}`);
    console.log(`   Prénom: ${prenom}`);
    console.log(`   Email: ${email}`);
    console.log(`   Rôle: SUPER_ADMIN`);
    console.log('─'.repeat(50));

    const confirm = await question('\nConfirmer la création? (oui/non): ');
    if (confirm.toLowerCase() !== 'oui') {
      console.log('\n❌ Opération annulée.');
      process.exit(0);
    }

    // Créer ou mettre à jour l'utilisateur
    if (existingUser) {
      await prisma.admin.update({
        where: { email },
        data: {
          nom,
          prenom,
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          actif: true,
        },
      });
      console.log('\n✅ Super administrateur mis à jour avec succès!');
    } else {
      await prisma.admin.create({
        data: {
          nom,
          prenom,
          email,
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          actif: true,
        },
      });
      console.log('\n✅ Super administrateur créé avec succès!');
    }

    console.log('\n🔐 Identifiants de connexion:');
    console.log('─'.repeat(50));
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: [le mot de passe que vous avez saisi]`);
    console.log('─'.repeat(50));
    console.log('\n⚠️  IMPORTANT: Conservez ces identifiants en lieu sûr!\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la création du super administrateur:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
