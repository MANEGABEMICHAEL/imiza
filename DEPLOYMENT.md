# Imiza Tumaini - Guide de Déploiement

## Configuration du Backend

### 1. Installation des dépendances
```bash
npm install
```

### 2. Build de l'application
```bash
npm run build
```

### 3. Démarrage du serveur
```bash
npm start
```

Le serveur démarrera sur le port 3000 par défaut.

## Structure des Fichiers

### Backend (server.js)
- **Serveur Express** sur port 3000
- **API REST** pour les dons et utilisateurs
- **Base de données JSON** dans le dossier `/data`
- **Interface d'administration** accessible via `/admin`

### Frontend (React)
- **Application React** avec Vite
- **Système de traduction** multilingue
- **Logo IMIZATUMAINILOGO.png** intégré
- **Formulaire de don** avec validation

## Points d'Accès

### Site Principal
- URL: `http://localhost:3000`
- Logo: IMIZATUMAINILOGO.png (favicon)

### Administration
- URL: `http://localhost:3000/admin`
- Panel de gestion des dons en temps réel

### API Endpoints
- `GET /api/donations` - Lister tous les dons
- `POST /api/donations` - Créer un nouveau don
- `GET /api/users/:id` - Obtenir un utilisateur
- `POST /api/users` - Créer/mettre à jour un utilisateur

## Déploiement en Production

### 1. Variables d'Environnement
```bash
export PORT=3000
export NODE_ENV=production
```

### 2. Persistance des Données
Les données sont stockées dans:
- `/data/donations.json` - Historique des dons
- `/data/users.json` - Informations des donateurs

### 3. Sécurité
- Protection contre les attaques CORS
- Validation des entrées utilisateur
- Gestion des erreurs sécurisée

## Logo et Assets

### Configuration du Favicon
Le logo IMIZATUMAINILOGO.png est configuré comme:
- Favicon dans `index.html`
- Asset dans `public/IMIZATUMAINILOGO.png`
- Intégré dans le build Vite

### Persistance après Hébergement
Le logo est automatiquement inclus dans:
- Le dossier `dist/` après build
- Le dossier `public/` pour le serveur
- Le chemin `/IMIZATUMAINILOGO.png` accessible

## Fonctionnalités de Dons

### Processus de Don
1. **Utilisateur** remplit le formulaire (nom, téléphone, email)
2. **Sélection** du montant et méthode de paiement
3. **Confirmation** mobile money simulée
4. **Enregistrement** dans la base de données
5. **Notification** de succès

### Méthodes de Paiement
- Orange Money (+243 815 123 456)
- MPesa (+243 975 123 456)
- Airtel Money (+243 970 123 456)
- Virement Bancaire (RAWBANK RDC00123456789)

## Interface d'Administration

### Tableau de Bord
- **Total des dons** en temps réel
- **Nombre de transactions**
- **Dons du jour**
- **Liste des derniers donateurs**

### Mise à Jour Automatique
- Actualisation toutes les 30 secondes
- Design responsive
- Interface sécurisée

## Support Technique

Pour toute question technique:
- Vérifier les logs du serveur
- Consulter la console du navigateur
- Valider la configuration des ports
