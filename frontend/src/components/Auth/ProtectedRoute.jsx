// src/components/Auth/ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../src/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from '../Loading';

export default function ProtectedLayout() {
  const { user, loading } = useContext(AuthContext);

  // console.log('🔐 ProtectedLayout:', { loading, user: !!user });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading variant="spinner" size="lg" color="blue" text="Loading authentication..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/signin" replace />;

  return <Outlet />; // ✅ This renders the nested route (e.g. Dashboard)
}