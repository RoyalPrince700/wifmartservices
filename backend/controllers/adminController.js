// backend/controllers/adminController.js
import User from '../models/User.js';
import Service from '../models/Service.js';
import Portfolio from '../models/Portfolio.js';
import ChatMessage from '../models/ChatMessage.js';
import { sendBadgeVerificationEmail } from '../mailtrap/emails.js';

// === USERS ===
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, query = '' } = req.query;
    const filter = query
      ? { $or: [{ name: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }] }
      : {};

    const users = await User.find(filter)
      .select('name email skills verification_status isAdmin created_at')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ created_at: -1 });

    const total = await User.countDocuments(filter);

    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// === SERVICES ===
export const getAllServices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, query = '' } = req.query;
    const filter = query ? { title: { $regex: query, $options: 'i' } } : {};

    const services = await Service.find(filter)
      .populate('client_id', 'name email')
      .populate('provider_id', 'name')
      .sort({ created_at: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Service.countDocuments(filter);

    res.json({
      services: services.map(s => ({
        ...s._doc,
        client_id: s.client_id,
        provider_id: s.provider_id
      })),
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};

// === PORTFOLIOS ===
export const getAllPortfolios = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const portfolios = await Portfolio.find({})
      .populate('user_id', 'name')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Portfolio.countDocuments();

    res.json({
      portfolios,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ message: 'Portfolio deleted' });
  } catch (error) {
    next(error);
  }
};

// === CAC VERIFICATION ===
export const getCACRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { cac_status: 'Pending Verification' };

    const requests = await User.find(filter)
      .select('name email cac_number cac_certificate created_at')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ created_at: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      requests,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

export const approveCAC = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        cac_status: 'Verified',
        verification_status: 'Approved' // Optional: auto-approve badge too
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'CAC verification approved', user });
  } catch (error) {
    next(error);
  }
};

export const rejectCAC = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        cac_status: 'Not Submitted',
        verification_rejection_reason: reason || 'Invalid CAC documentation'
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'CAC verification rejected', user });
  } catch (error) {
    next(error);
  }
};

// === BADGE VERIFICATION ===
export const getBadgeRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { verification_status: 'Pending' };

    const requests = await User.find(filter)
      .select('name email skills profile_completion verification_status created_at')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ created_at: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      requests,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

export const approveBadge = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verification_status: 'Approved' },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Send badge verification email
    try {
      await sendBadgeVerificationEmail(user.email, user.name);
      console.log('Badge verification email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send badge verification email:', emailError);
      // Don't throw error - badge approval should continue even if email fails
    }

    res.json({ message: 'Badge verification approved', user });
  } catch (error) {
    next(error);
  }
};

export const rejectBadge = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        verification_status: 'Rejected',
        verification_rejection_reason: reason || 'Does not meet criteria'
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Badge verification rejected', user });
  } catch (error) {
    next(error);
  }
};

// === VERIFIED USERS ===
export const getVerifiedUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const verifiedUsers = await User.find({ verification_status: 'Approved' })
      .select('name email skills profile_completion verification_status created_at')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ created_at: -1 });

    const total = await User.countDocuments({ verification_status: 'Approved' });

    res.json({
      users: verifiedUsers,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

// === STATS ===
export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalPortfolios = await Portfolio.countDocuments();

    const totalVerifiedUsers = await User.countDocuments({ verification_status: 'Approved' });

    // Count active conversations (distinct chatId with at least one message)
    const totalConversations = await ChatMessage.distinct('chatId').then(chatIds => chatIds.length);

    res.json({
      totalUsers,
      totalServices,
      totalPortfolios,
      totalVerifiedUsers,
      totalConversations
    });
  } catch (error) {
    next(error);
  }
};