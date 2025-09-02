// backend/routes/chatRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  startChat,
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/chatController.js';

const router = express.Router();

// 👉 Start a chat
router.post('/start', authMiddleware, startChat);

// 👉 Get conversation list
router.get('/conversations', authMiddleware, getConversations);

// 👉 Get messages with a user
router.get('/messages/:otherUserId', authMiddleware, getMessages);

// 👉 Send a message
router.post('/send', authMiddleware, sendMessage);
// 👉
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await ChatMessage.countDocuments({
      receiverId: userId,
      read: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark messages as read
router.post('/mark-read', authMiddleware, async (req, res) => {
  const { otherUserId } = req.body;
  const currentUserId = req.user._id;

  const chatId = [currentUserId, otherUserId].sort().join('_');

  try {
    await ChatMessage.updateMany(
      { chatId, receiverId: currentUserId, read: false },
      { read: true }
    );

    // Optionally: Emit "read receipt"
    const io = req.app.get('io');
    if (io && typeof io.to === 'function') {
      io.to(chatId).emit('message-read', { chatId, readerId: currentUserId });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

export default router;