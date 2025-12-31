# Guide de Sécurité - Marché de la Refondation

## 📋 Vue d'ensemble

Ce document détaille toutes les mesures de sécurité implémentées pour protéger la plateforme contre les attaques de robots, les injections, le brute force et autres menaces courantes.

## 🛡️ Mesures de Sécurité Implémentées

### 1. Rate Limiting (Limitation de débit)

**Objectif** : Empêcher les attaques de déni de service (DoS) et le brute force.

#### Configuration générale
- **100 requêtes** maximum par IP toutes les **15 minutes**
- Blocage automatique pour **1 heure** en cas d'abus
- Nettoyage automatique des entrées expirées

#### Endpoints sensibles avec limites strictes

| Endpoint | Fenêtre | Max requêtes |
|----------|---------|--------------|
| `/api/auth/login` | 15 min | 5 tentatives |
| `/api/demandes` | 1 min | 3 soumissions |
| `/api/upload` | 1 min | 10 uploads |

**Fichier** : `app/lib/security.ts` - fonction `checkRateLimit()`

**Headers HTTP retournés** :
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1672358400000
```

### 2. Protection contre le Brute Force (Authentification)

**Objectif** : Empêcher les tentatives répétées de connexion.

#### Mesures implémentées

1. **Tentatives échouées limitées**
   - Maximum **5 tentatives** échouées par IP
   - Blocage de **30 minutes** après dépassement
   - Message d'erreur générique (ne révèle pas si l'email existe)

2. **Délai artificiel**
   - Ajout d'un délai de **1 seconde** pour chaque tentative
   - Rend le brute force extrêmement lent

3. **Logging de sécurité**
   - Tous les échecs de connexion sont enregistrés
   - Suivi de l'IP, email et timestamp

**Fichier** : `app/api/auth/login/route.ts`

### 3. Sécurité des Uploads de Fichiers

**Objectif** : Empêcher l'upload de fichiers malveillants.

#### Validations multiples

1. **Validation de la taille**
   - Maximum **5 MB** par fichier
   - Rejet des fichiers vides (0 bytes)

2. **Validation de l'extension**
   - Extensions autorisées : `jpg`, `jpeg`, `png`, `pdf`
   - Extensions en minuscules uniquement

3. **Validation du type MIME**
   - Types autorisés : `image/jpeg`, `image/png`, `application/pdf`

4. **Vérification des Magic Bytes**
   - Vérification de la signature réelle du fichier
   - Détection des fichiers déguisés
   ```
   JPEG: 0xFF 0xD8 0xFF
   PNG:  0x89 0x50 0x4E 0x47
   PDF:  0x25 0x50 0x44 0x46 (%PDF)
   ```

5. **Nettoyage du nom de fichier**
   - Suppression des caractères dangereux
   - Génération d'un nom unique et sécurisé
   - Format : `timestamp_random_nomoriginal.ext`

6. **Protection contre Directory Traversal**
   - Blocage des patterns : `../`, `..\\`, null bytes
   - Validation stricte du chemin de destination

**Fichier** : `app/api/upload/route.ts`

### 4. Validation et Sanitization des Inputs

**Objectif** : Prévenir les injections SQL, XSS et autres attaques par injection.

#### Fonctions de validation

```typescript
// Validation d'email
isValidEmail(email: string): boolean

// Validation de téléphone
isValidPhone(phone: string): boolean

// Nettoyage des inputs
sanitizeInput(input: string): string

// Détection de patterns suspects
detectSuspiciousPatterns(input: string): boolean
```

#### Patterns suspects détectés

- Balises `<script>` (XSS)
- Attributs JavaScript `onclick`, `onerror`, etc.
- Injection SQL : `SELECT`, `UNION`, `DROP TABLE`, `INSERT`, `UPDATE`, `DELETE`
- Directory traversal : `../`
- Null bytes : `\0`

**Fichier** : `app/lib/security.ts`

### 5. Headers de Sécurité HTTP

**Objectif** : Protéger contre diverses attaques au niveau du navigateur.

#### Headers implémentés

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [voir ci-dessous]
```

#### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: http:;
connect-src 'self' https://hcaptcha.com;
frame-src 'self' https://hcaptcha.com;
```

**Fichier** : `middleware.ts` et `app/lib/security.ts`

### 6. Protection Anti-Bot (Honeypot)

**Objectif** : Détecter et bloquer les bots automatisés.

#### Techniques utilisées

1. **Champs Honeypot cachés**
   - Champs invisibles pour les humains
   - Les bots les remplissent automatiquement
   - Champs : `website_url`, `email_confirm`

2. **Vérification JavaScript**
   - Détection si JS est activé
   - La plupart des bots simples n'exécutent pas JS

3. **Délai minimum de soumission**
   - Minimum **5 secondes** pour soumettre un formulaire
   - Les bots soumettent instantanément

4. **Timestamp de début**
   - Enregistrement du temps de début
   - Calcul du temps pris pour remplir le formulaire

**Fichier** : `app/components/HoneypotField.tsx`

**Utilisation** :
```tsx
import HoneypotField from '@/app/components/HoneypotField';

<HoneypotField onValidate={(isBot) => {
  if (isBot) {
    alert('Bot détecté');
    return;
  }
  // Continuer la soumission
}} />
```

### 7. Middleware Global de Sécurité

**Objectif** : Appliquer la sécurité à toutes les requêtes.

#### Fonctionnalités

1. **Rate limiting automatique**
   - Vérifié pour chaque requête
   - Retourne 429 (Too Many Requests) si dépassé

2. **Headers de sécurité**
   - Ajoutés automatiquement à toutes les réponses

3. **Logging des événements**
   - Enregistrement des IP bloquées
   - Traçabilité des attaques

**Fichier** : `middleware.ts`

### 8. Système de Logging de Sécurité

**Objectif** : Tracer toutes les tentatives d'attaque.

#### Types d'événements loggés

```typescript
type SecurityEventType = 
  | 'rate_limit'      // Limite de débit dépassée
  | 'blocked_ip'      // IP bloquée
  | 'suspicious_input' // Input suspect détecté
  | 'invalid_file'    // Fichier invalide
  | 'failed_auth';    // Échec d'authentification
