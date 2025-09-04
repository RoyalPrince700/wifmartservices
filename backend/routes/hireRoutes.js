// backend/routes/hireRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendHireRequest, getHireRequests, updateHireStatus, leaveReview, getReview } from '../controllers/hireController.js';
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
router.get('/requests', authMiddleware, getHireRequests);

/**
 * PATCH /api/hire/:serviceId/status
 * Update hire request status
 */
router.patch('/:serviceId/status', authMiddleware, updateHireStatus);

/**
 * POST /api/hire/:serviceId/review
 * Leave a review for a completed service
 */
router.post('/:serviceId/review', authMiddleware, leaveReview);

/**
 * GET /api/hire/:serviceId/review
 * Get review for a service
 */
router.get('/:serviceId/review', authMiddleware, getReview);

export default router;