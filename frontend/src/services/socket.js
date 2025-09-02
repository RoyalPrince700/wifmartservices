// frontend/src/services/socket.js
import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    console.log('🔌 Initializing socket connection to:', apiUrl);

    socket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'], // Add polling as fallback
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Add connection event listeners for debugging
    socket.on('connect', () => {
      console.log('🟢 Socket connected successfully:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection failed:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized yet');
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};