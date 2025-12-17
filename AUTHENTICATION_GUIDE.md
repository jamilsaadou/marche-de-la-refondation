# Guide d'Authentification et Gestion des Utilisateurs

## Vue d'ensemble

Ce système fournit une authentification sécurisée basée sur JWT (JSON Web Tokens) avec gestion des sessions via cookies HttpOnly. Il inclut des fonctionnalités complètes de gestion des utilisateurs (CRUD) avec contrôle d'accès basé sur les rôles.

## 🔐 Sécurité

### Fonctionnalités de sécurité
- **JWT Token** : Tokens signés avec une clé secrète
- **Cookies HttpOnly** : Protection contre les attaques XSS
- **Hachage des mots de passe** : Utilisation de bcryptjs (10 rounds)
- **Validation stricte** : Vérification des entrées utilisateur
- **Contrôle d'accès basé sur les rôles** : Permissions granulaires
- **Sessions sécurisées** : Expiration automatique après 24h

### Configuration requise

1. **Variable d'environnement JWT_SECRET** dans `.env` :
```env
JWT_SECRET="marche-refondation-secret-key-2026-centenaire-niamey-change-in-production"
```
⚠️ **IMPORTANT** : Changez cette clé en production avec une valeur aléatoire sécurisée !

## 👥 Rôles et Permissions

### Hiérarchie des rôles

1. **SUPER_ADMIN** (Accès complet)
   - Toutes les permissions
   - Peut créer/modifier/supprimer d'autres SUPER_ADMIN
   - Gestion complète du système

2. **ADMIN**
   - Gestion des utilisateurs (sauf SUPER_ADMIN)
   - Accès à toutes les fonctionnalités administratives
   - Ne peut pas créer de SUPER_ADMIN

3. **SUPERVISEUR**
   - Supervision des opérations
   - Validation des processus
   - Accès en lecture à la plupart des sections

4. **JURY**
   - Évaluation des candidats
   - Accès aux demandes d'exposants
   - Notation et commentaires

5. **GESTIONNAIRE**
   - Gestion quotidienne
   - Attribution des kiosques
   - Gestion des exposants

6. **COMPTABLE**
   - Gestion financière
   - Paiements et rapports
   - Suivi des transactions

### Matrice des permissions

| Permission | SUPER_ADMIN | ADMIN | SUPERVISEUR | JURY | GESTIONNAIRE | COMPTABLE |
|-----------|-------------|-------|-------------|------|--------------|-----------|
| Gestion utilisateurs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Évaluation demandes | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Gestion exposants | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Attribution kiosques | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Gestion paiements | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Rapports financiers | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Paramètres système | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## 📡 API Endpoints

### 1. Authentification

#### POST `/api/auth/login`
Connexion d'un utilisateur.

**Request Body:**
```json
{
  "email": "admin@marche-refondation.ne",
  "password": "votre_mot_de_passe"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "admin@marche-refondation.ne",
    "nom": "Doe",
    "prenom": "John",
    "role": "ADMIN"
  },
  "message": "Connexion réussie"
}
```

**Notes:**
- Le token est également défini dans un cookie HttpOnly `auth-token`
- Durée de validité : 24 heures

---

#### GET `/api/auth/verify`
Vérifier la session active.

**Headers:**
```
Authorization: Bearer <token>
```
OU le cookie `auth-token` sera utilisé automatiquement

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "clxxx...",
    "email": "admin@marche-refondation.ne",
    "nom": "Doe",
    "prenom": "John",
    "role": "ADMIN"
  }
}
```

---

#### POST `/api/auth/logout`
Déconnexion utilisateur.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

**Notes:**
- Supprime le cookie `auth-token`

---

#### POST `/api/auth/setup`
Créer le premier administrateur (à utiliser une seule fois).

**Request Body:** Aucun

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin créé avec succès",
  "credentials": {
    "email": "admin@marche-refondation.ne",
    "password": "Admin@2024",
    "note": "Veuillez changer ce mot de passe après la première connexion"
  }
}
```

**Notes:**
- Ne fonctionne que si aucun admin n'existe
- À utiliser uniquement lors de l'initialisation

---

### 2. Gestion des Utilisateurs

#### GET `/api/users`
Récupérer tous les utilisateurs (Admin uniquement).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `role` (optionnel) : Filtrer par rôle (ADMIN, JURY, etc.)
- `actif` (optionnel) : Filtrer par statut (true/false)

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "email": "user@example.com",
      "nom": "Doe",
      "prenom": "John",
      "role": "JURY",
      "actif": true,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "total": 5
}
```

---

#### POST `/api/users`
Créer un nouvel utilisateur (Admin uniquement).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "nouveau@marche-refondation.ne",
  "password": "MotDePasse123!",
  "nom": "Nouvel",
  "prenom": "Utilisateur",
  "role": "JURY"
}
```

**Validation:**
- Email unique
- Mot de passe minimum 8 caractères
- Rôle valide : SUPER_ADMIN, ADMIN, SUPERVISEUR, JURY, GESTIONNAIRE, COMPTABLE
- Seul SUPER_ADMIN peut créer d'autres SUPER_ADMIN

**Response Success (201):**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": "clxxx...",
    "email": "nouveau@marche-refondation.ne",
    "nom": "Nouvel",
    "prenom": "Utilisateur",
    "role": "JURY",
    "actif": true,
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

---

