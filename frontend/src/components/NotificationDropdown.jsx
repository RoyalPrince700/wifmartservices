// frontend/src/components/NotificationDropdown.jsx
import { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { getNotifications, markAsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';

const NotificationDropdown = ({ isOpen, onClose, parentRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleNotificationClick = async (notificationOrGroup) => {
    const idsToMark = Array.isArray(notificationOrGroup.ids)
      ? notificationOrGroup.ids
      : [notificationOrGroup._id];

    try {
      // Sequentially mark to reuse existing endpoint
      for (const id of idsToMark) {
        const target = notifications.find((n) => n._id === id);
        if (target && !target.read) {
          await markAsRead(id);
        }
      }
      setNotifications((prev) =>
        prev.map((n) => (idsToMark.includes(n._id) ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read');
    }

    // Navigate based on notification type
    const notificationType = notificationOrGroup.type === 'message_group' 
      ? 'message' 
      : notificationOrGroup.type;

    switch (notificationType) {
      case 'message':
        navigate('/chat');
        break;
      case 'hire_request':
        navigate('/dashboard?tab=clients');
        break;
      case 'hire_accepted':
        navigate('/dashboard?tab=providers');
        break;
      case 'verification_approved':
        navigate('/dashboard?tab=verification');
        break;
      default:
        // For other notification types, stay on current page
        break;
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
        fromUser: notificationData.fromUser || undefined,
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

  // Group notifications: messages grouped by fromUser, others as-is
  const grouped = (() => {
    const groups = [];
    const messageGroupsBySender = new Map();

    for (const n of notifications) {
      if (n.type === 'message' && n.fromUser?._id) {
        const key = n.fromUser._id;
        if (!messageGroupsBySender.has(key)) {
          messageGroupsBySender.set(key, {
            _id: `group_${key}`,
            type: 'message_group',
            fromUser: n.fromUser,
            latestMessage: n.message,
            createdAt: n.createdAt,
            count: 0,
            anyUnread: false,
            ids: [],
          });
        }
        const g = messageGroupsBySender.get(key);
        g.count += 1;
        g.anyUnread = g.anyUnread || !n.read;
        g.ids.push(n._id);
        // Keep latest timestamp/message at top
        if (new Date(n.createdAt) > new Date(g.createdAt)) {
          g.createdAt = n.createdAt;
          g.latestMessage = n.message;
        }
      } else {
        groups.push(n);
      }
    }

    // Merge message groups
    groups.push(...Array.from(messageGroupsBySender.values()));

    // Sort by createdAt desc
    groups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return groups;
  })();

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
        ) : grouped.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No notifications yet.</p>
        ) : (
          <ul>
            {grouped.slice(0, 10).map((notif) => (
              <li key={notif._id}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition flex items-start gap-3 ${
                    notif.type === 'message_group'
                      ? (notif.anyUnread ? 'bg-blue-50 font-medium' : 'bg-white')
                      : (notif.read ? 'bg-white' : 'bg-blue-50 font-medium')
                  }`}
                >
                  <div
                    className={`p-2 rounded-full text-sm ${
                      notif.type === 'message_group'
                        ? (notif.anyUnread ? 'bg-blue-600' : 'bg-gray-200')
                        : (notif.read ? 'bg-gray-200' : 'bg-blue-600')
                    }`}
                  >
                    {notif.type === 'message' || notif.type === 'message_group'
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
                    {notif.type === 'message_group' ? (
                      <p className="text-sm text-gray-800 leading-tight truncate">
                        {notif.fromUser?.name ? `${notif.fromUser.name}` : 'Messages'}
                        {` · ${notif.count} message${notif.count > 1 ? 's' : ''}`}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-800 leading-tight truncate">{notif.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {notif.type === 'message_group' && notif.anyUnread && (
                    <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 self-center">
                      {notif.count}
                    </span>
                  )}
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