// frontend/src/services/socket.js
import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    socket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'], // Add polling as fallback
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Add connection event listeners
    socket.on('connect', () => {
      // Socket connected
    });

    socket.on('connect_error', (error) => {
      // Connection error
    });

    socket.on('disconnect', (reason) => {
      // Socket disconnected
    });

    socket.on('reconnect', (attemptNumber) => {
      // Socket reconnected
    });

    socket.on('reconnect_error', (error) => {
      // Reconnection failed
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
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