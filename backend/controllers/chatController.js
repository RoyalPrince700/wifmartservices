// backend/controllers/chatController.js

import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * Start a chat with another user
 * Validates existence of the other user and returns chat metadata
 */
export const startChat = async (req, res, next) => {
  try {
    const { providerId } = req.body;
    const clientId = req.user._id;

    // Validate provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Generate consistent chatId
    const chatId = [clientId.toString(), providerId].sort().join('_');

    // Check if chat already has messages
    const existingMessageCount = await ChatMessage.countDocuments({ chatId });

    // Return chat metadata
    res.status(200).json({
      success: true,
      chatId,
      participant: {
        id: provider._id,
        name: provider.name,
        profile_image: provider.profile_image,
        isVerifiedBadge: provider.isVerifiedBadge,
        verification_status: provider.verification_status,
      },
      hasHistory: existingMessageCount > 0,
      message: 'Chat initialized successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of recent conversations
 * Returns participants with last message and unread status
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all messages where user is sender or receiver
    const messages = await ChatMessage.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ timestamp: -1 })
      .populate('senderId', 'name profile_image isVerifiedBadge')
      .populate('receiverId', 'name profile_image isVerifiedBadge');

    if (messages.length === 0) {
      return res.status(200).json([]);
    }

    // Map to track latest message per chat
    const latestPerChat = new Map();

    messages.forEach((msg) => {
      const otherId = msg.senderId._id.toString() === userId.toString()
        ? msg.receiverId._id.toString()
        : msg.senderId._id.toString();

      const key = [userId.toString(), otherId].sort().join('_');

      if (!latestPerChat.has(key)) {
        latestPerChat.set(key, {
          otherUser: msg.senderId._id.toString() === userId.toString()
            ? msg.receiverId
            : msg.senderId,
          lastMessage: msg.message,
          timestamp: msg.timestamp,
          unread: !msg.read && msg.receiverId._id.toString() === userId.toString(),
        });
      }
    });

    // Convert to array and sort by timestamp
    const conversations = Array.from(latestPerChat.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get messages between current user and another user
 */
export const getMessages = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate chatId
    const chatId = [currentUserId.toString(), otherUserId].sort().join('_');

    // Fetch messages
    const messages = await ChatMessage.find({ chatId })
      .populate('senderId', 'name profile_image')
      .populate('receiverId', 'name profile_image')
      .sort('timestamp');

    // Mark received messages as read
    await ChatMessage.updateMany(
      { chatId, receiverId: currentUserId, read: false },
      { read: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Send a new message
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Generate chatId
    const chatId = [senderId.toString(), receiverId].sort().join('_');

    // Create and save message
    const newMessage = new ChatMessage({
      chatId,
      senderId,
      receiverId,
      message: message.trim(),
    });

    const savedMessage = await newMessage.save();

    // Populate sender and receiver info
    const populatedMessage = await ChatMessage.findById(savedMessage._id)
      .populate('senderId', 'name profile_image')
      .populate('receiverId', 'name profile_image');

    // Emit message via Socket.IO to chat room
    const io = req.app.get('io');
    io.to(chatId).emit('new-message', populatedMessage);

    // Create notification for receiver (only if receiver is not the sender)
    if (receiverId.toString() !== senderId.toString()) {
      try {
        // Get sender info for notification
        const sender = await User.findById(senderId).select('name');

        // Create notification with metadata
        const notification = new Notification({
          user: receiverId,
          type: 'message',
          message: `New message from ${sender.name}`,
          relatedId: populatedMessage._id,
          onModel: 'ChatMessage',
          metadata: {
            senderId: senderId,
            senderName: sender.name,
            chatId: chatId,
          },
        });

        await notification.save();

        // Emit notification via Socket.IO
        io.to(`user_${receiverId}`).emit('new-notification', {
          type: 'message',
          message: `New message from ${sender.name}`,
          id: notification._id,
          timestamp: notification.createdAt,
        });

      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the message send if notification fails
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};