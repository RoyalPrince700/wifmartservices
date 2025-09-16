// Test script for email functionality
// Run this with: node test-email.js

import { sendWelcomeEmail, sendHireConfirmationEmail, sendFirstMessageEmail } from './mailtrap/emails.js';

console.log('🧪 Starting Email Test Script...');
console.log('=====================================');

// Test welcome email
console.log('\n📧 Testing Welcome Email...');
try {
  await sendWelcomeEmail('test@example.com', 'Test User');
  console.log('✅ Welcome email test completed successfully!');
} catch (error) {
  console.error('❌ Welcome email test failed:', error.message);
}

// Test hire request notification email
console.log('\n📧 Testing Hire Request Notification Email...');
try {
  await sendHireConfirmationEmail(
    'provider@example.com',
    'John Provider',
    'Jane Client',
    'Website Development Project'
  );
  console.log('✅ Hire request notification email test completed successfully!');
} catch (error) {
  console.error('❌ Hire request notification email test failed:', error.message);
}

// Test first message notification email
console.log('\n📧 Testing First Message Notification Email...');
try {
  await sendFirstMessageEmail(
    'recipient@example.com',
    'Sarah Recipient',
    'Mike Sender',
    'Hi Sarah! I saw your profile and I\'m interested in your graphic design services. Could we discuss a potential project?'
  );
  console.log('✅ First message notification email test completed successfully!');
} catch (error) {
  console.error('❌ First message notification email test failed:', error.message);
}

console.log('\n🏁 Email tests completed!');
console.log('Check your Mailtrap inbox for the test emails.');
console.log('If you see errors above, check your .env file configuration.');
