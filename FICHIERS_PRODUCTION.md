# Guide de Gestion des Fichiers en Production

## Problème actuel

L'aperçu des fichiers uploadés ne fonctionne pas en production. Cela est dû au fait que Next.js en production ne persiste pas les fichiers uploadés dans le dossier `public/uploads/` de la même manière qu'en développement.

## Solutions possibles

### Option 1 : Stockage persistant sur le serveur (Recommandé pour serveur dédié)

Si vous utilisez un VPS ou serveur dédié, vous devez :

1. **Créer un dossier persistant en dehors de l'application**
   ```bash
   mkdir -p /var/uploads/marche-refondation/documents
   chmod 755 /var/uploads/marche-refondation/documents
   ```

2. **Modifier l'API d'upload** (`app/api/upload/route.ts`)
   ```typescript
   // Remplacer cette ligne:
   const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
   
   // Par:
   const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads', 'documents');
   ```

3. **Modifier l'API de lecture** (`app/api/files/[filename]/route.ts`)
   ```typescript
   // Remplacer cette ligne:
   const filePath = path.join(process.cwd(), 'public', 'uploads', 'documents', filename);
   
   // Par:
   const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads', 'documents');
   const filePath = path.join(uploadsDir, filename);
   ```

4. **Ajouter la variable d'environnement** (`.env`)
   ```
   UPLOADS_DIR=/var/uploads/marche-refondation/documents
   ```

### Option 2 : Utiliser un service de stockage cloud (Recommandé pour production)

#### A. Amazon S3 / DigitalOcean Spaces

1. **Installer le SDK**
   ```bash
   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
   ```

2. **Créer un service de stockage** (`app/lib/storage.ts`)
   ```typescript
   import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
   import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

   const s3Client = new S3Client({
     region: process.env.AWS_REGION || "eu-west-1",
     credentials: {
       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
     },
     ...(process.env.AWS_ENDPOINT && {
       endpoint: process.env.AWS_ENDPOINT, // Pour DigitalOcean Spaces
     }),
   });

   export async function uploadToS3(file: Buffer, filename: string, contentType: string) {
     const command = new PutObjectCommand({
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: `documents/${filename}`,
       Body: file,
       ContentType: contentType,
     });

     await s3Client.send(command);
     return `documents/${filename}`;
   }

   export async function getSignedFileUrl(key: string) {
     const command = new GetObjectCommand({
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: key,
     });

     return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 heure
   }
   ```

3. **Variables d'environnement**
   ```
   AWS_REGION=eu-west-1
   AWS_ACCESS_KEY_ID=votre_access_key
   AWS_SECRET_ACCESS_KEY=votre_secret_key
   AWS_BUCKET_NAME=marche-refondation-uploads
   # Pour DigitalOcean Spaces:
   AWS_ENDPOINT=https://fra1.digitaloceanspaces.com
   ```

#### B. Cloudinary (Facile à utiliser)

1. **Installer**
   ```bash
   npm install cloudinary
   ```

2. **Configuration** (`.env`)
   ```
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```

3. **Service de stockage** (`app/lib/cloudinary.ts`)
   ```typescript
   import { v2 as cloudinary } from 'cloudinary';

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   export async function uploadToCloudinary(file: Buffer, filename: string) {
     return new Promise((resolve, reject) => {
       cloudinary.uploader.upload_stream(
         {
           folder: 'marche-refondation/documents',
           public_id: filename,
           resource_type: 'auto',
         },
         (error, result) => {
           if (error) reject(error);
           else resolve(result?.secure_url);
         }
       ).end(file);
     });
   }
   ```

### Option 3 : Vercel Blob Storage (Si hébergé sur Vercel)

1. **Installer**
   ```bash
   npm install @vercel/blob
   ```

2. **Utilisation**
   ```typescript
   import { put } from '@vercel/blob';

   export async function uploadToBlob(file: Buffer, filename: string) {
     const blob = await put(filename, file, {
       access: 'public',
       token: process.env.BLOB_READ_WRITE_TOKEN,
     });
     return blob.url;
   }
   ```

## Solution temporaire actuelle

Le système actuel fonctionne en développement mais **ne fonctionnera pas en production** si vous utilisez des plateformes comme Vercel, Netlify, ou des environnements serverless.

### Pour tester en production maintenant :

1. **Vérifier que le dossier existe**
   ```bash
   ssh votre-serveur
   cd /chemin/vers/votre/app
   ls -la public/uploads/documents/
   ```

2. **Vérifier les permissions**
   ```bash
   chmod 755 public/uploads
   chmod 755 public/uploads/documents
   chmod 644 public/uploads/documents/*
   ```

3. **Vérifier que les fichiers sont bien uploadés**
   - Regarder dans le dossier si les fichiers existent
   - Vérifier les logs de l'API d'upload

## Recommandations

Pour une application en production, je recommande **fortement** :

1. **Solution cloud** (S3, Cloudinary, Vercel Blob) pour la scalabilité et la fiabilité
2. **Backup automatique** des fichiers uploadés
3. **CDN** pour servir les fichiers rapidement
4. **Limitation de taille** stricte (déjà implémentée : 5MB)
5. **Nettoyage automatique** des fichiers orphelins

## Migration des fichiers existants

Si vous avez déjà des fichiers en local et voulez migrer vers le cloud :

```bash
# Exemple pour S3
aws s3 sync ./public/uploads/documents/ s3://votre-bucket/documents/
```

## Support

Si vous avez besoin d'aide pour implémenter une de ces solutions, contactez votre développeur.
