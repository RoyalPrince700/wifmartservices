// frontend/src/components/ChatWindow.jsx
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessages, sendMessage, markMessagesAsRead } from '../services/api'; // ✅ Add markMessagesAsRead
import { getSocket } from '../services/socket';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';

const ChatWindow = ({ otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Create unique chat room ID
  const getChatRoomId = (user1Id, user2Id) => {
    return [user1Id, user2Id].sort().join('-');
  };

  // Setup chat listeners (reusable function)
  const setupChatListeners = (socket, chatRoomId, handleNewMessage) => {
    if (!socket || !chatRoomId) return () => {};

    // Join the chat room
    socket.emit('join-chat', chatRoomId);

    const handleReconnect = () => {
      console.log('Socket reconnected, rejoining chat room:', chatRoomId);
      socket.emit('join-chat', chatRoomId);
    };

    socket.on('new-message', handleNewMessage);
    socket.on('connect', handleReconnect);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('connect', handleReconnect);
      socket.emit('leave-chat', chatRoomId);
    };
  };

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages(otherUser._id);
      setMessages(data);

      // Mark messages as read after loading
      await markMessagesAsRead(otherUser._id);
    } catch (err) {
      console.error('Failed to load or mark messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [otherUser._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for real-time incoming messages and join chat room
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const socket = getSocket();
    if (!socket) {
      console.warn('Socket not available for chat - will retry');
      // Retry after a short delay
      const retryTimer = setTimeout(() => {
        const retrySocket = getSocket();
        if (retrySocket && retrySocket.connected) {
          setupChatListeners(retrySocket, chatRoomId, handleNewMessage);
        }
      }, 2000);

      return () => clearTimeout(retryTimer);
    }

    // Check if socket is connected
    if (!socket.connected) {
      console.log('Socket not connected, attempting to reconnect...');
      // The socket should reconnect automatically due to the AuthContext setup
      return;
    }

    const chatRoomId = getChatRoomId(currentUser._id, otherUser._id);
    console.log('Joining chat room:', chatRoomId);

    const handleNewMessage = (msg) => {
      console.log('Received new message:', msg);
      if ([msg.senderId._id, msg.receiverId._id].includes(otherUser._id)) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const cleanup = setupChatListeners(socket, chatRoomId, handleNewMessage);
    return () => {
      cleanup();
      console.log('Left chat room:', chatRoomId);
    };
  }, [otherUser._id, currentUser]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMsg = await sendMessage(otherUser._id, newMessage);

      // Emit real-time message to other user
      const socket = getSocket();
      if (socket && socket.connected) {
        const chatRoomId = getChatRoomId(currentUser._id, otherUser._id);
        console.log('Sending message via socket:', {
          chatId: chatRoomId,
          message: sentMsg.message,
          senderId: sentMsg.senderId._id || sentMsg.senderId,
          receiverId: sentMsg.receiverId._id || sentMsg.receiverId,
        });

        socket.emit('send-message', {
          chatId: chatRoomId,
          message: sentMsg.message,
          senderId: sentMsg.senderId._id || sentMsg.senderId,
          receiverId: sentMsg.receiverId._id || sentMsg.receiverId,
          timestamp: sentMsg.timestamp,
        });
      } else {
        console.error('Socket not connected for sending message');
      }

      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Could not send message. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loading variant="spinner" size="md" color="blue" text="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId._id === otherUser._id ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId._id === otherUser._id
                    ? 'bg-white text-gray-800 shadow'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-full px-6 hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;