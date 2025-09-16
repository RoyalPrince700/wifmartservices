// emails.js
import { mailtrapClient, sender } from './mailtrap.config.js';
import emailTemplates from './emailTemplate.js';

/**
 * Send welcome email to new user
 * @param {string} recipientEmail - Email address of the new user
 * @param {string} userName - Name of the new user
 */
const sendWelcomeEmail = async (recipientEmail, userName) => {
  console.log('📧 Starting welcome email process...');
  console.log('  - Recipient Email:', recipientEmail);
  console.log('  - User Name:', userName);
  
  try {
    console.log('📝 Generating welcome email template...');
    const template = emailTemplates.welcomeEmail(userName);
    console.log('  - Template subject:', template.subject);
    console.log('  - Template HTML length:', template.html.length);

    console.log('📨 Preparing Mailtrap message...');
    const mailtrapMessage = {
      from: sender,
      to: [{ email: recipientEmail }],
      subject: template.subject,
      html: template.html,
      category: "Welcome Email"
    };
    console.log('  - From:', sender);
    console.log('  - To:', recipientEmail);
    console.log('  - Subject:', template.subject);

    console.log('🚀 Sending welcome email via Mailtrap...');
    const response = await mailtrapClient.send(mailtrapMessage);
    console.log('✅ Welcome email sent successfully!');
    console.log('  - Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending welcome email:');
    console.error('  - Error message:', error.message);
    console.error('  - Error stack:', error.stack);
    console.error('  - Full error:', error);
    throw error;
  }
};

/**
 * Send hire request notification email to service provider
 * @param {string} recipientEmail - Email address of the service provider
 * @param {string} userName - Name of the service provider
 * @param {string} clientName - Name of the client who sent the request
 * @param {string} serviceName - Name of the service/project
 */
const sendHireConfirmationEmail = async (recipientEmail, userName, clientName, serviceName) => {
  console.log('📧 Starting hire request notification email process...');
  console.log('  - Recipient Email (Provider):', recipientEmail);
  console.log('  - Provider Name:', userName);
  console.log('  - Client Name:', clientName);
  console.log('  - Service Name:', serviceName);
  
  try {
    console.log('📝 Generating email template...');
    const template = emailTemplates.hireConfirmationEmail(userName, clientName, serviceName);
    console.log('  - Template subject:', template.subject);
    console.log('  - Template HTML length:', template.html.length);

    console.log('📨 Preparing Mailtrap message...');
    const mailtrapMessage = {
      from: sender,
      to: [{ email: recipientEmail }],
      subject: template.subject,
      html: template.html,
      category: "Hire Confirmation"
    };
    console.log('  - From:', sender);
    console.log('  - To:', recipientEmail);
    console.log('  - Subject:', template.subject);

    console.log('🚀 Sending email via Mailtrap...');
    const response = await mailtrapClient.send(mailtrapMessage);
    console.log('✅ Hire request notification email sent successfully!');
    console.log('  - Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending hire request notification email:');
    console.error('  - Error message:', error.message);
    console.error('  - Error stack:', error.stack);
    console.error('  - Full error:', error);
    throw error;
  }
};

/**
 * Send badge verification completion email
 * @param {string} recipientEmail - Email address of the verified user
 * @param {string} userName - Name of the verified user
 */
const sendBadgeVerificationEmail = async (recipientEmail, userName) => {
  try {
    const template = emailTemplates.badgeVerificationEmail(userName);

    const mailtrapMessage = {
      from: sender,
      to: [{ email: recipientEmail }],
      subject: template.subject,
      html: template.html,
      category: "Badge Verification"
    };

    const response = await mailtrapClient.send(mailtrapMessage);
    console.log('Badge verification email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending badge verification email:', error);
    throw error;
  }
};

/**
 * Send first message notification email
 * @param {string} recipientEmail - Email address of the message recipient
 * @param {string} recipientName - Name of the message recipient
 * @param {string} senderName - Name of the message sender
 * @param {string} messagePreview - Preview of the message (first 100 characters)
 */
const sendFirstMessageEmail = async (recipientEmail, recipientName, senderName, messagePreview) => {
  console.log('📧 Starting first message notification email process...');
  console.log('  - Recipient Email:', recipientEmail);
  console.log('  - Recipient Name:', recipientName);
  console.log('  - Sender Name:', senderName);
  console.log('  - Message Preview:', messagePreview);
  
  try {
    console.log('📝 Generating first message email template...');
    const template = emailTemplates.firstMessageEmail(recipientName, senderName, messagePreview);
    console.log('  - Template subject:', template.subject);
    console.log('  - Template HTML length:', template.html.length);

    console.log('📨 Preparing Mailtrap message...');
    const mailtrapMessage = {
      from: sender,
      to: [{ email: recipientEmail }],
      subject: template.subject,
      html: template.html,
      category: "First Message Notification"
    };
    console.log('  - From:', sender);
    console.log('  - To:', recipientEmail);
    console.log('  - Subject:', template.subject);

    console.log('🚀 Sending first message notification email via Mailtrap...');
    const response = await mailtrapClient.send(mailtrapMessage);
    console.log('✅ First message notification email sent successfully!');
    console.log('  - Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending first message notification email:');
    console.error('  - Error message:', error.message);
    console.error('  - Error stack:', error.stack);
    console.error('  - Full error:', error);
    throw error;
  }
};

/**
 * Generic email sender function
 * @param {string} recipientEmail - Email address of the recipient
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {string} category - Email category for tracking
 */
const sendCustomEmail = async (recipientEmail, subject, htmlContent, category = "Custom Email") => {
  try {
    const mailtrapMessage = {
      from: sender,
      to: [{ email: recipientEmail }],
      subject: subject,
      html: htmlContent,
      category: category
    };

    const response = await mailtrapClient.send(mailtrapMessage);
    console.log('Custom email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending custom email:', error);
    throw error;
  }
};

export {
  sendWelcomeEmail,
  sendHireConfirmationEmail,
  sendBadgeVerificationEmail,
  sendFirstMessageEmail,
  sendCustomEmail
};
