// frontend/src/components/Navbar.jsx
import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiMenu,
  HiX,
  HiHome,
  HiSearch,
  HiViewGrid,
  HiLogout,
  HiUser,
  HiBell,
} from 'react-icons/hi';
import { AuthContext } from '../contexts/AuthContext';
import { getUnreadCount } from '../services/api';
import { getSocket } from '../services/socket';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token, logout, loading } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setShowNotifications(false);
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
    }
  }, [token]);

  // Real-time unread count updates
  useEffect(() => {
    if (!token) return;

    const socket = getSocket();
    if (!socket) {
      const retryTimer = setTimeout(() => {
        const retrySocket = getSocket();
        if (retrySocket?.connected) {
          setupSocketListeners(retrySocket);
        }
      }, 2000);
      return () => clearTimeout(retryTimer);
    }

    const cleanup = setupSocketListeners(socket);
    return cleanup;
  }, [token]);

  const setupSocketListeners = (socket) => {
    const handleNewNotification = () => {
      fetchUnreadCount();
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const navItems = [
    { path: '/', label: 'Home', icon: <HiHome className="h-5 w-5" /> },
    { path: '/search', label: 'Find Providers', icon: <HiSearch className="h-5 w-5" /> },
  ];

  if (token) {
    navItems.push({
      path: '/dashboard',
      label: 'Dashboard',
      icon: <HiViewGrid className="h-5 w-5" />,
    });
    if (user?.role === 'admin') {
      navItems.push({
        path: '/admin',
        label: 'Admin Panel',
        icon: <HiUser className="h-5 w-5" />,
      });
    }
  }

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Logo + Hamburger */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <div className="md:hidden mr-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                </button>
              </div>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Wifmart</span>
              </Link>
            </div>

            {/* Middle: Navigation Links + Notification Bell */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition"
                >
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Link>
              ))}

              {/* Notification Bell */}
              {/* Desktop: Direct Link to Notifications */}
{token && (
  <div className="hidden md:flex" ref={bellRef}>
    <Link
      to="/notifications"
      className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition relative"
      aria-label="Notifications"
    >
      <HiBell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  </div>
)}

{/* Mobile: Notification Bell with Dropdown */}
{token && (
  <div className="md:hidden flex items-center">
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 text-gray-600 hover:text-blue-600 relative"
        aria-label="Notifications"
      >
        <HiBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        parentRef={bellRef}
      />
    </div>
  </div>
)}
            </div>

            {/* Right: Auth Button (Desktop) */}
            <div className="hidden md:flex items-center">
              {loading ? (
                <span className="text-sm text-gray-500">Loading...</span>
              ) : token ? (
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center transition"
                >
                  <HiLogout className="h-4 w-4 mr-1" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile: Notification Bell */}
            {token && (
              <div className="md:hidden flex items-center">
                <div className="relative" ref={bellRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-600 hover:text-blue-600 relative"
                    aria-label="Notifications"
                  >
                    <HiBell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    parentRef={bellRef}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && !loading && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-blue-600 text-base font-medium flex items-center transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
              {token && (
                <Link
                  to="/profile/edit"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-blue-600 text-base font-medium flex items-center transition"
                  onClick={() => setIsOpen(false)}
                >
                  <HiUser className="h-5 w-5" />
                  <span className="ml-3">Edit Profile</span>
                </Link>
              )}
            </div>

            {token && (
              <div className="pt-2 pb-3 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent hover:border-blue-600 text-base font-medium flex items-center transition"
                >
                  <HiLogout className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;