# Système d'Évaluation par Jury

## Vue d'ensemble

Le système d'évaluation a été mis à jour pour implémenter un processus d'évaluation en plusieurs étapes impliquant des membres du jury et un président du jury.

## Rôles

### 1. JURY
- Membres du jury qui évaluent les demandes individuellement
- Chaque membre peut évaluer une demande **une seule fois**
- Ils ne peuvent pas prendre de décision finale (approuver/rejeter)
- Leurs évaluations sont visibles par tous les membres du comité

### 2. PRESIDENT_JURY
- Président du jury qui supervise le processus d'évaluation
- Peut uniquement procéder à la validation finale **après** que tous les membres du jury aient évalué
- Prend la décision finale d'approuver ou rejeter une demande
- La décision du président est définitive et met à jour le statut de la demande

### 3. ADMIN / SUPER_ADMIN
- Peuvent toujours évaluer les demandes comme avant
- Ont accès à toutes les fonctionnalités administratives

## Processus d'Évaluation

### Étape 1: Évaluation par les Jurys
1. Chaque membre du jury (`role: JURY`) évalue la demande individuellement
2. Ils donnent des notes selon les critères d'évaluation
3. Ils peuvent laisser des commentaires
4. **Ils ne peuvent PAS prendre de décision finale** à cette étape
5. Une fois leur évaluation soumise, ils ne peuvent plus réévaluer la même demande

### Étape 2: Validation par le Président
1. Le président du jury (`role: PRESIDENT_JURY`) attend que **tous** les membres actifs du jury aient évalué
2. Une fois toutes les évaluations terminées, le président peut voir:
   - Le nombre de jurys ayant évalué (X/Total)
   - Le score moyen donné par les jurys
   - La liste des jurys qui n'ont pas encore évalué
3. Le président procède alors à sa propre évaluation
4. Le président prend la décision finale:
   - **APPROUVÉ** → La demande est acceptée
   - **REJETÉ** → La demande est refusée
5. Cette décision met à jour le statut de la demande et envoie un email au candidat

## Base de Données

### Modifications du schéma

```prisma
model Admin {
  role String @default("ADMIN") // ADMIN, SUPER_ADMIN, JURY, PRESIDENT_JURY
  // ... autres champs
}

model Evaluation {
  decision String? // APPROUVE, REJETE (seulement pour le président)
  estValidationFinale Boolean @default(false) // true si c'est la validation du président
  
  @@unique([demandeId, evaluateurId]) // Un évaluateur = une évaluation par demande
}
```

### Points clés
- **Contrainte unique**: Un utilisateur ne peut évaluer qu'une seule fois chaque demande
- **estValidationFinale**: Permet de distinguer la validation finale du président des évaluations des jurys
- **decision**: N'est rempli que pour la validation finale du président

## API Endpoints

### POST /api/evaluations
Créer une nouvelle évaluation

**Corps de la requête:**
```json
{
  "numeroReference": "REF-XXX",
  "scores": {
    "pertinence_origine": 4,
    "pertinence_transformation": 5,
    // ... autres scores
  },
  "commentaires": {
    "pertinence_origine": "Excellente qualité locale",
    // ... autres commentaires
  },
  "scoreTotal": 85.5,
  "decision": "APPROUVE", // Optionnel, seulement pour le président
  "estValidationFinale": true // Optionnel, true pour le président
}
```

**Validations:**
- Vérifie que l'utilisateur n'a pas déjà évalué cette demande
- Si `estValidationFinale = true`:
  - Vérifie que l'utilisateur est `PRESIDENT_JURY`
  - Vérifie que tous les jurys actifs ont évalué
  - Met à jour le statut de la demande
  - Envoie un email au candidat

### GET /api/evaluations/stats?numeroReference=REF-XXX
Obtenir les statistiques d'évaluation pour une demande

**Réponse:**
```json
{
  "success": true,
  "data": {
    "demande": {
      "id": "...",
      "numeroReference": "REF-XXX",
      "status": "EN_ATTENTE"
    },
    "juryMembers": {
      "total": 5,
      "evaluated": 3,
      "notEvaluated": [
        {"id": "...", "nom": "Dupont", "prenom": "Jean", "email": "..."},
        {"id": "...", "nom": "Martin", "prenom": "Marie", "email": "..."}
      ],
      "list": [...]
    },
    "president": {
      "id": "...",
      "nom": "...",
      "prenom": "...",
      "email": "..."
    },
    "evaluations": {
      "all": [...], // Toutes les évaluations
      "jury": [...], // Évaluations des jurys uniquement
      "president": {...} // Évaluation du président (si existe)
    },
    "statistics": {
      "averageJuryScore": 82.3,
      "allJuriesEvaluated": false,
      "canPresidentValidate": false,
      "hasPresidentValidated": false,
      "finalDecision": null
    }
  }
}
```

