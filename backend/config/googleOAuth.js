//wifmart\backend\config\googleOAuth.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { sendWelcomeEmail } from '../mailtrap/emails.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile.id || !profile.emails?.[0]?.value) {
          throw new Error('Invalid Google profile data');
        }

        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        let isNewUser = false;
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || 'Unknown',
            email: profile.emails[0].value,
          });
          isNewUser = true;
          console.log('New user created:', user.email);
        } else {
          console.log('Existing user found:', user.email);
        }

        // Send welcome email to new users (don't block OAuth flow if email fails)
        if (isNewUser) {
          console.log('🎉 New user detected - attempting to send welcome email...');
          console.log('  - User Email:', user.email);
          console.log('  - User Name:', user.name);
          try {
            await sendWelcomeEmail(user.email, user.name);
            console.log('✅ Welcome email sent to:', user.email);
          } catch (emailError) {
            console.error('❌ Failed to send welcome email:');
            console.error('  - Error message:', emailError.message);
            console.error('  - Error stack:', emailError.stack);
            console.error('  - Full error:', emailError);
            // Don't throw error - OAuth should continue even if email fails
          }
        } else {
          console.log('ℹ️  Existing user - no welcome email needed');
        }

        // Validate JWT_SECRET
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        done(null, { user, token });
      } catch (error) {
        console.error('Google OAuth error:', error.message, error.stack);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((userObj, done) => {
  done(null, userObj.user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize user error:', error.message);
    done(error, null);
  }
});