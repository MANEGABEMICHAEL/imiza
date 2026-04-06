// Configuration Production Mobile Money - Imiza Tumaini
// Ce fichier contient toutes les configurations pour passer en production

const PRODUCTION_CONFIG = {
  // URLs officielles des APIs
  apis: {
    orange: {
      base_url: "https://api.orange.com/orange-money-webpay/dev/v1",
      production_url: "https://api.orange.com/orange-money-webpay/v1",
      endpoints: {
        payment: "/webpayment",
        token: "/token",
        status: "/transactions"
      }
    },
    mpesa: {
      base_url: "https://api.mpesa.africa",
      production_url: "https://api.mpesa.africa",
      endpoints: {
        oauth: "/v1/oauth/token",
        payment: "/v1/payments",
        status: "/v1/transactions"
      }
    },
    airtel: {
      base_url: "https://openapi.airtel.africa",
      production_url: "https://openapi.airtel.africa",
      endpoints: {
        auth: "/auth/oauth2/token",
        payment: "/merchant/v1/payments",
        status: "/merchant/v1/transactions"
      }
    }
  },

  // Configuration des webhooks
  webhooks: {
    orange: {
      return_url: "https://imizatumaini.cd/payment/return",
      cancel_url: "https://imizatumaini.cd/payment/cancel", 
      notif_url: "https://imizatumaini.cd/payment/orange/notif"
    },
    mpesa: {
      callback_url: "https://imizatumaini.cd/payment/mpesa/callback"
    },
    airtel: {
      callback_url: "https://imizatumaini.cd/payment/airtel/callback"
    }
  },

  // Comptes professionnels Imiza Tumaini
  accounts: {
    orange: {
      merchant_key: process.env.ORANGE_MERCHANT_KEY,
      api_key: process.env.ORANGE_API_KEY,
      currency: "XAF"
    },
    mpesa: {
      api_key: process.env.MPESA_API_KEY,
      public_key: process.env.MPESA_PUBLIC_KEY,
      currency: "CDF"
    },
    airtel: {
      client_id: process.env.AIRTEL_CLIENT_ID,
      client_secret: process.env.AIRTEL_CLIENT_SECRET,
      currency: "CDF"
    }
  },

  // Limites de sécurité
  limits: {
    min_amount: 1,
    max_amount: 5000,
    daily_limit: 10000,
    transaction_timeout: 300000 // 5 minutes
  }
};

// Fonction de validation de production
const validateProductionConfig = () => {
  const required = [
    'ORANGE_MERCHANT_KEY',
    'ORANGE_API_KEY', 
    'MPESA_API_KEY',
    'MPESA_PUBLIC_KEY',
    'AIRTEL_CLIENT_ID',
    'AIRTEL_CLIENT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Configuration production incomplète:');
    console.warn('Variables manquantes:', missing);
    return false;
  }
  
  return true;
};

// Fonction d'initialisation production
const initializeProduction = () => {
  if (process.env.NODE_ENV === 'production') {
    if (!validateProductionConfig()) {
      throw new Error('Configuration production invalide');
    }
    
    console.log('🚀 Mode Production activé');
    console.log('📱 APIs Mobile Money configurées');
    console.log('🔒 Sécurité activée');
  }
};

module.exports = {
  PRODUCTION_CONFIG,
  validateProductionConfig,
  initializeProduction
};