## Interface Utilisateur

### Affichage pour les Jurys
- Peuvent voir le statut d'évaluation
- Voient qui a déjà évalué (sans voir les notes)
- Peuvent évaluer s'ils ne l'ont pas encore fait
- Reçoivent un message de confirmation après leur évaluation

### Affichage pour le Président
- Voit un tableau de bord avec:
  - Progression des évaluations (X/Total jurys)
  - Score moyen des jurys
  - Liste des jurys en attente
- **Ne peut pas valider** tant que tous les jurys n'ont pas évalué
- Reçoit un bouton "Procéder à la Validation Finale" quand tous les jurys ont évalué
- Peut voir toutes les évaluations individuelles

### Page de Détail d'une Demande
Affiche:
1. **Statut d'Évaluation des Jurys** (si des jurys existent):
   - Barre de progression
   - Score moyen
   - Liste des jurys en attente
   - Statut de validation du président

2. **Historique des Évaluations**:
   - Toutes les évaluations avec scores et commentaires
   - Indication du rôle de chaque évaluateur
   - Date et heure d'évaluation

3. **Bouton d'action adapté**:
   - Pour les jurys: "Commencer l'Évaluation" (si pas encore évalué)
   - Pour le président: "Procéder à la Validation Finale" (si tous les jurys ont évalué)
   - Message de confirmation si déjà évalué

## Création des Utilisateurs

### Créer un Membre du Jury
```typescript
// Via l'interface admin ou directement en base
await prisma.admin.create({
  data: {
    email: "jury1@example.com",
    password: await bcrypt.hash("password", 10),
    nom: "Dupont",
    prenom: "Jean",
    role: "JURY", // Important !
    actif: true
  }
});
```

### Créer le Président du Jury
```typescript
await prisma.admin.create({
  data: {
    email: "president@example.com",
    password: await bcrypt.hash("password", 10),
    nom: "Martin",
    prenom: "Marie",
    role: "PRESIDENT_JURY", // Important !
    actif: true
  }
});
```

## Flux de Travail Complet

```
1. Candidat soumet une demande
   ↓
2. Statut: EN_ATTENTE
   ↓
3. Chaque membre du jury évalue individuellement
   - Jury 1 évalue (score: 80)
   - Jury 2 évalue (score: 85)
   - Jury 3 évalue (score: 78)
   ↓
4. Tous les jurys ont évalué
   ↓
5. Le président voit:
   - 3/3 jurys ont évalué
   - Score moyen: 81
   - Peut procéder à la validation
   ↓
6. Le président fait son évaluation et décide
   ↓
7. Si APPROUVÉ:
   - Statut → APPROUVE
   - Email envoyé au candidat
   - Attestation PDF générée
   ↓
8. Si REJETÉ:
   - Statut → REJETE
   - Email avec raison envoyé au candidat
```

## Sécurité et Validations

### Contraintes
✅ Un évaluateur ne peut évaluer qu'une fois par demande (contrainte DB)  
✅ Seul le président peut prendre une décision finale  
✅ Le président doit attendre que tous les jurys aient évalué  
✅ Les évaluations sont horodatées  
✅ Les rôles sont vérifiés côté serveur  

### Permissions
- **JURY**: Peut évaluer, ne peut pas décider
- **PRESIDENT_JURY**: Peut évaluer ET décider (après les jurys)
- **ADMIN/SUPER_ADMIN**: Tous les droits

## Migration

Pour mettre à jour une base de données existante:

```bash
cd marche-refondation
npx prisma migrate dev --name add_jury_roles_and_validation
npx prisma generate
```

## Tests Recommandés

1. ✅ Créer 3 utilisateurs JURY et 1 PRESIDENT_JURY
2. ✅ Créer une demande test
3. ✅ Faire évaluer par chaque jury (vérifier l'impossibilité de réévaluer)
4. ✅ Vérifier que le président ne peut pas valider avant la fin
5. ✅ Compléter les évaluations des jurys
6. ✅ Vérifier que le président peut maintenant valider
7. ✅ Tester l'approbation et le rejet
8. ✅ Vérifier les emails et la génération du PDF

## Maintenance

### Ajouter un nouveau jury
1. Créer l'utilisateur avec `role: 'JURY'`
2. Les demandes en cours nécessiteront son évaluation

### Retirer un jury
1. Mettre `actif: false` sur l'utilisateur
2. Il ne sera plus compté dans le total requis

### Changer de président
1. Mettre l'ancien président en ADMIN ou JURY
2. Créer/promouvoir le nouveau avec `role: 'PRESIDENT_JURY'`
