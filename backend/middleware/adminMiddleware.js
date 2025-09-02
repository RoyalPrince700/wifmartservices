// backend/middleware/adminMiddleware.js
import User from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.isAdmin) { // Assumes isAdmin field in User.js
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};