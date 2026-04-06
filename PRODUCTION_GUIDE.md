# GUIDE COMPLET - PASSAGE EN PRODUCTION IMIZA TUMAINI

## 🎯 ÉTAPES POUR ACTIVER LES VRAIS PAIEMENTS MOBILE MONEY

### 📋 ÉTAPE 1: OBTENIR LES CLÉS API

#### **Orange Money RDC**
```
📧 Contact: service.client@orange.com
🌐 Portail: https://developer.orange.com/
📋 Documents requis:
- RC (Registre de Commerce) de l'association
- ID du représentant légal
- Justificatif de domicile
- RIB de l'association
- Statuts de l'association

⏳ Délai: 2-4 semaines
💰 Coût: Gratuit (frais de transaction: ~2%)
```

#### **MPesa RDC**
```
📧 Contact: business@vodacom.cd
🌐 Portail: https://mpesa.africa/
📋 Documents requis:
- Personne morale autorisée
- Compte business MPesa
- Documents légaux RDC
- Pièce d'identité valide

⏳ Délai: 1-3 semaines  
💰 Coût: Gratuit (frais de transaction: ~1.5%)
```

#### **Airtel Money RDC**
```
📧 Contact: business@airtel.com
🌐 Portail: https://openapi.airtel.africa/
📋 Documents requis:
- Compte marchand Airtel
- Documents d'enregistrement
- Pièce d'identité
- RIB de l'association

⏳ Délai: 2-3 semaines
💰 Coût: Gratuit (frais de transaction: ~2.5%)
```

### 📋 ÉTAPE 2: CONFIGURATION TECHNIQUE

#### **1. Mettre à jour le fichier .env**
```bash
# Remplacez les valeurs par vos vraies clés
NODE_ENV=production
PORT=3000
BASE_URL=https://votre-domaine.com

# Orange Money
ORANGE_MERCHANT_KEY=vraie_merchant_key_orange
ORANGE_API_KEY=vraie_api_key_orange

# MPesa  
MPESA_API_KEY=vraie_api_key_mpesa
MPESA_PUBLIC_KEY=vraie_public_key_mpesa

# Airtel Money
AIRTEL_CLIENT_ID=vraie_client_id_airtel
AIRTEL_CLIENT_SECRET=vraie_client_secret_airtel
```

#### **2. Configuration des URLs de Callback**
```bash
# Dans vos tableaux de bord API, configurez:

Orange Money:
- Return URL: https://votre-domaine.com/payment/return
- Cancel URL: https://votre-domaine.com/payment/cancel  
- Notification URL: https://votre-domaine.com/payment/orange/notif

MPesa:
- Callback URL: https://votre-domaine.com/payment/mpesa/callback

Airtel Money:
- Callback URL: https://votre-domaine.com/payment/airtel/callback
```

### 📋 ÉTAPE 3: DÉPLOIEMENT

#### **1. Configuration du Serveur**
```bash
# Installer les dépendances supplémentaires
npm install node-fetch crypto

# Build de production
npm run build

# Démarrer en mode production
NODE_ENV=production npm start
```

#### **2. Configuration HTTPS**
```bash
# Obligatoire pour les APIs mobile money
# Utiliser Let's Encrypt ou certificat commercial
# Domaine: imizatumaini.cd (recommandé)
```

#### **3. Configuration Firewall**
```bash
# Autoriser les ports entrants:
- Port 80 (HTTP)
- Port 443 (HTTPS) 
- Port 3000 (Application)

# Autoriser les webhooks des APIs:
- Orange Money IPs
- MPesa IPs  
- Airtel Money IPs
```

### 📋 ÉTAPE 4: TESTS

#### **1. Mode Test**
```bash
# Tester avec de petits montants (1$)
NODE_ENV=development npm start

# Vérifier les logs:
🚀 Initialisation paiement orange: 1$ pour Test User
✅ Don enregistré: DON1234567890 - 1$ (orange)
📨 Webhook Orange: TXN_1641234567890 - SUCCESS
✅ Statut mis à jour: DON1234567890 -> completed
```

#### **2. Mode Production**
```bash
# Basculer en production
NODE_ENV=production npm start

# Vérifier l'interface admin:
https://votre-domaine.com/admin
```

### 📋 ÉTAPE 5: SURVEILLANCE

#### **Logs à Surveiller**
```bash
# Logs serveur:
🚀 Initialisation paiement [METHOD]: [AMOUNT]$ pour [USER]
✅ Don enregistré: [REFERENCE] - [AMOUNT]$ ([METHOD])
📨 Webhook [METHOD]: [TRANSACTION_ID] - [STATUS]
✅ Statut mis à jour: [REFERENCE] -> [STATUS]

# Erreurs possibles:
❌ Erreur paiement [METHOD]: [ERROR_MESSAGE]
❌ Erreur traitement don: [ERROR]
❌ Erreur webhook [METHOD]: [ERROR]
```

#### **Métriques Clés**
```bash
# Dans l'interface admin:
- Total des dons par jour/semaine/mois
- Taux de conversion (pending → completed)
- Méthodes les plus utilisées
- Montants moyens
- Erreurs de paiement
```

### 📋 ÉTAPE 6: SÉCURITÉ

#### **Validation des Webhooks**
```javascript
// Dans server.js, ajouter la validation des signatures
const validateWebhookSignature = (payload, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return hmac.digest('hex') === signature;
};
```

#### **Limites de Sécurité**
```javascript
// Déjà configuré dans PRODUCTION_CONFIG:
- Montant minimum: 1$
- Montant maximum: 5000$
- Limite quotidienne: 10000$
- Timeout transaction: 5 minutes
```

### 📋 ÉTAPE 7: MAINTENANCE

#### **Sauvegardes**
```bash
# Sauvegarder les données quotidiennement:
cp data/donations.json backups/donations_$(date +%Y%m%d).json
cp data/users.json backups/users_$(date +%Y%m%d).json
```

#### **Monitoring**
```bash
# Surveiller:
- Espace disque (logs)
- Mémoire utilisée
- Temps de réponse API
- Taux d'erreur
```

### 🎯 RÉSUMÉ RAPIDE

1. **Obtenir les clés API** (2-4 semaines)
2. **Configurer .env** avec les vraies clés
3. **Déployer sur serveur HTTPS**
4. **Configurer les webhooks**
5. **Tester en mode développement**
6. **Basculer en production**
7. **Surveiller les transactions**

### 🚞 SUPPORT TECHNIQUE

En cas de problème:
```bash
# Vérifier les logs:
tail -f logs/application.log

# Tester les APIs:
curl -X POST https://api.orange.com/orange-money-webpay/dev/v1/webpayment

# Redémarrer le serveur:
pm2 restart imiza-tumaini
```

### 📞 CONTACTS URGENTS

- **Support Orange**: +243 815 000 000
- **Support MPesa**: +243 975 000 000  
- **Support Airtel**: +243 970 000 000

---

**🎯 Le système est maintenant PRÊT pour la production avec de vrais paiements mobile money !**

Une fois les clés API obtenues et configurées, les dons seront VRAIMENT débités des comptes utilisateurs et crédités sur votre compte.
