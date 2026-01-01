# Fonctionnalité d'envoi d'emails

## Configuration

### Serveur SMTP
- **Hébergeur**: Hostinger
- **Serveur**: smtp.hostinger.com
- **Port**: 465 (SSL)
- **Email**: refondation@nnumerique.com
- **Mot de passe**: Refondation@123

## Fonctionnalités implémentées

### 1. Sauvegarde du numéro de référence

Le numéro attribué à chaque candidature est automatiquement sauvegardé dans le cache du navigateur (localStorage) :

```javascript
localStorage.setItem('lastReferenceNumber', result.numeroReference);
```

**Avantages**:
- L'utilisateur peut fermer le navigateur et retrouver son numéro
- Le numéro reste accessible jusqu'à ce que l'utilisateur fasse une nouvelle demande
- Facilite le suivi de la candidature

**Pour faire une nouvelle demande** :
```javascript
localStorage.removeItem('lastReferenceNumber');
window.location.reload();
```

### 2. Email de confirmation de réception

**Quand**: Envoyé automatiquement après la soumission d'une candidature

**Condition**: L'email doit être renseigné dans le formulaire

**Contenu**:
- Message de confirmation de réception
- Numéro de référence de la candidature
- Étapes suivantes du processus
- Rappel du montant à payer (100 000 FCFA)
- Lien vers le suivi de demande

**Implémentation**: `app/api/demandes/route.ts`

```typescript
if (demande.email) {
  const candidateName = `${demande.prenom} ${demande.nom}`;
  await sendApplicationConfirmationEmail(
    demande.email,
    candidateName,
    demande.numeroReference
  );
}
```

### 3. Email de décision du jury

**Quand**: Envoyé automatiquement lors de l'évaluation d'une candidature

**Condition**: L'email doit être renseigné dans le formulaire

#### 3.1. Email d'approbation

**Contenu**:
- Félicitations pour l'approbation
- Numéro de référence
- Informations sur le paiement (100 000 FCFA)
- Prochaines démarches
- Message de bienvenue

#### 3.2. Email de rejet

**Contenu**:
- Message de remerciement
- Numéro de référence
- Motif du rejet (si renseigné)
- Encouragement à postuler à nouveau
- Conseils pour une future candidature

**Implémentation**: `app/api/evaluations/route.ts`

```typescript
if (demande.email) {
  const candidateName = `${demande.prenom} ${demande.nom}`;
  if (decision === 'APPROUVE') {
    await sendApprovalEmail(
      demande.email,
      candidateName,
      demande.numeroReference
    );
  } else if (decision === 'REJETE') {
    const reason = commentaires?.raisonRejet || body.raisonRejet;
    await sendRejectionEmail(
      demande.email,
      candidateName,
      demande.numeroReference,
      reason
    );
  }
}
```

## Structure des emails

Tous les emails incluent:
- ✅ Version HTML responsive et stylisée
- ✅ Version texte brut pour compatibilité
- ✅ Design professionnel avec gradient et couleurs du projet
- ✅ Logo et branding du Marché de la Réfondation
- ✅ Footer avec informations institutionnelles

## Gestion des erreurs

Les emails sont envoyés de manière non-bloquante :
- Si l'envoi échoue, la candidature ou l'évaluation est quand même enregistrée
- Les erreurs sont loguées dans la console pour diagnostic
- L'utilisateur n'est pas informé en cas d'échec d'envoi d'email

```typescript
try {
  await sendEmail(...);
  console.log('Email envoyé avec succès');
} catch (emailError) {
  console.error('Erreur lors de l\'envoi de l\'email:', emailError);
  // Ne pas bloquer le processus principal
}
```

## Fichiers modifiés

### 1. `app/lib/email.ts` (nouveau)
Service d'envoi d'emails avec nodemailer et les fonctions :
- `sendApplicationConfirmationEmail()`
- `sendApprovalEmail()`
- `sendRejectionEmail()`

### 2. `app/api/demandes/route.ts`
Ajout de l'envoi d'email de confirmation après création de la demande

### 3. `app/api/evaluations/route.ts`
Ajout de l'envoi d'emails de décision après évaluation

### 4. `app/inscription-exposant/page.tsx`
- Sauvegarde du numéro dans localStorage
- Fonction `handleNewApplication()` pour nouvelle demande

## Dépendances ajoutées

```json
{
  "nodemailer": "^6.9.x",
  "@types/nodemailer": "^6.4.x"
}
```

## Tests recommandés

1. **Test email de confirmation**:
   - Soumettre une candidature avec un email valide
   - Vérifier la réception de l'email de confirmation
   - Valider le contenu et le numéro de référence

2. **Test email d'approbation**:
   - Évaluer une candidature et l'approuver
   - Vérifier la réception de l'email d'approbation
   - Valider les informations de paiement

3. **Test email de rejet**:
   - Évaluer une candidature et la rejeter
   - Ajouter un motif de rejet
   - Vérifier la réception et le contenu

4. **Test localStorage**:
   - Soumettre une candidature
   - Fermer et rouvrir le navigateur
   - Vérifier que le numéro est toujours accessible

## Notes importantes

⚠️ **Sécurité**:
- Les identifiants SMTP sont dans le code (à déplacer vers variables d'environnement en production)
- Ajouter dans `.env` et `.gitignore` pour la production

⚠️ **Production**:
- Vérifier que le serveur SMTP Hostinger est accessible depuis le serveur de production
- Configurer les DNS SPF/DKIM pour éviter le spam
- Tester l'envoi d'emails depuis l'environnement de production

⚠️ **Limites**:
- Vérifier les limites d'envoi d'emails chez Hostinger
- Implémenter une file d'attente si nécessaire pour gros volumes