#### PUT `/api/users`
Mettre à jour un utilisateur.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "clxxx...",
  "email": "email_modifie@marche-refondation.ne",
  "nom": "Nom Modifié",
  "prenom": "Prénom Modifié",
  "role": "SUPERVISEUR",
  "actif": true,
  "password": "NouveauMotDePasse123!" // Optionnel
}
```

**Règles:**
- Un utilisateur peut modifier son propre profil (sauf rôle et actif)
- Seul un Admin peut modifier d'autres utilisateurs
- Seul SUPER_ADMIN peut modifier des SUPER_ADMIN
- Mot de passe optionnel (minimum 8 caractères si fourni)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "data": {
    "id": "clxxx...",
    "email": "email_modifie@marche-refondation.ne",
    "nom": "Nom Modifié",
    "prenom": "Prénom Modifié",
    "role": "SUPERVISEUR",
    "actif": true,
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

---

#### DELETE `/api/users?id=<user_id>`
Supprimer un utilisateur (Admin uniquement).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `id` (requis) : ID de l'utilisateur à supprimer

**Restrictions:**
- Ne peut pas supprimer son propre compte
- Seul SUPER_ADMIN peut supprimer un autre SUPER_ADMIN

**Response Success (200):**
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

---

## 🔧 Utilisation du Code

### Dans les routes API (côté serveur)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, requireRole } from '@/app/lib/auth';

// Vérifier simplement si authentifié
export async function GET(request: NextRequest) {
  const user = isAuthenticated(request);
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Non authentifié' },
      { status: 401 }
    );
  }
  
  // Utiliser user.id, user.email, user.role, etc.
  return NextResponse.json({ success: true, user });
}

// Vérifier le rôle requis
export async function POST(request: NextRequest) {
  const user = requireRole(request, ['ADMIN', 'SUPER_ADMIN']);
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Accès non autorisé' },
      { status: 403 }
    );
  }
  
  // L'utilisateur a le bon rôle
  // ... votre logique
}
```

### Dans les composants React (côté client)

```typescript
// Connexion
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Stocker le token
    localStorage.setItem('auth-token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Rediriger vers le dashboard
    window.location.href = '/admin';
  } else {
    alert(data.message);
  }
};

// Vérifier la session au chargement de la page
useEffect(() => {
  const verifySession = async () => {
    const token = localStorage.getItem('auth-token');
    
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // Session invalide
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
  };
  
  verifySession();
}, []);

// Faire une requête authentifiée
const fetchData = async () => {
  const token = localStorage.getItem('auth-token');
  
  const response = await fetch('/api/demandes?admin=true', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  // ... traiter les données
};

// Déconnexion
const handleLogout = async () => {
  const token = localStorage.getItem('auth-token');
  
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user');
  window.location.href = '/admin/login';
};
```

## 🚀 Démarrage Rapide

### 1. Configuration initiale

1. Assurez-vous que la base de données est configurée
2. Vérifiez que `JWT_SECRET` est défini dans `.env`
3. Exécutez les migrations Prisma :
```bash
npx prisma migrate deploy
```

### 2. Créer le premier administrateur

Faites une requête POST à `/api/auth/setup` :
```bash
curl -X POST http://localhost:3000/api/auth/setup
```

Ou visitez : `http://localhost:3000/api/auth/setup` dans votre navigateur

**Identifiants par défaut:**
- Email: `admin@marche-refondation.ne`
- Mot de passe: `Admin@2024`

⚠️ **Changez ce mot de passe immédiatement après la première connexion !**

### 3. Première connexion

1. Allez sur `/admin/login`
2. Connectez-vous avec les identifiants par défaut
3. Changez votre mot de passe dans les paramètres
4. Créez d'autres utilisateurs selon vos besoins

## 🛡️ Bonnes Pratiques de Sécurité

1. **En Production:**
   - Changez le `JWT_SECRET` par une valeur aléatoire forte
   - Activez HTTPS (les cookies secure seront activés automatiquement)
   - Utilisez des mots de passe forts (min 12 caractères, majuscules, minuscules, chiffres, symboles)

2. **Gestion des utilisateurs:**
   - Créez un SUPER_ADMIN puis des ADMIN pour la gestion quotidienne
   - Désactivez les comptes inactifs plutôt que de les supprimer
   - Revoyez régulièrement les permissions des utilisateurs

3. **Mots de passe:**
   - Minimum 8 caractères (recommandé 12+)
   - Changement régulier des mots de passe
   - Pas de réutilisation de mots de passe

4. **Tokens:**
   - Durée de vie limitée (24h par défaut)
   - Stockage sécurisé dans localStorage ET cookies HttpOnly
   - Suppression lors de la déconnexion

## 🐛 Dépannage

### "Session invalide ou expirée"
- Le token a expiré (24h)
- Reconnectez-vous

### "Accès non autorisé"
- Votre rôle n'a pas les permissions requises
- Contactez un administrateur

### "Email ou mot de passe incorrect"
- Vérifiez vos identifiants
- Le compte peut être désactivé

### "Un administrateur existe déjà" (setup)
- La route setup ne fonctionne qu'une fois
- Utilisez la récupération de mot de passe ou contactez l'administrateur

## 📞 Support

Pour toute question ou problème :
1. Consultez d'abord cette documentation
2. Vérifiez les logs serveur
3. Contactez l'équipe technique

---

**Version:** 1.0
**Dernière mise à jour:** 17 décembre 2025
