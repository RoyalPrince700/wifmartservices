// filepath: frontend/src/components/Auth/AuthCallback.jsx
import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // Fixed path
import api from '../../services/api';
import Loading from '../Loading';

function AuthCallback() {
  const { login  } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    // console.log('Token from URL:', token);

    const fetchUser = async () => {
      if (token) {
        try {
          // Save token to localStorage temporarily so interceptor can read it
          localStorage.setItem('token', token);
          // console.log('Fetching user with token:', token);

          // Now this will work because `api` is an axios instance
          const response = await api.get('/api/users/me');
          // console.log('User data:', response.data.user);

          // Pass user and token to login 
          login(token, response.data.user);
          navigate('/dashboard');
        } catch (error) {
          // console.error('Auth callback error:', error);
          localStorage.removeItem('token'); // Cleanup invalid token
          navigate('/signin');
        }
      } else {
        navigate('/signin');
      }
    };

    fetchUser();
  }, [location, login, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loading variant="spinner" size="lg" color="blue" text="Authenticating..." />
    </div>
  );
}

export default AuthCallback;