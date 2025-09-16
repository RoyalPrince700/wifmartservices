# 📧 Email Setup Guide for Wifmart

This guide will help you set up email notifications for your Wifmart application, including welcome emails and hire confirmation emails.

## 🚀 Current Email Features

Your Wifmart application includes the following email notifications:

1. **Welcome Email** - Sent to new users when they sign up
2. **Hire Confirmation Email** - Sent to service providers when they get hired
3. **Badge Verification Email** - Sent when a user's verification is completed

## 📋 Prerequisites

- A Mailtrap account (free tier available)
- Access to your backend environment configuration

## 🔧 Setup Instructions

### Step 1: Create Mailtrap Account

1. Go to [https://mailtrap.io/](https://mailtrap.io/)
2. Sign up for a free account or sign in if you already have one
3. The free tier allows you to send up to 100 emails per month

### Step 2: Get Your Mailtrap Credentials

1. In your Mailtrap dashboard, navigate to **Email Testing** > **Inboxes**
2. Create a new inbox or use an existing one
3. Click on your inbox
4. Go to the **SMTP & API Settings** tab
5. Copy the following values:
   - **API Token** (this will be your `MAILTRAP_TOKEN`)
   - **Endpoint** (this will be your `MAILTRAP_ENDPOINT`)

### Step 3: Configure Environment Variables

1. Open your `backend/.env` file
2. Add the following Mailtrap configuration:

```env
# Mailtrap Configuration (for email notifications)
MAILTRAP_TOKEN=your_actual_mailtrap_token_here
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io
```

3. Replace `your_actual_mailtrap_token_here` with your actual Mailtrap API token

### Step 4: Restart Your Backend Server

After updating your environment variables, restart your backend server:

```bash
cd backend
npm start
```

## ✅ Testing Email Functionality

### Test Welcome Email
1. Sign up a new user through Google OAuth
2. Check your Mailtrap inbox for the welcome email
3. You should see an email with the subject: "Welcome to Wifmart - Your Journey Starts Here!"

### Test Hire Confirmation Email
1. As a client, send a hire request to a service provider
2. As the service provider, accept the request (status: 'accepted')
3. As the service provider, change the status to 'hired'
4. Check your Mailtrap inbox for the hire confirmation email
5. You should see an email with the subject: "Congratulations! You've Been Hired on Wifmart"

## 🔍 Troubleshooting

### Emails Not Being Sent

1. **Check Environment Variables**: Ensure `MAILTRAP_TOKEN` and `MAILTRAP_ENDPOINT` are correctly set in your `.env` file
2. **Check Server Logs**: Look for error messages in your backend console
3. **Verify Mailtrap Account**: Make sure your Mailtrap account is active and has available quota
4. **Check Network**: Ensure your server can reach the Mailtrap API

### Common Error Messages

- **"MAILTRAP_TOKEN is not defined"**: Add the token to your `.env` file
- **"Invalid API token"**: Verify your Mailtrap token is correct
- **"Quota exceeded"**: Upgrade your Mailtrap plan or wait for quota reset

### Debug Mode

To enable more detailed logging, you can add this to your backend code:

```javascript
// Add this to see detailed email sending logs
console.log('Mailtrap Token:', process.env.MAILTRAP_TOKEN ? 'Set' : 'Not Set');
console.log('Mailtrap Endpoint:', process.env.MAILTRAP_ENDPOINT);
```

## 🎨 Email Templates

The email templates are located in `backend/mailtrap/emailTemplate.js`. You can customize:

- Email subject lines
- HTML content and styling
- Email sender information
- Company branding

### Current Email Templates

1. **Welcome Email**: Blue theme with onboarding information
2. **Hire Confirmation**: Green theme with project details
3. **Badge Verification**: Yellow theme with verification benefits

## 🚀 Production Setup

For production deployment:

1. **Use Production Email Service**: Consider upgrading to a production email service like SendGrid, AWS SES, or Mailgun
2. **Update Sender Email**: Change the sender email from `hello@wifmart.com` to your actual domain
3. **Monitor Email Delivery**: Set up email delivery monitoring and bounce handling
4. **Rate Limiting**: Implement rate limiting to prevent spam

## 📞 Support

If you encounter issues with email setup:

1. Check the [Mailtrap documentation](https://mailtrap.io/docs/)
2. Review your backend server logs for error messages
3. Verify your environment variables are correctly set
4. Test with a simple email first before testing the full application flow

---

**Note**: The email functionality is already implemented in your codebase. You just need to configure the Mailtrap credentials to enable it!
