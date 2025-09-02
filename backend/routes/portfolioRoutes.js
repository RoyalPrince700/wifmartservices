// backend/routes/portfolioRoutes.js
import express from 'express';
import { createPortfolio, getPortfolios, updatePortfolio, deletePortfolio } from '../controllers/portfolioController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload multiple portfolio images
router.post(
  '/upload',
  authMiddleware,
  upload.array('portfolio_images', 15), // Max 15 images
  createPortfolio
);

// Get user's portfolio
router.get('/user/:userId', authMiddleware, getPortfolios);

// Update portfolio item (e.g., link)
router.put('/:id', authMiddleware, updatePortfolio);

// Delete portfolio image (from DB + Cloudinary)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Ensure user owns this
    if (portfolioItem.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Optional: Delete from Cloudinary
    if (portfolioItem.cloudinary_id) {
      await cloudinary.uploader.destroy(portfolioItem.cloudinary_id);
    }

    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio image deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;