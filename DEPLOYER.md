# 🚀 Guide de Déploiement - Site Livre Blanc OSCAR

## Architecture
- **Frontend** : Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **UI** : shadcn/ui + Framer Motion
- **Base de données** : Turso (SQLite cloud via libsql)
- **ORM** : Prisma avec adapter @prisma/adapter-libsql
- **Hébergement** : Vercel

---

## ÉTAPE 1 — Créer la base Turso

1. Allez sur [turso.tech](https://turso.tech) → Créez un compte
2. Créez une base de données :
   - **Nom** : `oscar-senegal`
   - **Région** : choisissez la plus proche (eu-west-1 recommandé pour l'Afrique de l'Ouest)
   - **Groupe** : votre nom d'organisation
3. Générez un **token d'authentification** :
   - Allez dans la base → Settings → Authentication
   - Créez un token avec les permissions "Read Write"
4. Copiez l'**URL** de la base (format : `libsql://oscar-senegal-votreorg.eu-west-1.turso.io`)

### Vérifier la connexion
```bash
npx @libsql/client test "libsql://oscar-senegal-votreorg.eu-west-1.turso.io?authToken=VOTRE_TOKEN"
```

---

## ÉTAPE 2 — Initialiser le dépôt Git

```bash
cd oscar-site
git init
git add .
git commit -m "Livre Blanc OSCAR - Site de la plateforme citoyenne"
```

### Créer le dépôt GitHub
1. Allez sur [github.com/new](https://github.com/new)
2. Nom du dépôt : `oscar-senegal` (ou autre)
3. **Ne cochez aucune case** (pas de README, .gitignore ou licence)
4. Créez le dépôt
5. Connectez et poussez :
```bash
git remote add origin https://github.com/VOTRE_USER/oscar-senegal.git
git branch -M main
git push -u origin main
```

---

## ÉTAPE 3 — Déployer sur Vercel

### 3A. Créer les tables dans Turso
Avant le déploiement, créez les tables. Depuis le dossier du projet :

```bash
node scripts/turso-setup.js
```

Ce script crée les 3 tables : Engagement, Contribution, Download.

### 3B. Connexion Vercel
1. Allez sur [vercel.com](https://vercel.com) → Connectez votre GitHub
2. Cliquez **"Add New Project"**
3. Sélectionnez le dépôt `oscar-senegal`
4. **Configuration du build** :
   - **Framework Preset** : Next.js (auto-détecté)
   - **Build Command** : `npx prisma generate && next build`
   - **Install Command** : (laisser par défaut)
5. **Variables d'environnement** (Section Environment Variables) :
   - Cliquez "Add New"
   - **Name** : `DATABASE_URL`
   - **Value** : `libsql://oscar-senegal-votreorg.eu-west-1.turso.io?authToken=VOTRE_TOKEN`
   - Cochez **Production**, **Preview** et **Development**
6. Cliquez **"Deploy"**

### 3C. Vérifier
- Attendez que le build finisse (2-3 minutes)
- Vercel vous donne une URL : `https://oscar-senegal-xxx.vercel.app`
- Visitez le site et testez :
  - ✅ Le téléchargement de documents
  - ✅ Le formulaire d'engagement
  - ✅ Le forum citoyen

---

## ÉTAPE 4 — Personnaliser le domaine (optionnel)

1. Dans Vercel → Project → Settings → Domains
2. Ajoutez votre domaine personnalisé (ex: `oscar.oumarfaal.sn`)
3. Configurez le DNS chez votre registrar

---

## Structure des fichiers importants

```
oscar-site/
├── prisma/schema.prisma     # Schéma de la base (3 tables)
├── scripts/turso-setup.js   # Script pour créer les tables sur Turso
├── src/
│   ├── app/
│   │   ├── page.tsx         # Page principale
│   │   ├── layout.tsx       # Layout racine (SEO, fonts)
│   │   ├── globals.css      # Thème couleurs Sénégal
│   │   └── api/
│   │       ├── engagements/ # API formulaire engagement
│   │       ├── forum/       # API forum citoyen
│   │       ├── downloads/   # API suivi téléchargements
│   │       └── stats/       # API statistiques agrégées
│   └── lib/
│       └── db.ts            # Connexion Prisma (SQLite local ou Turso)
├── public/documents/        # 7 fichiers .docx téléchargeables
└── .env.example             # Template des variables d'environnement
```

---

## Résolution de problèmes

### "Server returned HTTP status 404" sur Turso
- Vérifiez que la base est bien créée sur le dashboard Turso
- Vérifiez l'URL exacte (elle doit correspondre au nom de la base + org)
- Vérifiez que le token est valide et non expiré

### Build échoué sur Vercel
- Vérifiez que le Build Command est : `npx prisma generate && next build`
- Vérifiez que DATABASE_URL est bien configuré dans les variables Vercel

### Les formulaires ne fonctionnent pas
- Vérifiez que les tables sont créées dans Turso (utilisez le script turso-setup.js)
- Vérifiez la connexion dans les logs Vercel (Settings → Logs)