//wifmart\backend\routes\auth.js
import express from 'express';
import passport from 'passport';
import { getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 1. Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Handle callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const { token } = req.user;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// 3. Get logged-in user
router.get('/me', protect, getMe);

export default router;
