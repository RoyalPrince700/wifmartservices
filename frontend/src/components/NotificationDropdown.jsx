// frontend/src/components/NotificationDropdown.jsx
import { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { getNotifications, markAsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';

const NotificationDropdown = ({ isOpen, onClose, parentRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error('Failed to mark as read');
      }
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Real-time notifications
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) {
      const retryTimer = setTimeout(() => {
        const retrySocket = getSocket();
        if (retrySocket?.connected) setupNotificationListeners(retrySocket);
      }, 2000);
      return () => clearTimeout(retryTimer);
    }

    if (socket.connected) {
      return setupNotificationListeners(socket);
    }
  }, [user]);

  const setupNotificationListeners = (socket) => {
    const handleNewNotification = (notificationData) => {
      const newNotification = {
        _id: notificationData.id || Date.now().toString(),
        type: notificationData.type,
        message: notificationData.message,
        createdAt: notificationData.timestamp || new Date(),
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
    };

    socket.on('new-notification', handleNewNotification);
    return () => socket.off('new-notification', handleNewNotification);
  };

  // ✅ Use useLayoutEffect to position after render
  useLayoutEffect(() => {
    if (!isOpen || !parentRef?.current || !dropdownRef.current) return;

    const bellRect = parentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 640;
    const dropdown = dropdownRef.current;

    if (isMobile) {
      Object.assign(dropdown.style, {
        position: 'fixed',
        left: '0',
        right: '0',
        top: '64px',
        width: '100%',
        maxWidth: 'none',
        maxHeight: 'calc(100vh - 64px)',
        borderRadius: '0.375rem 0.375rem 0 0',
      });
    } else {
      const dropdownWidth = 320;
      const dropdownHeight = Math.min(dropdown.scrollHeight, 384);

      let leftPosition = bellRect.right - dropdownWidth;
      if (leftPosition < 10) leftPosition = 10;
      if (leftPosition + dropdownWidth > viewportWidth - 10) {
        leftPosition = viewportWidth - dropdownWidth - 10;
      }

      let topPosition;
      const spaceBelow = viewportHeight - bellRect.bottom;
      if (spaceBelow >= dropdownHeight + 8) {
        topPosition = bellRect.bottom + 8;
      } else if (bellRect.top >= dropdownHeight + 8) {
        topPosition = bellRect.top - dropdownHeight - 8;
      } else {
        topPosition = bellRect.bottom + 8;
      }

      Object.assign(dropdown.style, {
        position: 'absolute',
        left: `${leftPosition}px`,
        top: `${topPosition}px`,
        width: `${dropdownWidth}px`,
        maxHeight: '384px',
        borderRadius: '0.5rem',
      });
    }
  }, [isOpen, parentRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="z-[60] bg-white border rounded-lg shadow-xl max-h-96 overflow-hidden"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          &times;
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-80">
        {loading ? (
          <div className="p-4 text-center">
            <Loading variant="spinner" size="sm" color="blue" text="Loading notifications..." />
          </div>
        ) : notifications.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No notifications yet.</p>
        ) : (
          <ul>
            {notifications.slice(0, 10).map((notif) => (
              <li key={notif._id}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition flex items-start gap-3 ${
                    notif.read ? 'bg-white' : 'bg-blue-50 font-medium'
                  }`}
                >
                  <div
                    className={`p-2 rounded-full text-sm ${
                      notif.read ? 'bg-gray-200' : 'bg-blue-600'
                    }`}
                  >
                    {notif.type === 'message'
                      ? '💬'
                      : notif.type === 'hire_request'
                      ? '📩'
                      : notif.type === 'hire_accepted'
                      ? '🎉'
                      : notif.type === 'verification_approved'
                      ? '✅'
                      : '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-tight truncate">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-2 bg-gray-50">
        <Link
          to="/notifications"
          className="block text-center text-blue-600 text-sm font-medium hover:underline py-2"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;