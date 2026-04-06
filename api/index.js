const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Configuration
const SECURITY_CONFIG = {
  encryptionKey: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  allowedOrigins: ['http://localhost:3000', 'https://imizatumaini.cd', 'https://*.vercel.app']
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes. Veuillez réessayer plus tard.'
});

const donationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Limite de dons atteinte. Maximum 10 dons par heure.'
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(cors({
  origin: SECURITY_CONFIG.allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import donation routes (simplified for Vercel)
const donationsPath = path.join(__dirname, '..', 'data', 'donations.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const fs = require('fs').promises;

// Helper functions
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJSONFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Donation routes
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await readJSONFile(donationsPath);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des dons' });
  }
});

app.post('/api/donations', donationLimiter, async (req, res) => {
  try {
    const donations = await readJSONFile(donationsPath);
    const newDonation = {
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    donations.push(newDonation);
    await writeJSONFile(donationsPath, donations);
    
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du don' });
  }
});

// User routes
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readJSONFile(usersPath);
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des utilisateurs' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const users = await readJSONFile(usersPath);
    const existingUser = users.find(u => u.email === req.body.email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur existe déjà' });
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJSONFile(usersPath, users);
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
