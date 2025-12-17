# 👥 Identifiants des Utilisateurs du Système

## 📋 Liste des Utilisateurs Créés

Le système contient actuellement **10 utilisateurs actifs** et **1 utilisateur inactif** pour tester toutes les fonctionnalités de gestion.

---

## 🔐 Identifiants de Connexion

### Super Administrateur
| Rôle | Email | Mot de passe | Statut |
|------|-------|--------------|--------|
| **SUPER_ADMIN** | `superadmin@marche-refondation.ne` | `SuperAdmin@2024` | ✅ Actif |

**Permissions :**
- Accès complet à toutes les fonctionnalités
- Peut créer/modifier/supprimer d'autres SUPER_ADMIN
- Gestion complète du système

---

### Administrateur
| Rôle | Email | Mot de passe | Statut |
|------|-------|--------------|--------|
| **ADMIN** | `admin@marche-refondation.ne` | `Admin@2024` | ✅ Actif |

**Permissions :**
- Gestion des utilisateurs (sauf SUPER_ADMIN)
- Accès à toutes les fonctionnalités administratives
- Ne peut pas créer de SUPER_ADMIN

---

### Superviseur
| Rôle | Email | Mot de passe | Statut |
|------|-------|--------------|--------|
| **SUPERVISEUR** | `superviseur@marche-refondation.ne` | `Superviseur@2024` | ✅ Actif |

**Permissions :**
- Supervision des opérations
- Validation des processus
- Accès en lecture à la plupart des sections

---

### Membres du Jury (3 utilisateurs)
| Nom | Email | Mot de passe | Statut |
|-----|-------|--------------|--------|
| Aïcha Moussa | `jury1@marche-refondation.ne` | `Jury@2024` | ✅ Actif |
| Amadou Hassan | `jury2@marche-refondation.ne` | `Jury@2024` | ✅ Actif |
| Mariama Ali | `jury3@marche-refondation.ne` | `Jury@2024` | ✅ Actif |

**Permissions :**
- Évaluation des candidats exposants
- Accès aux demandes d'exposants
- Notation et ajout de commentaires

---

### Gestionnaires (2 utilisateurs)
| Nom | Email | Mot de passe | Statut |
|-----|-------|--------------|--------|
| Ousmane Garba | `gestionnaire1@marche-refondation.ne` | `Gestionnaire@2024` | ✅ Actif |
| Fati Abdou | `gestionnaire2@marche-refondation.ne` | `Gestionnaire@2024` | ✅ Actif |

**Permissions :**
- Gestion quotidienne du marché
- Attribution des kiosques
- Gestion des exposants

---

### Comptable
| Rôle | Email | Mot de passe | Statut |
|------|-------|--------------|--------|
| **COMPTABLE** | `comptable@marche-refondation.ne` | `Comptable@2024` | ✅ Actif |

**Permissions :**
- Gestion financière
- Suivi des paiements
- Génération de rapports financiers

---

### Utilisateur de Test (Inactif)
| Nom | Email | Mot de passe | Statut |
|-----|-------|--------------|--------|
| Test Inactif | `test.inactif@marche-refondation.ne` | `Test@2024` | ❌ Inactif |

**Utilisation :** Tester la fonctionnalité de désactivation de compte

---

## 🔑 Informations Importantes

### Sécurité
⚠️ **IMPORTANT :** Ces mots de passe sont temporaires et doivent être changés immédiatement après la première connexion !

### Recommandations
1. Changez tous les mots de passe lors de la première connexion
2. Utilisez des mots de passe forts (min 12 caractères)
3. Ne partagez jamais vos identifiants
4. Déconnectez-vous après chaque session

### Politique des mots de passe
- Minimum 8 caractères (recommandé 12+)
- Combinaison de majuscules, minuscules, chiffres et symboles
- Changement régulier recommandé
- Pas de réutilisation de mots de passe

---

## 🚀 Comment se connecter

1. Allez sur : `http://localhost:3002/admin/login`
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"
4. Vous serez redirigé vers le tableau de bord

---

## 🛠️ Gestion des Utilisateurs

### Créer un nouvel utilisateur (Admin uniquement)
```bash
# Via l'interface web
1. Connectez-vous en tant qu'Admin ou Super Admin
2. Allez dans "Utilisateurs"
3. Cliquez sur "Ajouter Utilisateur"
4. Remplissez le formulaire
5. Validez

# Via API
POST /api/users
Headers: Authorization: Bearer <token>
Body: {
  "email": "nouveau@marche-refondation.ne",
  "password": "MotDePasse123!",
  "nom": "Nom",
  "prenom": "Prénom",
  "role": "JURY"
}
```

### Modifier un utilisateur
```bash
PUT /api/users
Headers: Authorization: Bearer <token>
Body: {
  "id": "user_id",
  "nom": "Nouveau Nom",
  "actif": true
}
```

### Désactiver un utilisateur
Au lieu de supprimer un utilisateur, il est recommandé de le désactiver :
```bash
PUT /api/users
Headers: Authorization: Bearer <token>
Body: {
  "id": "user_id",
  "actif": false
}
```

---

## 📊 Statistiques Actuelles

- **Total utilisateurs :** 11
- **Utilisateurs actifs :** 10
- **Utilisateurs inactifs :** 1

### Répartition par rôle
- SUPER_ADMIN : 1
- ADMIN : 1
- SUPERVISEUR : 1
- JURY : 4 (dont 1 inactif)
- GESTIONNAIRE : 2
- COMPTABLE : 1

---

## 🔄 Réinitialiser les Utilisateurs

Si vous souhaitez réinitialiser tous les utilisateurs et repartir de zéro :

```bash
# Exécuter le script seed
npx tsx prisma/seed-users.ts
```

**Note :** Le script ne supprime pas les utilisateurs existants par défaut. Pour supprimer d'abord tous les utilisateurs, décommentez la ligne dans le script :
```typescript
// await prisma.admin.deleteMany({});
```

---

## 📞 Support

En cas de problème avec un compte :
1. Contactez un Super Admin
2. Vérifiez que le compte est actif
3. Vérifiez les logs serveur pour les erreurs
4. Consultez le guide d'authentification : `AUTHENTICATION_GUIDE.md`

---

## 📝 Notes de Version

**Version :** 1.0  
**Date de création :** 17 décembre 2025  
**Créé par :** Système de seed automatique  

---

## ⚡ Accès Rapide

- **Login :** http://localhost:3002/admin/login
- **Dashboard Admin :** http://localhost:3002/admin
- **API Docs :** Voir `AUTHENTICATION_GUIDE.md`
- **Configuration :** `.env`

---

**🔒 Confidentialité :** Ce document contient des informations sensibles. Ne le partagez pas publiquement.
