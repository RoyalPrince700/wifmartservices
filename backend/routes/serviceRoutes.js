// backend/routes/serviceRoutes.js
import express from 'express';
import { createService, getServices, updateService, deleteService } from '../controllers/serviceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createService);
router.get('/user/:userId', getServices);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

export default router;