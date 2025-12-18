# 🚀 Création du Super Administrateur Après Déploiement

Ce guide explique comment créer un super administrateur **après avoir déployé votre application** sur un serveur de production.

## 📋 Table des Matières

1. [Selon Votre Plateforme de Déploiement](#selon-votre-plateforme-de-déploiement)
2. [Option 1: Serveur VPS/Dédié (Recommandé)](#option-1-serveur-vpsdédié-recommandé)
3. [Option 2: Vercel/Netlify (Serverless)](#option-2-vercelnetlify-serverless)
4. [Option 3: Via l'API REST](#option-3-via-lapi-rest)
5. [Option 4: Depuis votre Machine Locale](#option-4-depuis-votre-machine-locale)

---

## Selon Votre Plateforme de Déploiement

| Plateforme | Méthode Recommandée | Difficulté |
|------------|---------------------|------------|
| VPS (Digital Ocean, Linode, OVH) | SSH + Script | ⭐ Facile |
| Serveur Dédié | SSH + Script | ⭐ Facile |
| Vercel/Netlify | API REST ou Local | ⭐⭐ Moyen |
| Heroku | Heroku CLI | ⭐⭐ Moyen |
| Docker | Container exec | ⭐⭐ Moyen |

---

## Option 1: Serveur VPS/Dédié (Recommandé)

### ✅ Si vous avez déployé sur un VPS (Digital Ocean, OVH, Contabo, etc.)

#### Étape 1: Connectez-vous à votre serveur via SSH

```bash
ssh root@votre-serveur-production.com
# ou
ssh utilisateur@123.45.67.89
```

#### Étape 2: Naviguez vers le répertoire de l'application

```bash
cd /var/www/marche-refondation
# ou le chemin où vous avez déployé l'application
# Exemples courants:
# cd /home/username/marche-refondation
# cd /opt/marche-refondation
```

#### Étape 3: Vérifiez que les dépendances sont installées

```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Installer les dépendances si nécessaire
npm install
```

#### Étape 4: Exécutez le script de création

```bash
npm run create-superadmin
```

#### Étape 5: Suivez les instructions interactives

```
🔐 Création d'un Super Administrateur

==================================================

Nom: [Votre nom]
Prénom: [Votre prénom]
Email: admin@votre-domaine.com
Mot de passe: [Mot de passe sécurisé]
Confirmer le mot de passe: [Même mot de passe]

Confirmer la création? (oui/non): oui

✅ Super administrateur créé avec succès!
```

#### Étape 6: Testez la connexion

```bash
# Ouvrez votre navigateur et allez sur:
https://votre-domaine.com/admin/login
```

---

## Option 2: Vercel/Netlify (Serverless)

### ⚠️ Problème avec les plateformes serverless

Les plateformes comme Vercel et Netlify ne permettent pas d'exécuter des scripts interactifs directement car elles sont **serverless**. Voici les solutions :

### Solution A: Créer depuis votre machine locale

Vous pouvez vous connecter à la base de données de production depuis votre machine locale.

#### Étape 1: Configurez les variables d'environnement localement

```bash
# Créez un fichier .env.production
cd marche-refondation
nano .env.production
```

Ajoutez la connexion à votre base de données de production :
```env
DATABASE_URL="mysql://user:password@production-host:3306/database"
```

#### Étape 2: Exécutez le script avec la configuration production

```bash
# Utilisez la variable d'environnement production
DATABASE_URL="mysql://user:password@production-host:3306/database" npm run create-superadmin
```

### Solution B: Via l'API de Setup (Plus rapide)

#### Créez un endpoint temporaire pour la création

Créez un fichier `app/api/admin/create-superadmin/route.ts` (temporaire) :

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ⚠️ À SUPPRIMER APRÈS UTILISATION !
export async function POST(request: Request) {
  try {
    // Vérifiez un secret pour sécuriser l'endpoint
    const { secret, email, password, nom, prenom } = await request.json();
    
    // Définissez un secret dans vos variables d'environnement
    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        error: 'Un super admin existe déjà' 
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role: 'SUPER_ADMIN',
        actif: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      admin: { id: admin.id, email: admin.email } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
```

#### Ajoutez le secret dans Vercel/Netlify

```bash
# Dans Vercel Dashboard:
Settings → Environment Variables → Add
Nom: SETUP_SECRET
Valeur: un-secret-tres-complexe-et-aleatoire-12345

# Ou via CLI
vercel env add SETUP_SECRET
```

#### Appelez l'API

```bash
curl -X POST https://votre-app.vercel.app/api/admin/create-superadmin \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "un-secret-tres-complexe-et-aleatoire-12345",
    "email": "admin@votre-domaine.com",
    "password": "VotreMotDePasse@2024",
    "nom": "Votre",
    "prenom": "Nom"
  }'
```

#### ⚠️ IMPORTANT: Supprimez l'endpoint après utilisation !

```bash
# Supprimez le fichier
rm app/api/admin/create-superadmin/route.ts

# Commitez et redéployez
git add .
git commit -m "Remove temporary admin creation endpoint"
git push
```

---

## Option 3: Via l'API REST

### Si vous avez accès à un outil comme Postman ou curl

#### Utilisez l'API existante `/api/auth/setup`

```bash
# Vérifiez d'abord si l'endpoint existe
curl https://votre-domaine.com/api/auth/setup

# Si l'endpoint renvoie qu'il faut créer un admin, utilisez-le
curl -X POST https://votre-domaine.com/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@votre-domaine.com",
    "password": "MotDePasse@Securise2024",
    "nom": "Votre Nom",
    "prenom": "Votre Prénom"
  }'
```

---

## Option 4: Depuis votre Machine Locale

### Connexion directe à la base de données de production

#### Étape 1: Obtenez les informations de connexion

Depuis votre tableau de bord d'hébergement (Vercel, Netlify, etc.), récupérez :
- L'URL de connexion MySQL
- Le nom de la base de données
- Le nom d'utilisateur et mot de passe

#### Étape 2: Configurez la connexion locale

```bash
# Créez un fichier .env.production.local
cd marche-refondation
```

Ajoutez dans `.env.production.local` :
```env
DATABASE_URL="mysql://username:password@production-host.com:3306/database_name"
```

#### Étape 3: Exécutez le script

```bash
# Avec la variable d'environnement
export $(cat .env.production.local | xargs)
npm run create-superadmin
```

#### Étape 4: Testez

Allez sur votre site en production et testez la connexion.

---

## 🔒 Sécurité Après Création

### ⚠️ Actions importantes après avoir créé le super admin

1. **Supprimez les endpoints temporaires**
   ```bash
   rm app/api/admin/create-superadmin/route.ts
   ```

2. **Changez le mot de passe après la première connexion**
   - Connectez-vous à l'interface admin
   - Allez dans Profil → Changer le mot de passe

3. **Supprimez les variables d'environnement temporaires**
   ```bash
   vercel env rm SETUP_SECRET
   ```

4. **Vérifiez les logs d'accès**
   ```bash
   # Sur votre serveur
   tail -f /var/log/nginx/access.log
   ```

5. **Désactivez l'endpoint /api/auth/setup si nécessaire**

---

## 📝 Exemple Complet: Digital Ocean

### Scénario: Application déployée sur Digital Ocean Droplet

```bash
# 1. Connexion SSH
ssh root@167.99.123.45

# 2. Navigation vers l'application
cd /var/www/marche-refondation

# 3. Vérification de l'environnement
pm2 list  # Si vous utilisez PM2
# ou
docker ps  # Si vous utilisez Docker

# 4. Exécution du script
npm run create-superadmin

# 5. Suivre les instructions
# Nom: Administrateur
# Prénom: Principal
# Email: admin@marche-refondation.ne
# Mot de passe: [Saisir un mot de passe fort]

# 6. Vérification
mysql -u dbuser -p
use marche_refondation;
SELECT email, role FROM Admin WHERE role = 'SUPER_ADMIN';
exit;

# 7. Test de connexion
curl https://votre-domaine.com/admin/login
```

---

## 🆘 Dépannage

### Erreur: "Cannot find module 'ts-node'"

```bash
npm install --save-dev ts-node
```

### Erreur: "Database connection refused"

```bash
# Vérifiez que la base de données est accessible
mysql -h hostname -u username -p -e "SELECT 1;"

# Vérifiez les variables d'environnement
echo $DATABASE_URL
# ou
cat .env | grep DATABASE_URL
```

### Erreur: "Permission denied"

```bash
# Ajoutez les permissions d'exécution
chmod +x scripts/create-superadmin.ts

# Ou utilisez sudo
sudo npm run create-superadmin
```

### Impossible de se connecter en SSH

```bash
# Utilisez la console web de votre hébergeur
# Exemples:
# - Digital Ocean: Droplet Console
# - AWS: EC2 Instance Connect
# - OVH: Console VNC
```

---

## 📚 Ressources Supplémentaires

- [Guide de déploiement Next.js](https://nextjs.org/docs/deployment)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Netlify](https://docs.netlify.com/)
- [Guide complet de création super admin](./CREATION_SUPERADMIN_PRODUCTION.md)

---

## ✅ Checklist de Déploiement

Avant de créer le super admin en production :

- [ ] L'application est déployée et fonctionne
- [ ] La base de données est créée et accessible
- [ ] Les migrations Prisma sont exécutées (`npx prisma migrate deploy`)
- [ ] Les variables d'environnement sont configurées
- [ ] Le fichier .env contient DATABASE_URL correct
- [ ] Node.js et npm sont installés sur le serveur
- [ ] Vous avez accès SSH au serveur (ou méthode alternative)

Après création du super admin :

- [ ] Le super admin a été créé avec succès
- [ ] Vous pouvez vous connecter à l'interface admin
- [ ] Le mot de passe a été changé après la première connexion
- [ ] Les endpoints temporaires ont été supprimés
- [ ] Les logs d'accès sont surveillés
- [ ] Les identifiants sont sauvegardés en lieu sûr

---

**Date:** 17/12/2025  
**Version:** 1.0  
**Projet:** Marche de la Refondation
