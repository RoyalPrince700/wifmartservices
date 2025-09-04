// routes/searchRoutes.js
import express from 'express';
import { searchProviders, getFeaturedProviders, getCategoryCounts } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchProviders);
router.get('/featured', getFeaturedProviders);
router.get('/categories/counts', getCategoryCounts);

export default router;