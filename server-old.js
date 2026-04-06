const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const MobileMoneyAPI = require('./api/mobile-money');
const { PRODUCTION_CONFIG, initializeProduction } = require('./config/production');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialiser la configuration production
initializeProduction();

// Initialiser l'API Mobile Money
const mobileMoney = new MobileMoneyAPI(PRODUCTION_CONFIG);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Base de données simple (fichier JSON)
const DB_FILE = path.join(__dirname, 'data', 'donations.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialiser les fichiers de données
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Routes API
app.get('/api/donations', (req, res) => {
  try {
    const donations = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des dons' });
  }
});

app.post('/api/donations', async (req, res) => {
  try {
    const { userId, amount, paymentMethod, phone } = req.body;
    
    // Validation des données
    mobileMoney.validatePayment(phone, amount);
    
    // Vérifier l'utilisateur
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const reference = `DON${Date.now()}`;
    
    console.log(`🚀 Initialisation paiement ${paymentMethod}: ${amount}$ pour ${user.name}`);
    
    // Appeler la vraie API Mobile Money
    let paymentResult;
    switch (paymentMethod) {
      case 'orange':
        paymentResult = await mobileMoney.orangePayment(phone, amount, reference);
        break;
      case 'mpesa':
        paymentResult = await mobileMoney.mpesaPayment(phone, amount, reference);
        break;
      case 'airtel':
        paymentResult = await mobileMoney.airtelPayment(phone, amount, reference);
        break;
      default:
        throw new Error('Méthode de paiement non supportée');
    }
    
    if (!paymentResult.success) {
      console.error(`❌ Erreur paiement ${paymentMethod}:`, paymentResult.error);
      return res.status(400).json({ 
        error: 'Erreur lors de l\'initialisation du paiement', 
        details: paymentResult.error 
      });
    }
    
    // Enregistrer le don
    const donation = {
      id: Date.now().toString(),
      userId,
      userName: user.name,
      userPhone: user.phone,
      amount,
      paymentMethod,
      phone,
      status: paymentResult.status,
      date: new Date().toISOString(),
      reference,
      transactionId: paymentResult.transaction_id,
      paymentUrl: paymentResult.payment_url,
      instructions: paymentResult.instructions,
      fallbackMode: paymentResult.fallback_mode || false
    };
    
    // Sauvegarder le don
    const donations = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    donations.push(donation);
    fs.writeFileSync(DB_FILE, JSON.stringify(donations, null, 2));
    
    console.log(`✅ Don enregistré: ${reference} - ${amount}$ (${paymentMethod})`);
    
    res.json({ 
      success: true, 
      donation,
      paymentInfo: {
        transactionId: paymentResult.transaction_id,
        paymentUrl: paymentResult.payment_url,
        instructions: paymentResult.instructions,
        fallbackMode: paymentResult.fallback_mode
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur traitement don:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhooks pour confirmer les paiements
app.post('/payment/orange/notif', (req, res) => {
  try {
    const { transaction_id, status, reference } = req.body;
    console.log(`📨 Webhook Orange: ${transaction_id} - ${status}`);
    
    updateDonationStatus(reference, status === 'SUCCESS' ? 'completed' : 'failed');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur webhook Orange' });
  }
});

app.post('/payment/mpesa/callback', (req, res) => {
  try {
    const { transaction_id, status, reference } = req.body;
    console.log(`📨 Webhook MPesa: ${transaction_id} - ${status}`);
    
    updateDonationStatus(reference, status === 'SUCCESS' ? 'completed' : 'failed');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur webhook MPesa' });
  }
});

app.post('/payment/airtel/callback', (req, res) => {
  try {
    const { transaction_id, status, reference } = req.body;
    console.log(`📨 Webhook Airtel: ${transaction_id} - ${status}`);
    
    updateDonationStatus(reference, status === 'SUCCESS' ? 'completed' : 'failed');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur webhook Airtel' });
  }
});

// Fonction utilitaire pour mettre à jour le statut
function updateDonationStatus(reference, status) {
  try {
    const donations = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const donationIndex = donations.findIndex(d => d.reference === reference);
    
    if (donationIndex !== -1) {
      donations[donationIndex].status = status;
      donations[donationIndex].completedAt = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(donations, null, 2));
      console.log(`✅ Statut mis à jour: ${reference} -> ${status}`);
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour statut:', error);
  }
}

app.post('/api/users', (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const existingUser = users.find(u => u.phone === phone);
    
    if (existingUser) {
      return res.json(existingUser);
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture de l\'utilisateur' });
  }
});

// Interface d'administration améliorée
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Administration - Imiza Tumaini</title>
      <link rel="icon" type="image/png" href="/IMIZATUMAINILOGO.png">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #0a192f; color: #fff; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { width: 80px; height: 80px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: center; }
        .donations { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; }
        .donation-item { background: rgba(255,255,255,0.1); margin: 10px 0; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .amount { font-size: 1.2em; font-weight: bold; color: #4ade80; }
        .date { color: #94a3b8; }
        .status { background: #4ade80; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
        .status.pending { background: #f59e0b; }
        .status.failed { background: #ef4444; }
        .status.pending_fallback { background: #8b5cf6; }
        .fallback-badge { background: #8b5cf6; padding: 2px 6px; border-radius: 3px; font-size: 0.7em; margin-left: 5px; }
        h1 { margin-bottom: 20px; }
        h2 { margin-bottom: 15px; }
        .total { font-size: 2em; font-weight: bold; color: #4ade80; }
        .api-status { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .api-status span { color: #4ade80; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="/IMIZATUMAINILOGO.png" alt="Imiza Tumaini" class="logo">
          <h1>Panel d'Administration</h1>
          <p>Gestion des Dons - Imiza Tumaini</p>
          <div class="api-status">
            <span>🚀 APIs Mobile Money: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DÉVELOPPEMENT'}</span>
          </div>
        </div>
        
        <div class="stats" id="stats">
          <div class="stat-card">
            <h3>Total des Dons</h3>
            <div class="total" id="totalAmount">0 $</div>
          </div>
          <div class="stat-card">
            <h3>Nombre de Dons</h3>
            <div class="total" id="totalDonations">0</div>
          </div>
          <div class="stat-card">
            <h3>Dons Aujourd'hui</h3>
            <div class="total" id="todayAmount">0 $</div>
          </div>
        </div>
        
        <div class="donations">
          <h2>Derniers Dons</h2>
          <div id="donationsList"></div>
        </div>
      </div>
      
      <script>
        async function loadData() {
          try {
            const response = await fetch('/api/donations');
            const donations = await response.json();
            
            // Calculer les statistiques
            const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
            const today = new Date().toDateString();
            const todayDonations = donations.filter(d => new Date(d.date).toDateString() === today);
            const todayAmount = todayDonations.reduce((sum, d) => sum + d.amount, 0);
            
            // Mettre à jour les statistiques
            document.getElementById('totalAmount').textContent = totalAmount + ' $';
            document.getElementById('totalDonations').textContent = donations.length;
            document.getElementById('todayAmount').textContent = todayAmount + ' $';
            
            // Afficher les dons
            const donationsList = document.getElementById('donationsList');
            donationsList.innerHTML = donations.slice(-10).reverse().map(donation => 
              '<div class="donation-item">' +
                '<div>' +
                  '<strong>' + donation.userName + '</strong>' +
                  (donation.fallbackMode ? '<span class="fallback-badge">FALLBACK</span>' : '') +
                  '<br>' +
                  '<small>' + donation.userPhone + ' - ' + donation.paymentMethod + '</small><br>' +
                  '<span class="date">' + new Date(donation.date).toLocaleString() + '</span>' +
                '</div>' +
                '<div>' +
                  '<div class="amount">' + donation.amount + ' $</div>' +
                  '<span class="status ' + donation.status + '">' + donation.status + '</span>' +
                '</div>' +
              '</div>'
            ).join('');
          } catch (error) {
            console.error('Erreur:', error);
          }
        }
        
        // Charger les données au chargement et toutes les 30 secondes
        loadData();
        setInterval(loadData, 30000);
      </script>
    </body>
    </html>
  `);
});

// Servir l'application React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 Serveur Imiza Tumaini démarré sur le port ' + PORT);
  console.log('📱 Interface d\'administration: http://localhost:' + PORT + '/admin');
  console.log('🌐 Mode: ' + (process.env.NODE_ENV || 'development'));
  console.log('💰 APIs Mobile Money: ' + (process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SIMULATION'));
});
