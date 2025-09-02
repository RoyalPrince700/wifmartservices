// backend/controllers/notificationController.js

import Notification from '../models/Notification.js';

/**
 * Get all notifications for the logged-in user
 */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('relatedId', 'title message status') // Optional: populate related data
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: id, user: userId });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notification(s) as read`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};