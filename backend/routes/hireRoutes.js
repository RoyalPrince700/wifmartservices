// backend/routes/hireRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendHireRequest, getHireRequests,updateHireStatus } from '../controllers/hireController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/hire/:providerId
 * Send a hire request to a provider
 */
router.post(
  '/:providerId',
  authMiddleware,
  upload.single('attachment'),
  sendHireRequest
);

/**
 * GET /api/hire/requests
 * Get all hire requests for logged-in user (provider)
 */
router.get('/requests', authMiddleware, getHireRequests,updateHireStatus);

export default router;