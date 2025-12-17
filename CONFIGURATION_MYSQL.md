# Configuration MySQL - Marché de la Réfondation

## 🎉 Configuration Réussie !

Le système de stockage des données dans MySQL a été configuré avec succès pour votre application du Marché de la Réfondation.

## 📊 Base de Données

### Informations de connexion
- **Base de données:** vnycen
- **Host:** localhost
- **Port:** 8889
- **Utilisateur:** root
- **Mot de passe:** root

### Tables créées
1. **DemandeExposant** - Stocke toutes les demandes d'inscription des exposants
2. **Admin** - Gère les comptes administrateurs

## 👤 Compte Administrateur

Un compte administrateur par défaut a été créé :
- **Email:** admin@marche-refondation.ne
- **Mot de passe:** Admin@2024

⚠️ **Important:** Veuillez changer ce mot de passe après votre première connexion.

## 🔗 URLs Importantes

### Côté Public
- **Page d'accueil:** http://localhost:3000
- **Inscription exposant:** http://localhost:3000/inscription-exposant
- **Suivi de demande:** http://localhost:3000/suivi-demande

### Côté Admin
- **Connexion Admin:** http://localhost:3000/admin/login
- **Dashboard Admin:** http://localhost:3000/admin

## 🚀 Fonctionnalités Implémentées

### Pour les Exposants
- ✅ Formulaire d'inscription avec sauvegarde dans MySQL
- ✅ Génération automatique du numéro de référence
- ✅ Page de suivi de demande par numéro de référence
- ✅ Upload de fichiers (carte d'identité, registre de commerce, etc.)

### Pour l'Admin
- ✅ Système d'authentification sécurisé avec JWT
- ✅ Dashboard complet avec statistiques
- ✅ Visualisation de toutes les demandes depuis la base de données
- ✅ Système d'évaluation des demandes avec grille de notation
- ✅ Génération de PDF pour les approbations
- ✅ Gestion des statuts (En attente, Approuvé, Rejeté)

## 📝 API Routes Disponibles

### Routes Publiques
- `POST /api/demandes` - Créer une nouvelle demande
- `GET /api/demandes?numeroReference=XXX` - Suivre une demande
- `POST /api/upload` - Upload de fichiers

### Routes Protégées (Admin)
- `POST /api/auth/login` - Connexion admin
- `GET /api/demandes` - Récupérer toutes les demandes (avec pagination)
- `PUT /api/demandes` - Mettre à jour le statut d'une demande
- `DELETE /api/demandes?numeroReference=XXX` - Supprimer une demande

## 🛠️ Maintenance

### Visualiser les données dans MySQL
```sql
-- Voir toutes les demandes
SELECT * FROM DemandeExposant;

-- Voir les demandes en attente
SELECT * FROM DemandeExposant WHERE status = 'EN_ATTENTE';

-- Compter les demandes par statut
SELECT status, COUNT(*) as total 
FROM DemandeExposant 
GROUP BY status;

-- Voir les administrateurs
SELECT id, email, nom, prenom, role, actif FROM Admin;
```

### Commandes Prisma utiles
```bash
# Visualiser la base de données dans Prisma Studio
npx prisma studio

# Mettre à jour le schéma après modification
npx prisma migrate dev

# Réinitialiser la base de données
npx prisma migrate reset

# Générer le client Prisma
npx prisma generate
```

## 🔒 Sécurité

1. **Mot de passe Admin:** Changez immédiatement le mot de passe par défaut
2. **JWT Secret:** Modifiez le JWT_SECRET dans le fichier .env pour la production
3. **CORS:** Configurez les domaines autorisés pour la production
4. **HTTPS:** Utilisez HTTPS en production

## 📊 Gestion avec MAMP PRO

1. Ouvrez MAMP PRO
2. Cliquez sur l'onglet "MySQL"
3. Cliquez sur "phpMyAdmin" ou utilisez un client MySQL comme Sequel Pro
4. Sélectionnez la base de données "vnycen"
5. Vous pouvez voir et gérer toutes les tables et données

## ✅ Test du Système

1. **Test d'inscription:**
   - Allez sur http://localhost:3000/inscription-exposant
   - Remplissez le formulaire
   - Notez le numéro de référence généré

2. **Test de suivi:**
   - Allez sur http://localhost:3000/suivi-demande
   - Entrez le numéro de référence
   - Vérifiez que les informations s'affichent

3. **Test Admin:**
   - Allez sur http://localhost:3000/admin/login
   - Connectez-vous avec admin@marche-refondation.ne / Admin@2024
   - Vérifiez que les demandes s'affichent dans le dashboard
   - Testez l'évaluation d'une demande

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que MAMP est démarré avec MySQL sur le port 8889
2. Vérifiez le fichier .env pour les paramètres de connexion
3. Consultez les logs dans la console du navigateur et le terminal
4. Exécutez `npx prisma studio` pour visualiser directement les données

## 📈 Prochaines Étapes Recommandées

1. Changer le mot de passe admin par défaut
2. Configurer un système d'envoi d'emails pour les notifications
3. Ajouter la sauvegarde automatique de la base de données
4. Configurer les variables d'environnement pour la production
5. Implémenter un système de logs pour l'audit
