// frontend/src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import SearchResults from './pages/SearchResults';
import SearchInput from './pages/SearchInput';
import ProfilePage from './pages/ProfilePage';
import AuthCallback from './components/Auth/AuthCallback';
import ProtectedLayout from './components/Auth/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import BadgeVerificationPage from './pages/BadgeVerificationPage';
import ChatPage from './pages/ChatPage';
import NotificationPage from './pages/NotificationPage';

// Helper to determine if footer should be hidden
const useHideFooterOn = (paths) => {
  const location = useLocation();
  return paths.includes(location.pathname);
};

// Helper to determine if navbar should be hidden
const useHideNavbarOn = (paths) => {
  const location = useLocation();
  return paths.includes(location.pathname);
};

const App = () => {
  // Add paths where footer should NOT be shown
  const hideFooter = useHideFooterOn(['/chat', '/search-input']);
  // Add paths where navbar should NOT be shown
  const hideNavbar = useHideNavbarOn(['/search-input']);

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/search-input" element={<SearchInput />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/badge-verification" element={<BadgeVerificationPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Routes>

      {/* Conditionally render Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;