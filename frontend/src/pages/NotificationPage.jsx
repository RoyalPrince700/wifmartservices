// frontend/src/pages/NotificationPage.jsx
import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read');
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

    // Navigate based on type
    switch (notification.type) {
      case 'message':
        navigate('/chat');
        break;
      case 'hire_request':
      case 'hire_accepted':
        navigate('/dashboard');
        break;
      case 'verification_approved':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <div className="p-6 text-center">Loading notifications...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow min-h-screen">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <p className="p-6 text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <div className="divide-y">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-5 cursor-pointer hover:bg-gray-50 transition flex items-start gap-4 ${
                notif.read ? 'bg-white' : 'bg-blue-50 font-medium'
              }`}
            >
              <div
                className={`p-3 rounded-full text-lg ${
                  notif.read ? 'bg-gray-200' : 'bg-blue-600'
                }`}
              >
                {(() => {
                  switch (notif.type) {
                    case 'message':
                      return <span className="text-white">💬</span>;
                    case 'hire_request':
                      return <span className="text-white">📩</span>;
                    case 'hire_accepted':
                      return <span className="text-white">🎉</span>;
                    case 'verification_approved':
                      return <span className="text-white">✅</span>;
                    default:
                      return <span className="text-white">🔔</span>;
                  }
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 leading-relaxed">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;