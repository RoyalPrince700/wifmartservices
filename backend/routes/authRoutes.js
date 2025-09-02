// backend/routes/authRoutes.js
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL + '/signin' }),
  (req, res) => {
    console.log('Callback success, user and token:', req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${req.user.token}`);
  }
);

export default router;
