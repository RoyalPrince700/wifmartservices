//wifmart\backend\config\googleOAuth.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile.id || !profile.emails?.[0]?.value) {
          throw new Error('Invalid Google profile data');
        }

        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || 'Unknown',
            email: profile.emails[0].value,
          });
          console.log('New user created:', user.email);
        } else {
          console.log('Existing user found:', user.email);
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