// Secure Database Manager
const fs = require('fs').promises;
const path = require('path');
const { DataSecurity } = require('./security');

class SecureDatabase {
  constructor(dataDir = './data') {
    this.dataDir = dataDir;
    this.ensureDataDir();
  }
  
  async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }
  
  // Secure file operations with encryption
  async secureRead(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      
      // Try to decrypt (for encrypted files)
      try {
        const encryptedData = JSON.parse(data);
        if (encryptedData.encrypted && encryptedData.iv && encryptedData.authTag) {
          return JSON.parse(DataSecurity.decrypt(encryptedData));
        }
      } catch (decryptError) {
        // File is not encrypted, return as-is
        return JSON.parse(data);
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return this.getDefaultData(filename);
    }
  }
  
  async secureWrite(filename, data, encrypt = true) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const jsonData = JSON.stringify(data, null, 2);
      
      let writeData;
      if (encrypt) {
        writeData = DataSecurity.encrypt(jsonData);
      } else {
        writeData = jsonData;
      }
      
      // Create backup before writing
      await this.createBackup(filename);
      
      await fs.writeFile(filePath, JSON.stringify(writeData), 'utf8');
      
      // Also write to a secondary location for redundancy
      const backupPath = path.join(this.dataDir, 'backups', filename);
      await fs.mkdir(path.join(this.dataDir, 'backups'), { recursive: true });
      await fs.writeFile(backupPath, JSON.stringify(writeData), 'utf8');
      
      console.log(`✅ Secure write completed: ${filename}`);
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }
  
  async createBackup(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.dataDir, 'backups', `${filename}.${timestamp}.backup`);
      
      const data = await fs.readFile(filePath);
      await fs.mkdir(path.join(this.dataDir, 'backups'), { recursive: true });
      await fs.writeFile(backupPath, data);
      
      // Keep only last 10 backups
      await this.cleanupBackups(filename);
      
      console.log(`📦 Backup created: ${backupPath}`);
    } catch (error) {
      console.error(`Error creating backup for ${filename}:`, error);
    }
  }
  
  async cleanupBackups(filename) {
    try {
      const backupDir = path.join(this.dataDir, 'backups');
      const files = await fs.readdir(backupDir);
      
      const backupFiles = files
        .filter(f => f.startsWith(filename) && f.endsWith('.backup'))
        .map(f => ({
          name: f,
          path: path.join(backupDir, f),
          time: fs.stat(path.join(backupDir, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      // Keep only last 10 backups
      if (backupFiles.length > 10) {
        const filesToDelete = backupFiles.slice(10);
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          console.log(`🗑️ Old backup deleted: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up backups:', error);
    }
  }
  
  getDefaultData(filename) {
    switch (filename) {
      case 'users.json':
        return [];
      case 'donations.json':
        return [];
      case 'admin.json':
        return {
          users: [
            {
              id: 'admin',
              username: 'admin',
              password: DataSecurity.hashPassword('Imiza2025!'),
              role: 'admin',
              lastLogin: null,
              createdAt: new Date().toISOString()
            }
          ]
        };
      case 'security.json':
        return {
          blockedIPs: [],
          suspiciousActivities: [],
          lastBackup: null
        };
      default:
        return {};
    }
  }
  
  // User operations
  async createUser(userData) {
    const users = await this.secureRead('users.json');
    
    // Check if user already exists
    const existingUser = users.find(u => u.phone === userData.phone);
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user with secure ID
    const newUser = {
      id: DataSecurity.generateSecureToken(),
      name: DataSecurity.sanitizeInput(userData.name),
      phone: DataSecurity.sanitizeInput(userData.phone),
      email: userData.email ? DataSecurity.sanitizeInput(userData.email) : '',
      createdAt: new Date().toISOString(),
      lastDonation: null,
      totalDonations: 0,
      status: 'active'
    };
    
    users.push(newUser);
    await this.secureWrite('users.json', users);
    
    console.log(`👤 New user created: ${newUser.name} (${newUser.phone})`);
    return newUser;
  }
  
  async getUserByPhone(phone) {
    const users = await this.secureRead('users.json');
    return users.find(u => u.phone === phone);
  }
  
  async updateUser(userId, updateData) {
    const users = await this.secureRead('users.json');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData };
      await this.secureWrite('users.json', users);
      return users[userIndex];
    }
    
    return null;
  }
  
  // Donation operations
  async createDonation(donationData) {
    const donations = await this.secureRead('donations.json');
    
    const newDonation = {
      id: DataSecurity.generateSecureToken(),
      userId: donationData.userId,
      userName: DataSecurity.sanitizeInput(donationData.userName),
      userPhone: DataSecurity.sanitizeInput(donationData.userPhone),
      amount: parseFloat(donationData.amount),
      paymentMethod: DataSecurity.sanitizeInput(donationData.paymentMethod),
      phone: DataSecurity.sanitizeInput(donationData.phone),
      status: 'pending',
      date: new Date().toISOString(),
      reference: `DON${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      paymentUrl: donationData.paymentUrl || null,
      instructions: donationData.instructions || null,
      fallbackMode: donationData.fallbackMode || false,
      ip: donationData.ip || 'unknown',
      userAgent: donationData.userAgent || 'unknown',
      confirmedAt: null,
      webhookReceived: false
    };
    
    donations.push(newDonation);
    await this.secureWrite('donations.json', donations);
    
    // Update user stats
    await this.updateUser(donationData.userId, {
      lastDonation: newDonation.date,
      totalDonations: (await this.getUserTotalDonations(donationData.userId)) + newDonation.amount
    });
    
    console.log(`💰 New donation: ${newDonation.amount}$ from ${newDonation.userName}`);
    return newDonation;
  }
  
  async updateDonationStatus(reference, status, additionalData = {}) {
    const donations = await this.secureRead('donations.json');
    const donationIndex = donations.findIndex(d => d.reference === reference);
    
    if (donationIndex !== -1) {
      donations[donationIndex] = {
        ...donations[donationIndex],
        status,
        confirmedAt: status === 'completed' ? new Date().toISOString() : null,
        webhookReceived: true,
        ...additionalData
      };
      
      await this.secureWrite('donations.json', donations);
      console.log(`✅ Donation status updated: ${reference} -> ${status}`);
      return donations[donationIndex];
    }
    
    return null;
  }
  
  async getUserDonations(userId) {
    const donations = await this.secureRead('donations.json');
    return donations.filter(d => d.userId === userId);
  }
  
  async getUserTotalDonations(userId) {
    const userDonations = await this.getUserDonations(userId);
    return userDonations.reduce((sum, d) => sum + d.amount, 0);
  }
  
  async getAllDonations() {
    return await this.secureRead('donations.json');
  }
  
  async getAllUsers() {
    return await this.secureRead('users.json');
  }
  
  // Security operations
  async logSecurityEvent(event) {
    const security = await this.secureRead('security.json');
    security.suspiciousActivities.push({
      ...event,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 security events
    if (security.suspiciousActivities.length > 1000) {
      security.suspiciousActivities = security.suspiciousActivities.slice(-1000);
    }
    
    await this.secureWrite('security.json', security);
  }
  
  async blockIP(ip, duration = 24 * 60 * 60 * 1000) {
    const security = await this.secureRead('security.json');
    security.blockedIPs.push({
      ip,
      blockedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration).toISOString()
    });
    
    await this.secureWrite('security.json', security);
    console.log(`🚫 IP blocked: ${ip}`);
  }
  
  async isIPBlocked(ip) {
    const security = await this.secureRead('security.json');
    const blockedIP = security.blockedIPs.find(b => 
      b.ip === ip && new Date(b.expiresAt) > new Date()
    );
    
    return blockedIP !== undefined;
  }
}

module.exports = SecureDatabase;
