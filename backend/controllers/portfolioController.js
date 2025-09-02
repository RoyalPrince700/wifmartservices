// backend/controllers/portfolioController.js
import Portfolio from '../models/Portfolio.js';
import cloudinary from '../config/cloudinary.js';
// import { v2 as cloudinary } from 'cloudinary';

export const createPortfolio = async (req, res, next) => {
  try {
    const { links = [] } = req.body;
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const uploadPromises = req.files.map(async (file, index) => {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path || file.buffer, {
        folder: 'portfolio', // Cloudinary folder
        resource_type: 'image',
        transformation: { quality: 'auto:good', fetch_format: 'auto' },
      });

      const link = Array.isArray(links) ? links[index] : links;

      // Save to MongoDB
      return Portfolio.create({
        user_id: userId,
        image_url: result.secure_url,
        cloudinary_id: result.public_id, // Optional: for deletion
        link: link || '',
      });
    });

    const portfolioItems = await Promise.all(uploadPromises);

    res.status(201).json({
      message: 'Portfolio images uploaded successfully',
      portfolioItems,
    });
  } catch (error) {
    next(error);
  }
};
export const getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ user_id: req.params.userId });
    res.json(portfolios);
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) return res.status(404).json({ message: 'Portfolio not found' });

    if (portfolioItem.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    portfolioItem.link = req.body.link || portfolioItem.link;
    await portfolioItem.save();

    res.json({ message: 'Portfolio updated', portfolioItem });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (req, res, next) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) return res.status(404).json({ message: 'Portfolio not found' });

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
};
