// frontend/src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setupProfile = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await api.post('/api/users/profile/setup', formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Profile setup failed';
  }
};

export const updateProfile = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await api.patch('/api/users/profile', formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Profile update failed';
  }
};

export const searchProviders = async (query = '') => {
  try {
    const response = await api.get('/api/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Search failed';
  }
};

export const fetchProviderProfile = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch profile';
  }
};

// frontend/src/services/api.js

// frontend/src/services/api.js

export const getHiredProviders = async () => {
  console.log('📤 Fetching hired providers...');
  try {
    const response = await api.get('/api/users/hired-providers');
    console.log('📥 Full response:', response);
    
    const result = response.data;
    console.log('🎯 Parsed result:', result);
    
    return result;
  } catch (error) {
    console.error('🚨 getHiredProviders error:', error);
    throw error.response?.data?.message || 'Failed to fetch hired providers';
  }
};

export const getClients = async () => {
  console.log('📤 Fetching clients...');
  try {
    const response = await api.get('/api/users/clients');
    console.log('📥 getClients response:', response);
    return response.data;
  } catch (error) {
    console.error('🚨 getClients error:', error);
    throw error.response?.data?.message || 'Failed to fetch clients';
  }
};

export const getAdminUsers = async (page = 1, limit = 10, query = '') => {
  try {
    const response = await api.get('/api/admin/users', { params: { page, limit, query } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch users';
  }
};

export const deleteAdminUser = async (id) => {
  try {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};

export const getAdminServices = async (page = 1, limit = 10, query = '') => {
  try {
    const response = await api.get('/api/admin/services', { params: { page, limit, query } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch services';
  }
};

export const deleteAdminService = async (id) => {
  try {
    const response = await api.delete(`/api/admin/services/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete service';
  }
};

export const getAdminPortfolios = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/api/admin/portfolios', { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch portfolios';
  }
};

export const deleteAdminPortfolio = async (id) => {
  try {
    const response = await api.delete(`/api/admin/portfolios/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete portfolio';
  }
};

// === CAC VERIFICATION ===

/**
 * Fetch CAC verification requests (users who submitted CAC for review)
 */
export const getCACRequests = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/api/admin/cac-requests', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch CAC verification requests';
  }
};

/**
 * Approve a user's CAC verification
 */
export const approveCACVerification = async (id) => {
  try {
    const response = await api.post(`/api/admin/approve-cac/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to approve CAC verification';
  }
};

/**
 * Reject a user's CAC verification
 * @param {string} id - User ID
 * @param {string} [reason] - Optional rejection reason
 */
export const rejectCACVerification = async (id, reason) => {
  try {
    const response = await api.post(`/api/admin/reject-cac/${id}`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to reject CAC verification';
  }
};

// === BADGE VERIFICATION ===

/**
 * Fetch badge verification requests (users who applied for verified badge)
 */
export const getBadgeRequests = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/api/admin/badge-requests', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch badge verification requests';
  }
};

/**
 * Approve a user's badge verification
 */
export const approveBadgeVerification = async (id) => {
  try {
    const response = await api.post(`/api/admin/approve-badge/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to approve badge verification';
  }
};

/**
 * Reject a user's badge verification
 */
export const rejectBadgeVerification = async (id, reason) => {
  try {
    const response = await api.post(`/api/admin/reject-badge/${id}`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to reject badge verification';
  }
};

export const getAdminStats = async () => {
  try {
    const response = await api.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch stats';
  }
};

// frontend/src/services/api.js
export const sendHireRequest = async (providerId, formData) => {
  try {
    const response = await api.post(`/api/hire/${providerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send hire request';
  }
};

// Get hire requests (for provider)
export const getHireRequests = async () => {
  try {
    const response = await api.get('/api/hire/requests');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch hire requests';
  }
};

export const updateHireStatus = async (serviceId, status) => {
  try {
    const response = await api.put(`/api/services/${serviceId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update status';
  }
};

// Leave a review
export const leaveReview = async (serviceId, rating, comment) => {
  try {
    const response = await api.post(`/api/hire/${serviceId}/review`, { rating, comment });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to submit review';
  }
};
export const updateHireRequest = async (serviceId, formData) => {
  try {
    const response = await api.patch(`/api/hire/${serviceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update request';
  }
};

/**
 * Initiate payment for verified badge
 */
export const initiateBadgePayment = async (plan) => {
  try {
    const response = await api.post('/api/subscription/initiate', { plan });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate payment';
  }
};

/**
 * Verify payment and activate badge
 * @param {string|number} transaction_id - Flutterwave's transaction_id
 */
export const verifyBadgePayment = async (transaction_id) => {
  try {
    const response = await api.post('/api/subscription/verify', { 
      transaction_id  // ✅ Send as transaction_id
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to verify payment';
  }
};

// =========================
// 🔬 Chat API Functions
// =========================

/**
 * Start a chat with a provider
 * Validates and initializes a chat session
 */
export const startChat = async (providerId) => {
  try {
    const response = await api.post('/api/chat/start', { providerId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to start chat';
  }
};

/**
 * Send a message to a user
 */
export const sendMessage = async (receiverId, message) => {
  try {
    const response = await api.post('/api/chat/send', { receiverId, message });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send message';
  }
};

/**
 * Get messages with a specific user
 */
export const getMessages = async (otherUserId) => {
  try {
    const response = await api.get(`/api/chat/messages/${otherUserId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load messages';
  }
};

/**
 * Get list of recent conversations
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/api/chat/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load conversations';
  }
};

/**
 * Mark messages with a user as read
 */
export const markMessagesAsRead = async (otherUserId) => {
  try {
    await api.post('/api/chat/mark-read', { otherUserId });
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    // Don't throw — non-critical
  }
};



// frontend/src/services/api.js

export const getNotifications = async () => {
  try {
    const response = await api.get('/api/notifications');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load notifications';
  }
};

export const markAsRead = async (id) => {
  try {
    await api.put(`/api/notifications/${id}/read`);
  } catch (error) {
    throw error.response?.data?.message || 'Failed to mark as read';
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load unread count';
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.post('/api/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to mark all notifications as read';
  }
};

export default api;