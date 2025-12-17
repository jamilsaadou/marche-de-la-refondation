# 📜 Scripts de Gestion

Ce dossier contient les scripts utilitaires pour la gestion du projet.

## 🔐 create-superadmin.ts

Script interactif pour créer un super administrateur de manière sécurisée.

### Utilisation Rapide

```bash
# Méthode 1: Via npm (recommandé)
npm run create-superadmin

# Méthode 2: Via npx
npx ts-node scripts/create-superadmin.ts

# Méthode 3: Via ts-node directement
ts-node scripts/create-superadmin.ts
```

### Ce que le script fait

✅ Demande les informations de l'utilisateur de manière interactive  
✅ Valide l'email et la force du mot de passe  
✅ Vérifie si l'utilisateur existe déjà  
✅ Hash le mot de passe de manière sécurisée (bcrypt)  
✅ Crée ou met à jour l'utilisateur dans la base de données  

### Caractéristiques de sécurité

- 🔒 Le mot de passe n'est jamais stocké dans le code
- 🔒 Validation de la force du mot de passe
- 🔒 Hashage bcrypt avec 10 rounds
- 🔒 Confirmation du mot de passe requise
- 🔒 Récapitulatif avant création

### Exemple d'utilisation

```bash
$ npm run create-superadmin

🔐 Création d'un Super Administrateur

==================================================

⚠️  ATTENTION: Ce script est destiné à la production.
   Assurez-vous d'utiliser des identifiants sécurisés!

Nom: Mahamadou
Prénom: Issoufou
Email: admin@marche-refondation.ne

Mot de passe (min 8 caractères, majuscule, minuscule, chiffre et caractère spécial): 
Confirmer le mot de passe: 

📋 Récapitulatif:
──────────────────────────────────────────────────
   Nom: Mahamadou
   Prénom: Issoufou
   Email: admin@marche-refondation.ne
   Rôle: SUPER_ADMIN
──────────────────────────────────────────────────

Confirmer la création? (oui/non): oui

✅ Super administrateur créé avec succès!
```

## 📚 Documentation Complète

Pour une documentation complète, consultez:
- [CREATION_SUPERADMIN_PRODUCTION.md](../CREATION_SUPERADMIN_PRODUCTION.md) - Guide complet avec 3 méthodes de création

## 🆘 En cas de problème

Si vous rencontrez des erreurs:

1. **Vérifiez que la base de données est accessible**
   ```bash
   npx prisma db pull
   ```

2. **Vérifiez que ts-node est installé**
   ```bash
   npm install --save-dev ts-node
   ```

3. **Vérifiez les variables d'environnement**
   ```bash
   cat .env | grep DATABASE_URL
   ```

4. **Consultez la documentation complète**
   - Voir [CREATION_SUPERADMIN_PRODUCTION.md](../CREATION_SUPERADMIN_PRODUCTION.md)
