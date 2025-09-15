// backend/routes/userRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getUser,
  updateUser,
  getMe,
  setupProfile,
  getProfile,
  getHiredProviders,
  getClients,
  applyForVerification,
} from '../controllers/userController.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Existing routes
router.get('/me', authMiddleware, getMe);

router.post(
  '/profile/setup',
  authMiddleware,
  upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'cac_certificate', maxCount: 1 },
    { name: 'portfolio_images', maxCount: 10 } // ✅ Updated to match frontend limit
  ]),
  (req, res, next) => {
    // Handle portfolio_images_to_delete as a form field (not a file)
    if (req.body.portfolio_images_to_delete) {
      // Ensure it's an array
      req.body.portfolio_images_to_delete = Array.isArray(req.body.portfolio_images_to_delete)
        ? req.body.portfolio_images_to_delete
        : [req.body.portfolio_images_to_delete];
    }
    next();
  },
  setupProfile
);
router.get('/profile', authMiddleware, getProfile);

// ✅ put specific routes BEFORE dynamic `/:id`
router.get('/hired-providers', authMiddleware, getHiredProviders);
router.get('/clients', authMiddleware, getClients);
router.post(
  '/verification',
  authMiddleware,
  upload.array('verification_documents', 5),
  applyForVerification
);

// dynamic routes last
router.get('/:id', getUser);
router.put('/:id', authMiddleware, updateUser);

export default router;
