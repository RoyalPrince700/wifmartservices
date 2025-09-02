// 👇 Step 1: Load environment variables FIRST
import 'dotenv/config';

// 👇 Step 2: Import other modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import http from 'http'; // ✅ Fix: ESM import
import { Server } from 'socket.io'; // ✅ Fix: socket.io ESM

// 👇 Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import adminRoutes from './routes/admin.js';
import hireRoutes from './routes/hireRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import './config/googleOAuth.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Prefer the shared app (used by serverless too)
import app from './app.js';

// 👇 Create HTTP server for Socket.IO
const server = http.createServer(app);

// 👇 Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// 👇 Socket.IO Authentication Middleware (Optional)
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    // If no token, allow connection but mark as unauthenticated
    if (!token) {
      socket.userId = null;
      socket.user = null;
      console.log('Socket connected without authentication');
      return next();
    }

    // Verify JWT token (you'll need to import jwt)
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

    // Attach user info to socket
    socket.userId = decoded.userId || decoded.id;
    socket.user = decoded;
    console.log('Socket authenticated for user:', socket.userId);

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    // Allow connection even if token is invalid, but don't attach user info
    socket.userId = null;
    socket.user = null;
    next();
  }
});

// 👇 Attach io to app for use in routes
app.set('io', io);

// 👇 Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());

// 👇 Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hire', hireRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// 🏁 Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ❌ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message, err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// DB connection is initialized in app.js for both environments

// 🔁 Socket.IO Connection
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id, 'User:', socket.userId || 'unauthenticated');

  // Only join notification room if user is authenticated
  if (socket.userId) {
    socket.join(`user_${socket.userId}`);
    console.log(`User ${socket.userId} joined notification room: user_${socket.userId}`);
  }

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat: ${chatId}`);
  });

  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat: ${chatId}`);
  });

  socket.on('send-message', (data) => {
    const { chatId, message, senderId, receiverId, timestamp } = data;

    // Broadcast the message to all users in the chat room (except sender)
    socket.to(chatId).emit('new-message', {
      _id: Date.now().toString(), // Temporary ID for real-time updates
      message,
      senderId: { _id: senderId },
      receiverId: { _id: receiverId },
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`Message sent in chat ${chatId}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// 🔼 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📄 API Docs: http://localhost:${PORT}/api/health`);
});
