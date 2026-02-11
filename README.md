# Modifai - Plateforme d'Optimisation de Prompts IA

Modifai est une application web moderne conçue pour aider les créateurs d'IA à partager, comparer et optimiser leurs prompts. Elle permet de visualiser l'impact d'un prompt amélioré grâce à une comparaison intelligente "Avant/Après".

## Fonctionnalités

- **Comparaison Avant/Après** : Visualisez instantanément l'effet de vos modifications de prompts.
- **Feed Communautaire** : Découvrez les meilleurs prompts partagés par la communauté.
- **Gestion de Profil** : Personnalisez votre identité et gérez vos propres créations.
- **Système de Likes** : Enregistrez vos prompts préférés.
- **Support Multi-Modèles** : Midjourney, DALL-E, Stable Diffusion, Flux, etc.

## Installation Locale

1. Clonez le dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez votre fichier `.env` (utilisez `.env.example` comme modèle).
4. Initialisez la base de données :
   ```bash
   npx prisma db push
   ```
5. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Déploiement sur Vercel

Le projet est prêt pour un déploiement sur Vercel :

1. Reliez votre dépôt GitHub à Vercel.
2. Configurez une base de données **PostgreSQL** (Vercel Postgres ou Supabase).
3. Ajoutez les variables d'environnement suivantes dans Vercel :
   - `DATABASE_URL` : Votre lien de connexion PostgreSQL.
   - `AUTH_SECRET` : Une clé secrète pour NextAuth.
   - `CLOUDINARY_URL` (ou Supabase Storage) : Pour la gestion des images en production.
4. Vercel détectera automatiquement la configuration Next.js et lancera le build.

---
Développé avec Next.js 15, Prisma et Tailwind CSS.
