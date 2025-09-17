// frontend/src/components/Navbar.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiMenu,
  HiX,
  HiHome,
  HiSearch,
  HiViewGrid,
  HiUser,
  HiBell,
  HiArrowRight,
  HiChatAlt,
} from 'react-icons/hi';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import { getUnreadCount } from '../services/api';
import { getSocket } from '../services/socket';
import NotificationDropdown from './NotificationDropdown';
import wifmartLogo from '../assets/wifmart-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token, loading } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();



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

  // Handle mobile search input focus - navigate immediately
  const handleMobileSearchFocus = (e) => {
    if (!hasTyped) {
      setHasTyped(true);
      // Navigate immediately when user clicks on mobile search bar
      navigate(`/search-input`);
    }
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
    { path: '/', label: 'Home', icon: HiHome },
    { path: '/search', label: 'Find Providers', icon: HiSearch },
  ];

  if (token) {
    navItems.push({
      path: '/dashboard',
      label: 'Dashboard',
      icon: HiViewGrid,
    });
    navItems.push({
      path: '/chat',
      label: 'Chat',
      icon: HiChatAlt,
    });
    if (user?.role === 'admin') {
      navItems.push({
        path: '/admin',
        label: 'Admin Panel',
        icon: HiUser,
      });
    }
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-white via-slate-50/95 to-blue-50/90 backdrop-blur-sm shadow-lg border-b border-gray-100/50 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Logo + Hamburger */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <div className="md:hidden mr-3">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="group inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ?
                    <HiX className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" /> :
                    <HiMenu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  }
                </button>
              </div>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <img
                  src={wifmartLogo}
                  alt="Wifmart"
                  className="h-5 w-32 group-hover:scale-105 transition-all duration-300 transform"
                />
              </Link>
            </div>

            {/* Middle: Navigation Links + Notification Bell */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group text-gray-600 hover:text-blue-600 inline-flex items-center px-3 py-2 rounded-lg border-b-2 border-transparent hover:border-blue-600 hover:bg-blue-50/50 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
                >
                  {React.createElement(item.icon, { className: "h-5 w-5 group-hover:scale-110 transition-transform duration-300" })}
                  <span className="ml-2 group-hover:font-semibold">{item.label}</span>
                </Link>
              ))}

              {/* Notification Bell */}
              {/* Desktop: Direct Link to Notifications */}
{token && (
  <div className="hidden md:flex" ref={bellRef}>
    <Link
      to="/notifications"
      className="group text-gray-600 hover:text-blue-600 inline-flex items-center px-3 py-2 rounded-lg border-b-2 border-transparent hover:border-blue-600 hover:bg-blue-50/50 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative"
      aria-label="Notifications"
    >
      <HiBell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  </div>
)}

            </div>

            {/* Right: Auth Button (Desktop) */}
            <div className="hidden md:flex items-center">
              {loading ? (
                <Loading variant="spinner" size="xs" color="blue" className="inline" />
              ) : !token && (
                <Link
                  to="/signin"
                  className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative">Get Started</span>
                  <HiArrowRight className="relative w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                </Link>
              )}
            </div>

            {/* Mobile: Notification Bell or Search Icon */}
            <div className="md:hidden flex items-center">
              {token ? (
                <Link
                  to="/notifications"
                  className="group p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-md relative"
                  aria-label="Notifications"
                >
                  <HiBell className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/search-input"
                  className="group p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  aria-label="Search for services"
                >
                  <HiSearch className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && !loading && (
          <div className="md:hidden bg-gradient-to-b from-white via-slate-50/95 to-blue-50/90 backdrop-blur-sm shadow-xl border-t border-gray-100/50">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group text-gray-600 hover:bg-blue-50/50 hover:text-blue-600 flex items-center pl-3 pr-4 py-3 border-l-4 border-transparent hover:border-blue-600 text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  {React.createElement(item.icon, { className: "h-5 w-5 group-hover:scale-110 transition-transform duration-300" })}
                  <span className="ml-3 group-hover:font-semibold">{item.label}</span>
                </Link>
              ))}
              {token && (
                <Link
                  to="/profile/edit"
                  className="group text-gray-600 hover:bg-blue-50/50 hover:text-blue-600 flex items-center pl-3 pr-4 py-3 border-l-4 border-transparent hover:border-blue-600 text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <HiUser className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="ml-3 group-hover:font-semibold">Edit Profile</span>
                </Link>
              )}

              {!token && (
                <Link
                  to="/signin"
                  className="group text-gray-600 hover:bg-blue-50/50 hover:text-blue-600 flex items-center pl-3 pr-4 py-3 border-l-4 border-transparent hover:border-blue-600 text-base font-medium transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <HiArrowRight className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="ml-3 group-hover:font-semibold">Get Started</span>
                </Link>
              )}
            </div>


          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;