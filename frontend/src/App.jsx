// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import SearchResults from './pages/SearchResults';
import ProfilePage from './pages/ProfilePage';
import AuthCallback from './components/Auth/AuthCallback';
import ProtectedLayout from './components/Auth/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import BadgeVerificationPage from './pages/BadgeVerificationPage';
import ChatPage from './pages/ChatPage';
import NotificationPage from './pages/NotificationPage';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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
      <Footer />
    </div>
  );
};

export default App;