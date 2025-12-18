# Guide d'utilisation du Seed Super Admin

## 📝 Description

Ce document explique comment créer ou mettre à jour le super administrateur avec les identifiants personnalisés.

## 🔐 Identifiants du Super Admin

```
Email       : me.jamilou@gmail.com
Mot de passe: 123456
Rôle        : SUPER_ADMIN
```

## 🚀 Utilisation

### Exécuter le seed

Pour créer ou mettre à jour le super administrateur, exécutez la commande suivante :

```bash
npx tsx prisma/seed-superadmin.ts
```

ou

```bash
npm run seed:superadmin
```

### Ce que fait le seed

1. **Si l'utilisateur n'existe pas** : Il crée un nouveau super administrateur avec les identifiants spécifiés
2. **Si l'utilisateur existe déjà** : Il met à jour les informations (mot de passe, rôle, etc.)

## 📋 Autres seeds disponibles

### Seed complet des utilisateurs
Pour créer plusieurs utilisateurs de test avec différents rôles :

```bash
npx tsx prisma/seed-users.ts
```

### Seed général
Pour le seed général de la base de données :

```bash
npx prisma db seed
```

## ⚠️ Sécurité

**IMPORTANT** : Après la première connexion, changez le mot de passe par défaut !

Pour changer le mot de passe :
1. Connectez-vous avec les identifiants fournis
2. Accédez aux paramètres du compte
3. Modifiez le mot de passe

## 🔧 Modification du seed

Si vous souhaitez modifier les informations du super admin, éditez le fichier :
```
prisma/seed-superadmin.ts
```

Puis relancez le seed pour appliquer les changements.

## 📚 Structure de l'utilisateur

```typescript
{
  email: 'me.jamilou@gmail.com',
  password: 'hashé avec bcrypt',
  nom: 'Jamilou',
  prenom: 'Admin',
  role: 'SUPER_ADMIN',
  actif: true
}
```

## 🆘 Dépannage

### Erreur de connexion à la base de données
Vérifiez que :
- La base de données est démarrée
- Le fichier `.env` contient la bonne URL de connexion
- Les migrations Prisma sont à jour : `npx prisma migrate dev`

### L'utilisateur n'est pas créé
- Vérifiez les logs de la commande
- Assurez-vous que le schéma Prisma est synchronisé : `npx prisma generate`

---

**Date de création** : 18/12/2025
**Dernière mise à jour** : 18/12/2025