```

#### Format du log

```
[SECURITY] 2025-12-29T01:00:00.000Z - failed_auth
{
  ip: "192.168.1.1",
  endpoint: "/api/auth/login",
  details: "Mot de passe incorrect pour: user@example.com"
}
```

**Fichier** : `app/lib/security.ts` - fonction `logSecurityEvent()`

## 🔒 Protection contre les Attaques Courantes

### Injection SQL
✅ **Protégé** : Utilisation de Prisma ORM avec paramètres préparés

### Cross-Site Scripting (XSS)
✅ **Protégé** : 
- Sanitization des inputs
- CSP headers
- React échappe automatiquement le contenu

### Cross-Site Request Forgery (CSRF)
✅ **Protégé** :
- Cookies httpOnly
- SameSite policy
- Token JWT

### Clickjacking
✅ **Protégé** : Header `X-Frame-Options: DENY`

### Brute Force
✅ **Protégé** :
- Rate limiting
- Délais artificiels
- Blocage après échecs répétés

### Directory Traversal
✅ **Protégé** : Validation stricte des chemins de fichiers

### File Upload Attacks
✅ **Protégé** :
- Validation multiple (extension, MIME, magic bytes)
- Taille limitée
- Nom de fichier sécurisé

### DoS/DDoS
✅ **Partiellement protégé** : 
- Rate limiting (protection basique)
- Pour une protection complète : utiliser Cloudflare/AWS Shield

### Bot Attacks
✅ **Protégé** :
- Honeypot
- Rate limiting
- Délai minimum

## 📊 Monitoring et Alertes

### Logs à surveiller

1. **Tentatives de connexion échouées**
   - Plus de 5 tentatives = alerte
   - Pattern d'IP suspectes

2. **Rate limiting**
   - IP fréquemment bloquées
   - Pic de requêtes anormal

3. **Uploads suspects**
   - Rejets fréquents de fichiers
   - Tentatives de fichiers malveillants

4. **Inputs suspects**
   - Patterns SQL/XSS détectés
   - Directory traversal

### Commandes utiles

```bash
# Voir les logs de sécurité
grep "\[SECURITY\]" logs/*.log

# Compter les tentatives de connexion échouées
grep "failed_auth" logs/*.log | wc -l

# IP les plus actives
grep "\[SECURITY\]" logs/*.log | grep -oP 'ip: "\K[^"]+' | sort | uniq -c | sort -rn
```

## 🔧 Configuration Avancée

### Variables d'environnement

```env
# .env
NODE_ENV=production  # Active HTTPS strict, secure cookies

# Pour production
JWT_SECRET=votre-secret-tres-long-et-complexe-ici
DATABASE_URL=mysql://...
```

### Ajuster les limites

Modifier dans `app/lib/security.ts` :

```typescript
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,     // Fenêtre de temps
  maxRequests: 100,              // Nombre max de requêtes
  blockDurationMs: 60 * 60 * 1000, // Durée de blocage
};

const SENSITIVE_ENDPOINTS_CONFIG = {
  '/api/auth/login': { 
    windowMs: 15 * 60 * 1000, 
    maxRequests: 5 
  },
  // Ajouter d'autres endpoints...
};
```

## 🚀 Recommandations pour la Production

### 1. Infrastructure

- [ ] Utiliser un WAF (Web Application Firewall)
  - Cloudflare
  - AWS WAF
  - Azure Front Door

- [ ] Mettre en place un CDN
  - Cache les ressources statiques
  - Protection DDoS native

- [ ] Activer HTTPS strict
  - Certificat SSL/TLS valide
  - HSTS activé

### 2. Base de données

- [ ] Backups réguliers automatisés
- [ ] Encryption at rest
- [ ] Accès restreint par IP

### 3. Monitoring

- [ ] Service de monitoring
  - Sentry pour les erreurs
  - LogRocket pour les sessions
  - Datadog/New Relic pour la performance

- [ ] Alertes configurées
  - Spike de tentatives de connexion
  - Erreurs 500 fréquentes
  - Uploads suspects

### 4. Rate Limiting en Production

⚠️ **Important** : Le rate limiting actuel utilise la mémoire (RAM).

Pour la production, utilisez **Redis** :

```typescript
// Installer redis
npm install redis ioredis

// Exemple d'implémentation
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(ip: string, endpoint: string) {
  const key = `rate:${ip}:${endpoint}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 900); // 15 minutes
  }
  
  return count <= maxRequests;
}
```

### 5. Sécurité des Cookies

En production, assurez-vous que :

```typescript
response.cookies.set('auth-token', token, {
  httpOnly: true,        // ✅ Pas accessible en JavaScript
  secure: true,          // ✅ HTTPS uniquement
  sameSite: 'strict',    // ✅ Protection CSRF maximale
  maxAge: 60 * 60 * 24,  // 24 heures
  path: '/',
});
```

## 🧪 Tests de Sécurité

### Tests manuels à effectuer

1. **Rate Limiting**
   ```bash
   # Envoyer 10 requêtes rapides
   for i in {1..10}; do curl http://localhost:3000/api/demandes; done
   ```

2. **Upload de fichiers**
   - Essayer d'uploader un fichier .exe renommé en .jpg
   - Essayer un fichier > 5MB
   - Essayer un fichier avec `../` dans le nom

3. **Injection SQL**
   - Entrer `' OR '1'='1` dans les champs
   - Vérifier qu'aucune erreur SQL n'est révélée

4. **XSS**
   - Entrer `<script>alert('XSS')</script>` dans les champs
   - Vérifier que c'est échappé

### Outils de test automatisés

```bash
# OWASP ZAP - Scanner de vulnérabilités
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# Nikto - Scanner de serveur web
nikto -h http://localhost:3000

# SQLMap - Test d'injection SQL
sqlmap -u "http://localhost:3000/api/demandes" --batch
```

## 📞 Support et Rapports de Sécurité

Si vous découvrez une vulnérabilité de sécurité :

1. **Ne pas** la divulguer publiquement
2. Envoyer un email à : security@votre-domaine.com
3. Inclure :
   - Description détaillée
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestion de correction (si possible)

## 📚 Ressources Supplémentaires

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance)

## ✅ Checklist de Déploiement Sécurisé

- [ ] Variables d'environnement sécurisées
- [ ] HTTPS activé avec certificat valide
- [ ] Headers de sécurité vérifiés
- [ ] Rate limiting testé
- [ ] Base de données avec accès restreint
- [ ] Backups automatisés configurés
- [ ] Monitoring et alertes actifs
- [ ] Logs centralisés
- [ ] WAF configuré (recommandé)
- [ ] Tests de sécurité passés
- [ ] Documentation à jour

---

**Date de dernière mise à jour** : 29 Décembre 2025  
**Version** : 1.0.0  
**Mainteneur** : Équipe Technique Marché de la Refondation
