// Security Middleware
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// Enhanced Security Configuration
const SECURITY_CONFIG = {
  // Rate Limiting
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),
  
  // Donation Rate Limiting (stricter)
  donationRateLimiter: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // max 10 donations per hour per IP
    message: {
      error: 'Limite de dons atteinte. Maximum 10 dons par heure.',
      retryAfter: '1 heure'
    },
    keyGenerator: (req) => {
      // Use IP + phone for better tracking
      return req.ip + (req.body.phone || '');
    }
  }),
  
  // Admin Rate Limiting (very strict)
  adminRateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // max 5 admin attempts per 15 minutes
    message: {
      error: 'Trop de tentatives d\'administration. Compte temporairement bloqué.',
      retryAfter: '15 minutes'
    },
    skipSuccessfulRequests: true
  }),
  
  // Data Encryption
  encryptionKey: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
  algorithm: 'aes-256-gcm',
  
  // JWT Secret
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  
  // Session Security
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
  
  // CORS Security
  allowedOrigins: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000', 'https://imizatumaini.cd'],
  
  // Security Headers
  securityHeaders: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }
};

// Encryption Functions
class DataSecurity {
  static encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(SECURITY_CONFIG.algorithm, SECURITY_CONFIG.encryptionKey);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  static decrypt(encryptedData) {
    const decipher = crypto.createDecipher(SECURITY_CONFIG.algorithm, SECURITY_CONFIG.encryptionKey);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  static hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }
  
  static verifyPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
  }
  
  static generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  static validatePhone(phone) {
    // Enhanced phone validation for RDC
    const phoneRegex = /^(\+243|0)?[89][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
  
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 1 && num <= 5000;
  }
}

// IP Security
class IPSecurity {
  static getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
  }
  
  static isSuspiciousActivity(req, action) {
    const ip = this.getClientIP(req);
    const userAgent = req.headers['user-agent'];
    
    // Log suspicious activity
    console.log(`🔍 Security Log: ${action} from ${ip} - ${userAgent}`);
    
    // Add more sophisticated detection here
    return false;
  }
}

module.exports = {
  SECURITY_CONFIG,
  DataSecurity,
  IPSecurity
};
