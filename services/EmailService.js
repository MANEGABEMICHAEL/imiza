// Email Service for Donation Notifications
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });
  }

  async sendDonationConfirmation(donorData, donationData) {
    try {
      const mailOptions = {
        from: `"Imiza Tumaini" <${process.env.SMTP_USER}>`,
        to: donorData.email,
        subject: '🎊 Confirmation de votre don - Imiza Tumaini',
        html: this.generateConfirmationEmail(donorData, donationData)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de confirmation envoyé à ${donorData.email}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Erreur envoi email confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAdminNotification(donationData) {
    try {
      const mailOptions = {
        from: `"System Imiza Tumaini" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'admin@imizatumaini.cd',
        subject: `🔔 Nouveau don à valider - ${donationData.amount}$`,
        html: this.generateAdminNotificationEmail(donationData)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email admin envoyé:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Erreur envoi email admin:', error);
      return { success: false, error: error.message };
    }
  }

  generateConfirmationEmail(donorData, donationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Confirmation de don - Imiza Tumaini</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: #0a192f; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .donation-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2ecc71; }
          .amount { font-size: 2em; font-weight: bold; color: #2ecc71; }
          .status { background: #f59e0b; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.9em; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
          .logo { width: 60px; height: 60px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://imizatumaini.cd/IMIZATUMAINILOGO.png" alt="Imiza Tumaini" class="logo">
            <h1>🎊 Merci pour votre générosité !</h1>
            <p>Votre don a été reçu et est en cours de validation</p>
          </div>
          
          <div class="content">
            <h2>Détails de votre contribution</h2>
            
            <div class="donation-info">
              <h3>Informations du don</h3>
              <p><strong>Nom:</strong> ${donorData.name}</p>
              <p><strong>Téléphone:</strong> ${donorData.phone}</p>
              <p><strong>Email:</strong> ${donorData.email}</p>
              <p><strong>Date:</strong> ${new Date(donationData.date).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div class="donation-info">
              <h3>Détails du paiement</h3>
              <p><strong>Montant:</strong> <span class="amount">${donationData.amount} $</span></p>
              <p><strong>Méthode:</strong> ${donationData.paymentMethod.toUpperCase()}</p>
              <p><strong>Référence:</strong> ${donationData.reference}</p>
              <p><strong>Statut:</strong> <span class="status">En attente de validation</span></p>
            </div>
            
            <h3>📋 Prochaines étapes</h3>
            <ol>
              <li>Votre don est actuellement en attente de validation par notre équipe</li>
              <li>Une fois validé, vous recevrez un email de confirmation finale</li>
              <li>Le paiement sera traité selon la méthode choisie</li>
              <li>Vous pourrez suivre l'avancement dans votre espace personnel</li>
            </ol>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>📞 Contact</h3>
              <p>Pour toute question concernant votre don:</p>
              <p>Email: contact@imizatumaini.cd</p>
              <p>Téléphone: +243 XXX XXX XXX</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2025 Imiza Tumaini - Tous droits réservés</p>
            <p>Cet email a été généré automatiquement, merci de ne pas répondre</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateAdminNotificationEmail(donationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nouveau don à valider - Imiza Tumaini</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
          .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .donation-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .amount { font-size: 1.5em; font-weight: bold; color: #dc3545; }
          .action-button { background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
          .action-button.reject { background: #dc3545; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 NOUVEAU DON À VALIDER</h1>
            <p>Action requise: Validation manuelle</p>
          </div>
          
          <div class="content">
            <div class="urgent">
              <h3>⚠️ Action requise</h3>
              <p>Un nouveau don de <strong>${donationData.amount}$</strong> nécessite votre validation.</p>
              <p>Date: ${new Date(donationData.date).toLocaleString('fr-FR')}</p>
            </div>
            
            <div class="donation-details">
              <h3>📋 Détails du don</h3>
              <p><strong>Donateur:</strong> ${donationData.userName}</p>
              <p><strong>Téléphone:</strong> ${donationData.userPhone}</p>
              <p><strong>Email:</strong> ${donationData.userEmail || 'Non fourni'}</p>
              <p><strong>Montant:</strong> <span class="amount">${donationData.amount} $</span></p>
              <p><strong>Méthode:</strong> ${donationData.paymentMethod.toUpperCase()}</p>
              <p><strong>Référence:</strong> ${donationData.reference}</p>
              <p><strong>Transaction ID:</strong> ${donationData.transactionId}</p>
              <p><strong>IP:</strong> ${donationData.ip}</p>
            </div>
            
            <h3>🎯 Actions requises</h3>
            <p>Veuillez vous connecter au panel d'administration pour:</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="http://localhost:3000/admin" class="action-button">✅ VALIDER LE DON</a>
              <a href="http://localhost:3000/admin" class="action-button reject">❌ REJETER LE DON</a>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3>✅ Après validation</h3>
              <ul>
                <li>Un email de confirmation sera envoyé au donateur</li>
                <li>Le statut du don sera mis à jour à "completed"</li>
                <li>Les statistiques seront actualisées</li>
              </ul>
            </div>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3>❌ En cas de rejet</h3>
              <ul>
                <li>Un email d'explication sera envoyé au donateur</li>
                <li>Le statut du don sera mis à jour à "rejected"</li>
                <li>Aucun débit ne sera effectué</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendDonationRejected(donorData, donationData, reason = '') {
    try {
      const mailOptions = {
        from: `"Imiza Tumaini" <${process.env.SMTP_USER}>`,
        to: donorData.email,
        subject: '❌ Information concernant votre don - Imiza Tumaini',
        html: this.generateRejectionEmail(donorData, donationData, reason)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de rejet envoyé à ${donorData.email}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Erreur envoi email rejet:', error);
      return { success: false, error: error.message };
    }
  }

  generateRejectionEmail(donorData, donationData, reason) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Information concernant votre don - Imiza Tumaini</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: #dc3545; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .rejection-info { background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .amount { font-size: 1.5em; font-weight: bold; color: #dc3545; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Information concernant votre don</h1>
            <p>Votre demande de don n'a pas pu être validée</p>
          </div>
          
          <div class="content">
            <div class="rejection-info">
              <h3>📋 Détails de votre demande</h3>
              <p><strong>Référence:</strong> ${donationData.reference}</p>
              <p><strong>Montant:</strong> <span class="amount">${donationData.amount} $</span></p>
              <p><strong>Date:</strong> ${new Date(donationData.date).toLocaleDateString('fr-FR')}</p>
              ${reason ? `<p><strong>Raison:</strong> ${reason}</p>` : ''}
            </div>
            
            <h3>📞 Que faire maintenant ?</h3>
            <p>Si vous pensez qu'il s'agit d'une erreur, vous pouvez:</p>
            <ul>
              <li>Nous contacter par email: contact@imizatumaini.cd</li>
              <li>Nous appeler: +243 XXX XXX XXX</li>
              <li>Refaire une nouvelle demande de don</li>
            </ul>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>📞 Contact</h3>
              <p>Nous sommes à votre disposition pour toute information:</p>
              <p>Email: contact@imizatumaini.cd</p>
              <p>Téléphone: +243 XXX XXX XXX</p>
            </div>
            
            <p>Nous vous remercions de votre compréhension et de votre intérêt pour notre cause.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 Imiza Tumaini - Tous droits réservés</p>
            <p>Cet email a été généré automatiquement, merci de ne pas répondre</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Service email connecté avec succès');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur connexion email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
