// emailTemplate.js
const emailTemplates = {
  // Welcome email template for new user signup
  welcomeEmail: (userName) => ({
    subject: "Welcome to Wifmart - Your Journey Starts Here!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Wifmart</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; background-color: #007bff; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Wifmart!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for joining Wifmart, your trusted platform for connecting with skilled professionals.</p>
            <p>We're excited to have you on board! Here's what you can do next:</p>
            <ul>
              <li>Complete your profile to showcase your skills</li>
              <li>Browse available services and opportunities</li>
              <li>Connect with clients and service providers</li>
              <li>Get verified to build trust with others</li>
            </ul>
            <a href="https://wifmart.com" class="button">Get Started</a>

            <div style="margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 5px; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin-top: 0;">🎯 Are you a Service Provider?</h3>
              <p>Optimize your profile to attract more clients and stand out from the competition!</p>
              <a href="https://wifmart.com/profile-optimization-guide" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Learn How to Optimize Your Profile</a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Wifmart Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Wifmart. All rights reserved.</p>
            <p>Need help? Contact us at hello@wifmart.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email template when a user receives a hire request
  hireConfirmationEmail: (userName, clientName, serviceName) => ({
    subject: "New Hire Request on Wifmart - Action Required",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Congratulations - You've Been Hired</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; background-color: #28a745; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .highlight { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Hire Request!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Great news! You've received a new hire request on Wifmart.</p>
            <div class="highlight">
              <h3>Request Details:</h3>
              <p><strong>Client:</strong> ${clientName}</p>
              <p><strong>Service:</strong> ${serviceName}</p>
            </div>
            <p>Please check your dashboard to review the full project details and respond to this request.</p>
            <a href="https://wifmart.com/dashboard" class="button">View Hire Request</a>
            <p>Don't keep your potential client waiting! Respond promptly to maintain your professional reputation.</p>
            <p>Best regards,<br>The Wifmart Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Wifmart. All rights reserved.</p>
            <p>Need help? Contact us at hello@wifmart.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email template when a user verified badge is completed
  badgeVerificationEmail: (userName) => ({
    subject: "Badge Verification Completed - Welcome to Verified Professionals!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Badge Verification Completed</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #ffc107; color: #000; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; background-color: #ffc107; color: #000 !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .badge { text-align: center; margin: 20px 0; }
          .badge img { max-width: 100px; }
          .benefits { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Verification Complete!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Congratulations! Your badge verification has been completed successfully.</p>
            <div class="badge">
              <h3>✅ Verified Professional</h3>
              <p>You now have the verified badge on your profile!</p>
            </div>
            <div class="benefits">
              <h3>Benefits of Being Verified:</h3>
              <ul>
                <li>Increased visibility to potential clients</li>
                <li>Build trust and credibility</li>
                <li>Access to premium features</li>
                <li>Higher chance of getting hired</li>
                <li>Priority support</li>
              </ul>
            </div>
            <a href="#" class="button">View Your Profile</a>
            <p>Thank you for choosing Wifmart and maintaining high standards of professionalism.</p>
            <p>Best regards,<br>The Wifmart Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Wifmart. All rights reserved.</p>
            <p>Need help? Contact us at hello@wifmart.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email template for first message notification
  firstMessageEmail: (recipientName, senderName, messagePreview) => ({
    subject: `New Message from ${senderName} on Wifmart`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message on Wifmart</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; background-color: #007bff; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .message-preview { background-color: #e9f4ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff; }
          .sender-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 New Message</h1>
          </div>
          <div class="content">
            <h2>Hello ${recipientName}!</h2>
            <p>You have received a new message on Wifmart!</p>
            <div class="sender-info">
              <h3>From: ${senderName}</h3>
            </div>
            <div class="message-preview">
              <h4>Message Preview:</h4>
              <p><em>"${messagePreview}"</em></p>
            </div>
            <p>Click the button below to view the full message and reply:</p>
            <a href="https://wifmart.com/chat" class="button">View Message</a>
            <p><strong>Note:</strong> You'll only receive email notifications for the first message from each person to avoid spam. Subsequent messages from ${senderName} won't trigger email notifications.</p>
            <p>Best regards,<br>The Wifmart Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Wifmart. All rights reserved.</p>
            <p>Need help? Contact us at hello@wifmart.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

export default emailTemplates;
