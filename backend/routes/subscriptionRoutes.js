// backend/routes/subscriptionRoutes.js
import express from 'express';
import { initiateBadgePayment, verifyBadgePayment } from '../controllers/subscriptionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/subscription/initiate
router.post('/initiate', authMiddleware, initiateBadgePayment);

// POST /api/subscription/verify
router.post('/verify', authMiddleware, verifyBadgePayment);

export default router;