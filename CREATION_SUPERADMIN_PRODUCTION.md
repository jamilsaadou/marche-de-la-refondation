# 🔐 Guide de Création du Super Administrateur en Production

Ce document explique comment créer un compte super administrateur sécurisé pour votre environnement de production.

## 📋 Table des Matières

1. [Méthodes Disponibles](#méthodes-disponibles)
2. [Méthode 1: Script Interactif (Recommandé)](#méthode-1-script-interactif-recommandé)
3. [Méthode 2: Via le Seed Users](#méthode-2-via-le-seed-users)
4. [Méthode 3: Manuellement via la Base de Données](#méthode-3-manuellement-via-la-base-de-données)
5. [Sécurité et Bonnes Pratiques](#sécurité-et-bonnes-pratiques)

---

## Méthodes Disponibles

Il existe **3 méthodes** pour créer un super administrateur en production :

| Méthode | Recommandation | Cas d'Usage |
|---------|----------------|-------------|
| Script Interactif | ⭐⭐⭐ **RECOMMANDÉ** | Production, sécurité maximale |
| Seed Users | ⭐⭐ Acceptable | Développement, tests |
| Base de Données | ⭐ Avancé | Dépannage uniquement |

---

## Méthode 1: Script Interactif (Recommandé)

### ✅ Avantages
- ✓ Saisie sécurisée du mot de passe (pas stocké dans le code)
- ✓ Validation des données en temps réel
- ✓ Vérification de la force du mot de passe
- ✓ Possibilité de mettre à jour un utilisateur existant

### 📝 Prérequis

```bash
# 1. Assurez-vous que vous êtes dans le bon répertoire
cd marche-refondation

# 2. Vérifiez que vos variables d'environnement sont configurées
cat .env | grep DATABASE_URL
```

### 🚀 Utilisation

#### Étape 1: Connectez-vous à votre serveur de production

```bash
ssh utilisateur@votre-serveur-production.com
```

#### Étape 2: Naviguez vers le répertoire du projet

```bash
cd /chemin/vers/marche-refondation
```

#### Étape 3: Exécutez le script

```bash
npx ts-node scripts/create-superadmin.ts
```

#### Étape 4: Suivez les instructions interactives

Le script vous demandera :

```
🔐 Création d'un Super Administrateur

==================================================

⚠️  ATTENTION: Ce script est destiné à la production.
   Assurez-vous d'utiliser des identifiants sécurisés!

Nom: [Votre nom]
Prénom: [Votre prénom]
Email: [votre-email@domaine.com]

Mot de passe (min 8 caractères, majuscule, minuscule, chiffre et caractère spécial): 
Confirmer le mot de passe: 

📋 Récapitulatif:
──────────────────────────────────────────────────
   Nom: [Votre nom]
   Prénom: [Votre prénom]
   Email: [votre-email@domaine.com]
   Rôle: SUPER_ADMIN
──────────────────────────────────────────────────

Confirmer la création? (oui/non): oui
```

#### Étape 5: Résultat

```
✅ Super administrateur créé avec succès!

🔐 Identifiants de connexion:
──────────────────────────────────────────────────
   Email: votre-email@domaine.com
   Mot de passe: [le mot de passe que vous avez saisi]
──────────────────────────────────────────────────

⚠️  IMPORTANT: Conservez ces identifiants en lieu sûr!
```

### 🔒 Exigences du Mot de Passe

Le mot de passe doit contenir :
- ✓ **Minimum 8 caractères**
- ✓ Au moins **une majuscule** (A-Z)
- ✓ Au moins **une minuscule** (a-z)
- ✓ Au moins **un chiffre** (0-9)
- ✓ Au moins **un caractère spécial** (@$!%*?&)

**Exemples valides:**
- `SuperAdmin@2024`
- `MyS3cur3P@ssw0rd!`
- `Pr0duction$2024`

---

## Méthode 2: Via le Seed Users

### ⚠️ Attention
Cette méthode est **moins sécurisée** car les mots de passe sont stockés dans le code source. Elle est recommandée uniquement pour le développement.

### Utilisation en Production (Avec précautions)

#### Étape 1: Modifiez le fichier seed-users.ts

```bash
nano prisma/seed-users.ts
```

#### Étape 2: Ajoutez votre super admin personnalisé

```typescript
const users = [
  {
    email: 'votre-email-prod@domaine.com',
    password: await bcrypt.hash('VotreMotDePasseSecurise@2024', 10),
    nom: 'Votre Nom',
    prenom: 'Votre Prénom',
    role: 'SUPER_ADMIN',
    actif: true,
  },
  // ... autres utilisateurs si besoin
];
```

#### Étape 3: Exécutez le seed

```bash
# Pour TypeScript
npx ts-node prisma/seed-users.ts

# OU via npm si configuré
npm run seed:users
```

#### Étape 4: ⚠️ **TRÈS IMPORTANT** - Supprimez les credentials du code

```bash
# Après la création, modifiez le fichier pour supprimer les infos sensibles
# Ou supprimez complètement les utilisateurs de test
```

---

## Méthode 3: Manuellement via la Base de Données

### ⚠️ Pour Utilisateurs Avancés Uniquement

Cette méthode nécessite une connexion directe à la base de données MySQL.

### Étape 1: Générez un mot de passe hashé

Créez un fichier temporaire `generate-hash.js`:

```javascript
const bcrypt = require('bcryptjs');

const password = 'VotreMotDePasse@2024';
const hash = bcrypt.hashSync(password, 10);

console.log('Hash:', hash);
```

Exécutez:
```bash
node generate-hash.js
```

### Étape 2: Connectez-vous à MySQL

```bash
mysql -u votre_utilisateur -p marche_refondation_prod
```

### Étape 3: Insérez l'utilisateur

```sql
INSERT INTO Admin (
  id, 
  email, 
  password, 
  nom, 
  prenom, 
  role, 
  actif, 
  createdAt, 
  updatedAt
) VALUES (
  'unique_id_ici',
  'votre-email@domaine.com',
  'LE_HASH_GENERE_ETAPE_1',
  'Votre Nom',
  'Votre Prénom',
  'SUPER_ADMIN',
  1,
  NOW(),
  NOW()
);
```

### Étape 4: Vérifiez

```sql
SELECT id, email, nom, prenom, role, actif FROM Admin WHERE role = 'SUPER_ADMIN';
```

### Étape 5: Supprimez le fichier temporaire

```bash
rm generate-hash.js
```

---

## Sécurité et Bonnes Pratiques

### ✅ À Faire

1. **Utilisez des mots de passe forts**
   - Minimum 12 caractères pour la production
   - Mélange de majuscules, minuscules, chiffres et symboles
   - Utilisez un gestionnaire de mots de passe

2. **Changez le mot de passe immédiatement après la première connexion**
   ```
   Connexion → Profil → Changer le mot de passe
   ```

3. **Limitez le nombre de super admins**
   - Créez un seul super admin par défaut
   - Utilisez des rôles plus restreints pour les autres utilisateurs

4. **Activez l'authentification à deux facteurs (si disponible)**

5. **Surveillez les connexions**
   - Vérifiez régulièrement les logs d'authentification
   - Détectez les tentatives de connexion suspectes

6. **Sauvegardez les identifiants en lieu sûr**
   - Utilisez un gestionnaire de mots de passe d'entreprise
   - Ne les partagez jamais par email ou chat

### ❌ À Ne PAS Faire

1. ❌ **Ne commitez JAMAIS les identifiants dans Git**
   ```bash
   # Vérifiez que ces fichiers sont dans .gitignore
   .env
   prisma/seed-users.ts (si modifié avec vos vraais credentials)
   ```

2. ❌ **N'utilisez JAMAIS des mots de passe simples en production**
   - ❌ `admin123`
   - ❌ `password`
   - ❌ `123456`

3. ❌ **Ne partagez PAS le compte super admin**
   - Chaque personne doit avoir son propre compte

4. ❌ **N'utilisez PAS les credentials de développement en production**

---

## 🔄 Mise à Jour d'un Super Admin Existant

### Si vous devez réinitialiser le mot de passe

Utilisez le même script avec l'option de mise à jour :

```bash
npx ts-node scripts/create-superadmin.ts
```

Quand le script détecte que l'email existe déjà, il vous demandera :
```
❌ Un utilisateur avec l'email xxx@xxx.com existe déjà!

Voulez-vous mettre à jour cet utilisateur? (oui/non): oui
```

---

## 📞 Support

En cas de problème :

1. **Vérifiez les logs d'erreur**
   ```bash
   tail -f /var/log/application.log
   ```

2. **Vérifiez la connexion à la base de données**
   ```bash
   npx prisma db pull
   ```

3. **Testez la connexion**
   ```bash
   mysql -u user -p -h host database_name -e "SELECT 1;"
   ```

---

## 📚 Ressources Complémentaires

- [Documentation Prisma](https://www.prisma.io/docs)
- [Guide d'authentification du projet](./AUTHENTICATION_GUIDE.md)
- [Configuration MySQL](./CONFIGURATION_MYSQL.md)
- [Identifiants utilisateurs](./USERS_CREDENTIALS.md)

---

## 🔐 Checklist de Sécurité Production

Avant de mettre en production, assurez-vous que :

- [ ] Le super admin a un mot de passe fort (12+ caractères)
- [ ] Les variables d'environnement sont sécurisées
- [ ] Le fichier `.env` n'est PAS committé dans Git
- [ ] Les credentials de développement sont supprimés
- [ ] Les logs d'authentification sont activés
- [ ] Une sauvegarde de la base de données est planifiée
- [ ] Un plan de récupération de compte est en place
- [ ] L'accès SSH au serveur est sécurisé
- [ ] Les ports de la base de données ne sont pas exposés publiquement
- [ ] Un système de monitoring est en place

---

**Date de création:** 17/12/2025  
**Version:** 1.0  
**Auteur:** Équipe Marche de la Refondation
