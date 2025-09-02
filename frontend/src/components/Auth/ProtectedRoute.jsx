// src/components/Auth/ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../src/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedLayout() {
  const { user, loading } = useContext(AuthContext);

  // console.log('🔐 ProtectedLayout:', { loading, user: !!user });

  if (loading) return <div>Loading authentication...</div>;
  if (!user) return <Navigate to="/signin" replace />;

  return <Outlet />; // ✅ This renders the nested route (e.g. Dashboard)
}