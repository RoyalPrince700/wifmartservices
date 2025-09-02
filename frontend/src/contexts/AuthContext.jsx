// frontend/src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ✅ Import Socket.IO functions
import { initSocket, disconnectSocket } from '../services/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 👇 Add socket to state
  const [socket, setSocket] = useState(null);

  // Fetch user when token changes
  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      if (!token || cancelled) return;

      setLoading(true);
      try {
        const response = await api.get('/api/users/me');
        if (cancelled) return;

        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setToken('');
          localStorage.removeItem('token');
          navigate('/signin');
        }
      } catch (error) {
        if (cancelled) return;
        setToken('');
        localStorage.removeItem('token');
        navigate('/signin');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  // ✅ Initialize Socket.IO when user logs in
  useEffect(() => {
    if (token && user) {
      const newSocket = initSocket(token);
      setSocket(newSocket);

      // Optional: Listen for disconnect
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        if (err.message === 'invalid credentials') {
          logout(); // Optional: logout if token is invalid
        }
      });
    }

    // Cleanup on unmount or logout
    return () => {
      if (socket) {
        disconnectSocket();
        setSocket(null);
      }
    };
  }, [token, user]);

  // ✅ Enhanced login: accept token only, fetch user inside
  const login = async (newToken) => {
    try {
      // Set token first
      setToken(newToken);
      localStorage.setItem('token', newToken);

      // Fetch user data
      const response = await api.get('/api/users/me');
      const newUser = response.data.user;

      setUser(newUser);

      // Socket will be initialized by useEffect above
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }
  };

  // ✅ Logout: disconnect socket
  const logout = () => {
    if (socket) {
      disconnectSocket();
      setSocket(null);
    }
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? <div className="loading">Loading...</div> : children}
    </AuthContext.Provider>
  );
};