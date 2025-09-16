// backend/routes/admin.js
import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAllServices,
  deleteService,
  getAllPortfolios,
  deletePortfolio,
  getVerifiedUsers,
  getStats,

  // CAC Verification
  getCACRequests,
  approveCAC,
  rejectCAC,

  // Badge Verification
  getBadgeRequests,
  approveBadge,
  rejectBadge,
} from '../controllers/adminController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(authorize('admin'));

// === USERS ===
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// === SERVICES ===
router.get('/services', getAllServices);
router.delete('/services/:id', deleteService);

// === PORTFOLIOS ===
router.get('/portfolios', getAllPortfolios);
router.delete('/portfolios/:id', deletePortfolio);

// === VERIFIED USERS ===
router.get('/verified-users', getVerifiedUsers);

// === CAC VERIFICATION ===
router.get('/cac-requests', getCACRequests);
router.post('/approve-cac/:id', approveCAC);
router.post('/reject-cac/:id', rejectCAC);

// === BADGE VERIFICATION ===
router.get('/badge-requests', getBadgeRequests);
router.post('/approve-badge/:id', approveBadge);
router.post('/reject-badge/:id', rejectBadge);

// === STATS ===
router.get('/stats', getStats);

export default router;