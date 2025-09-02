// backend/routes/webhookRoutes.js
import express from 'express';
const router = express.Router();

// Health check or placeholder route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Webhook route active. No action yet.' });
});

// Placeholder for Flutterwave webhook (optional)
router.post('/flutterwave', express.raw({ type: 'application/json' }), (req, res) => {
  console.log('Received Flutterwave webhook (unverified):', req.body.toString());
  res.status(200).send('OK');
});

export default router;