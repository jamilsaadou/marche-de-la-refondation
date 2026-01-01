import nodemailer from 'nodemailer';

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true pour le port 465, false pour les autres ports
  auth: {
    user: 'refondation@nnumerique.com',
    pass: 'Refondation@123',
  },
});

// Vérifier la connexion SMTP au démarrage
transporter.verify(function (error: any, success: any) {
  if (error) {
    console.error('Erreur de configuration SMTP:', error);
  } else {
    console.log('Serveur SMTP prêt pour l\'envoi d\'emails');
  }
});

/**
 * Envoyer un email de confirmation de réception de candidature
 */
export async function sendApplicationConfirmationEmail(
  to: string,
  candidateName: string,
  numeroReference: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const mailOptions = {
      from: '"Marché de la Réfondation" <refondation@nnumerique.com>',
      to: to,
      subject: `Confirmation de réception - Candidature ${numeroReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .reference-box {
              background: white;
              border: 2px solid #667eea;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .reference-number {
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
              margin: 10px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .steps {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .step {
              padding: 10px 0;
              border-left: 3px solid #667eea;
              padding-left: 15px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Candidature Reçue avec Succès</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${candidateName}</strong>,</p>
              
              <p>Nous avons bien reçu votre candidature pour devenir exposant au <strong>Marché de la Réfondation</strong>.</p>
              
              <div class="reference-box">
                <p style="margin: 0; color: #666;">Votre numéro de référence :</p>
                <div class="reference-number">${numeroReference}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                  ⚠️ Conservez ce numéro précieusement pour suivre votre demande
                </p>
              </div>

              <div class="steps">
                <h3 style="color: #667eea; margin-top: 0;">📋 Prochaines étapes :</h3>
                <div class="step">
                  <strong>1. Vérification du dossier</strong><br>
                  Notre équipe examinera votre candidature sous 24-48 heures
                </div>
                <div class="step">
                  <strong>2. Évaluation</strong><br>
                  Votre dossier sera évalué par notre jury selon les critères de sélection
                </div>
                <div class="step">
                  <strong>3. Notification</strong><br>
                  Vous recevrez un email avec la décision du jury
                </div>
                <div class="step">
                  <strong>4. Attribution du kiosque</strong><br>
                  Si votre candidature est approuvée, un kiosque vous sera attribué
                </div>
              </div>

              <div style="text-align: center;">
                <a href="https://votresite.com/suivi-demande" class="button">
                  Suivre ma candidature
                </a>
              </div>

              <p style="margin-top: 30px;">
                <strong>⚠️ Rappel important :</strong><br>
                L'attribution définitive du stand est soumise au paiement de 100 000 FCFA après validation de votre candidature.
              </p>

              <p>Pour toute question, n'hésitez pas à nous contacter.</p>

              <p style="margin-top: 30px;">
                Cordialement,<br>
                <strong>L'équipe du Marché de la Réfondation</strong><br>
                Ministère du Commerce et de l'Industrie
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Marché de la Réfondation - République du Niger<br>
              Centenaire de Niamey 2026<br>
              Fraternité, Travail, Progrès</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Bonjour ${candidateName},

Nous avons bien reçu votre candidature pour devenir exposant au Marché de la Réfondation.

Votre numéro de référence : ${numeroReference}
⚠️ Conservez ce numéro précieusement pour suivre votre demande

Prochaines étapes :
1. Vérification du dossier (24-48 heures)
2. Évaluation par notre jury
3. Notification de la décision
4. Attribution du kiosque (si approuvé)

⚠️ Rappel important :
L'attribution définitive du stand est soumise au paiement de 100 000 FCFA après validation de votre candidature.

Cordialement,
L'équipe du Marché de la Réfondation
Ministère du Commerce et de l'Industrie
République du Niger
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé:', info.messageId);
    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    return { success: false, message: 'Erreur lors de l\'envoi de l\'email' };
  }
}

/**
 * Envoyer un email de décision du jury (Approuvé)
 */
export async function sendApprovalEmail(
  to: string,
  candidateName: string,
  numeroReference: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const mailOptions = {
      from: '"Marché de la Réfondation" <refondation@nnumerique.com>',
      to: to,
      subject: `✅ Candidature Approuvée - ${numeroReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .success-box {
              background: #d1fae5;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .payment-box {
              background: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .next-steps {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Félicitations !</h1>
              <h2 style="margin-top: 10px;">Votre candidature est approuvée</h2>
            </div>
            <div class="content">
              <p>Bonjour <strong>${candidateName}</strong>,</p>
              
              <div class="success-box">
                <h3 style="color: #059669; margin-top: 0;">✅ Candidature Approuvée</h3>
                <p style="margin: 10px 0;">Référence : <strong>${numeroReference}</strong></p>
                <p style="font-size: 16px; margin: 0;">
                  Nous avons le plaisir de vous informer que votre candidature a été <strong>approuvée</strong> par notre jury.
                </p>
              </div>

              <p>
                Votre dossier a été évalué positivement et vous êtes sélectionné(e) pour devenir exposant au <strong>Marché de la Réfondation</strong>.
              </p>

              <div class="payment-box">
                <h3 style="color: #856404; margin-top: 0;">💰 Prochaine étape : Paiement</h3>
                <p style="margin: 10px 0;">
                  <strong>Montant à payer : 100 000 FCFA</strong>
                </p>
                <p style="margin: 10px 0;">
                  Ce montant garantit votre place et l'attribution définitive de votre kiosque de 4 m².
                </p>
                <p style="margin: 10px 0; font-size: 14px;">
                  ⚠️ Vous serez contacté(e) dans les prochains jours par notre équipe pour organiser le paiement et la signature du contrat.
                </p>
              </div>

              <div class="next-steps">
                <h3 style="color: #10b981;">📋 Prochaines démarches :</h3>
                <ol style="padding-left: 20px;">
                  <li style="margin: 10px 0;">Notre équipe vous contactera pour le <strong>paiement des frais</strong></li>
                  <li style="margin: 10px 0;">Signature du <strong>contrat d'occupation</strong></li>
                  <li style="margin: 10px 0;"><strong>Attribution de votre kiosque</strong> selon vos préférences</li>
                  <li style="margin: 10px 0;">Remise des <strong>badges et documents</strong></li>
                  <li style="margin: 10px 0;">Installation et début de votre activité</li>
                </ol>
              </div>

              <p style="margin-top: 30px;">
                <strong>📞 Nous vous contacterons prochainement</strong><br>
                Notre équipe prendra contact avec vous dans les 48 heures pour finaliser votre inscription.
              </p>

              <p>
                Merci de votre confiance et bienvenue au Marché de la Réfondation !
              </p>

              <p style="margin-top: 30px;">
                Cordialement,<br>
                <strong>L'équipe du Marché de la Réfondation</strong><br>
                Ministère du Commerce et de l'Industrie
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Marché de la Réfondation - République du Niger<br>
              Centenaire de Niamey 2026<br>
              Fraternité, Travail, Progrès</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Bonjour ${candidateName},

🎉 FÉLICITATIONS ! Votre candidature est approuvée

Référence : ${numeroReference}

Nous avons le plaisir de vous informer que votre candidature a été approuvée par notre jury.

💰 PROCHAINE ÉTAPE : PAIEMENT
Montant à payer : 100 000 FCFA
Ce montant garantit votre place et l'attribution définitive de votre kiosque de 4 m².

Prochaines démarches :
1. Paiement des frais (notre équipe vous contactera)
2. Signature du contrat d'occupation
3. Attribution de votre kiosque
4. Remise des badges et documents
5. Installation et début de votre activité

Notre équipe prendra contact avec vous dans les 48 heures pour finaliser votre inscription.

Merci de votre confiance et bienvenue au Marché de la Réfondation !

Cordialement,
L'équipe du Marché de la Réfondation
Ministère du Commerce et de l'Industrie
République du Niger
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email d\'approbation envoyé:', info.messageId);
    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'approbation:', error);
    return { success: false, message: 'Erreur lors de l\'envoi de l\'email' };
  }
}

/**
 * Envoyer un email de décision du jury (Rejeté)
 */
export async function sendRejectionEmail(
  to: string,
  candidateName: string,
  numeroReference: string,
  reason?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const mailOptions = {
      from: '"Marché de la Réfondation" <refondation@nnumerique.com>',
      to: to,
      subject: `Décision concernant votre candidature - ${numeroReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: white;
              border: 2px solid #6b7280;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Décision de candidature</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${candidateName}</strong>,</p>
              
              <p>Nous vous remercions d'avoir postulé pour devenir exposant au Marché de la Réfondation.</p>

              <div class="info-box">
                <p style="margin: 10px 0;">Référence : <strong>${numeroReference}</strong></p>
                <p style="margin: 10px 0;">
                  Après examen attentif de votre dossier, nous sommes au regret de vous informer que votre candidature n'a pas été retenue pour cette édition.
                </p>
                ${reason ? `
                <p style="margin: 15px 0 5px 0;"><strong>Motif :</strong></p>
                <p style="margin: 5px 0; padding: 10px; background: #f3f4f6; border-radius: 5px;">
                  ${reason}
                </p>
                ` : ''}
              </div>

              <p>
                Cette décision ne remet pas en cause la qualité de votre activité. Nous vous encourageons vivement à postuler à nouveau lors des prochaines opportunités.
              </p>

              <p>
                <strong>💡 Conseils pour une future candidature :</strong>
              </p>
              <ul>
                <li>Vérifiez que vos produits correspondent aux secteurs prioritaires</li>
                <li>Mettez en avant l'origine locale de vos matières premières</li>
                <li>Soulignez l'innovation dans vos processus de production</li>
                <li>Présentez vos certifications de qualité si disponibles</li>
              </ul>

              <p style="margin-top: 30px;">
                Nous vous remercions de votre intérêt et vous souhaitons beaucoup de succès dans vos activités.
              </p>

              <p style="margin-top: 30px;">
                Cordialement,<br>
                <strong>L'équipe du Marché de la Réfondation</strong><br>
                Ministère du Commerce et de l'Industrie
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Marché de la Réfondation - République du Niger<br>
              Centenaire de Niamey 2026<br>
              Fraternité, Travail, Progrès</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Bonjour ${candidateName},

Nous vous remercions d'avoir postulé pour devenir exposant au Marché de la Réfondation.

Référence : ${numeroReference}

Après examen attentif de votre dossier, nous sommes au regret de vous informer que votre candidature n'a pas été retenue pour cette édition.

${reason ? `Motif : ${reason}` : ''}

Cette décision ne remet pas en cause la qualité de votre activité. Nous vous encourageons vivement à postuler à nouveau lors des prochaines opportunités.

Conseils pour une future candidature :
- Vérifiez que vos produits correspondent aux secteurs prioritaires
- Mettez en avant l'origine locale de vos matières premières
- Soulignez l'innovation dans vos processus de production
- Présentez vos certifications de qualité si disponibles

Nous vous remercions de votre intérêt et vous souhaitons beaucoup de succès dans vos activités.

Cordialement,
L'équipe du Marché de la Réfondation
Ministère du Commerce et de l'Industrie
République du Niger
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de rejet envoyé:', info.messageId);
    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de rejet:', error);
    return { success: false, message: 'Erreur lors de l\'envoi de l\'email' };
  }
}
