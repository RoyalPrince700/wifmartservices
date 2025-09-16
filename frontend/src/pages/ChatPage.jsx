import { useState, useEffect, useRef, useContext } from 'react';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { AuthContext } from '../contexts/AuthContext';
import { HiCheckCircle } from 'react-icons/hi';
import Loading from '../components/Loading';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  // Create unique chat room ID
  const getChatRoomId = (user1Id, user2Id) => {
    return [user1Id, user2Id].sort().join('_');
  };

  // Setup real-time listeners
  const setupChatPageListeners = (socket, selectedChat, handleNewMessage) => {
    if (!socket || !selectedChat || !currentUser) return () => {};

    const chatRoomId = getChatRoomId(currentUser._id, selectedChat._id);

    socket.emit('join-chat', chatRoomId);

    const handleReconnect = () => {
      console.log('Socket reconnected, rejoining chat room:', chatRoomId);
      socket.emit('join-chat', chatRoomId);
    };

    socket.on('new-message', handleNewMessage);
    socket.on('message-delivered', ({ chatId: incomingChatId, messageId, receiverId }) => {
      if (incomingChatId !== chatRoomId) return;
      setMessages((prev) => {
        const updated = [...prev];
        if (messageId) {
          const idx = updated.findIndex((m) => m._id === messageId);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], delivered: true };
            return updated;
          }
        }
        for (let i = updated.length - 1; i >= 0; i--) {
          const m = updated[i];
          const senderId = m.senderId?._id || m.senderId;
          const recId = m.receiverId?._id || m.receiverId;
          if (senderId === currentUser._id && recId === receiverId && !m.delivered) {
            updated[i] = { ...m, delivered: true };
            break;
          }
        }
        return updated;
      });
    });
    socket.on('message-read', ({ chatId, readerId }) => {
      if (chatId !== chatRoomId) return;
      // Mark messages sent by current user to this reader as read
      setMessages((prev) =>
        prev.map((m) => {
          const receiverId = m.receiverId?._id || m.receiverId;
          if (!m.read && receiverId === readerId) {
            return { ...m, read: true };
          }
          return m;
        })
      );
      // Refresh conversations list to update unread badges
      loadConversations();
    });
    socket.on('connect', handleReconnect);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-delivered');
      socket.off('message-read');
      socket.off('connect', handleReconnect);
      socket.emit('leave-chat', chatRoomId);
    };
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check if user is verified (same logic as ProfilePage)
  const isUserVerified = (user) => {
    return user?.isVerifiedBadge || user?.isVerified || user?.verification_status?.toLowerCase() === "approved";
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      setConversationsLoading(true);
      setError('');
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setConversationsLoading(false);
    }
  };

  // Load messages for selected user
  const loadMessages = async (conv) => {
    setLoading(true);
    try {
      const data = await getMessages(conv.otherUser._id);
      const normalized = data.map((m) => {
        const senderId = m.senderId?._id || m.senderId;
        const isOutgoing = currentUser && senderId === currentUser._id;
        return { ...m, delivered: isOutgoing ? true : m.delivered };
      });
      setMessages(normalized);
      await markMessagesAsRead(conv.otherUser._id);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle chat selection
  const handleSelectChat = (conv) => {
    setSelectedChat(conv.otherUser);
    loadMessages(conv);
  };

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (isSending || !newMessage.trim() || !selectedChat) return;

    try {
      setIsSending(true);
      await sendMessage(selectedChat._id, newMessage);
      
      // Don't add message to state here - let the socket listener handle it
      // This prevents double messages
      setNewMessage('');
      // Focus input after send
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle new messages from socket
  const handleNewMessage = (msg) => {
    console.log('New message received:', msg);
    if (!selectedChat) return;
    
    if ([msg.senderId._id, msg.receiverId._id].includes(selectedChat._id)) {
      setMessages((prev) => {
        // More robust duplicate prevention
        if (prev.some((m) => m._id === msg._id)) {
          console.log('Duplicate message detected, skipping:', msg._id);
          return prev;
        }
        return [...prev, msg];
      });
    }
    loadConversations(); // Update last message in list
  };

  // Real-time message handling
  useEffect(() => {
    if (!currentUser || !selectedChat) return;

    const socket = getSocket();
    if (!socket) {
      const retryTimer = setTimeout(() => {
        const retrySocket = getSocket();
        if (retrySocket && retrySocket.connected) {
          setupChatPageListeners(retrySocket, selectedChat, handleNewMessage);
        }
      }, 2000);
      return () => clearTimeout(retryTimer);
    }

    if (!socket.connected) {
      console.log('Socket not connected yet...');
      return;
    }

    const cleanup = setupChatPageListeners(socket, selectedChat, handleNewMessage);
    return () => cleanup();
  }, [selectedChat, currentUser]);

  // Focus input when chat is selected
  useEffect(() => {
    if (selectedChat && !loading) {
      inputRef.current?.focus();
    }
  }, [selectedChat, loading]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row bg-white font-sans">
      {/* Conversations Sidebar */}
      <div
        className={`${
          selectedChat ? 'hidden md:flex' : 'flex'
        } flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 h-full`}
      >
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 p-1 md:hidden"
              title="Go back"
            >
              ←
            </button>
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {conversationsLoading ? (
            <div className="p-4 text-center">
              <Loading variant="spinner" size="md" color="blue" text="Loading conversations..." />
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 mb-2 text-sm">{error}</p>
              <button
                onClick={loadConversations}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Try again
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <p className="p-4 text-gray-500 text-center text-sm">
              {searchTerm ? 'No matches' : 'No conversations yet'}
            </p>
          ) : (
            filteredConversations.map((conv, index) => {
              const isActive = selectedChat?._id === conv.otherUser._id;
              return (
                <div
                  key={index}
                  onClick={() => handleSelectChat(conv)}
                  className={`p-3 sm:p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                    isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'bg-white'
                  }`}
                >
                  <img
                    src={conv.otherUser.profile_image || 'https://via.placeholder.com/40'}
                    alt={conv.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate flex items-center">
                      {conv.otherUser.name}
                      {isUserVerified(conv.otherUser) && (
                        <span className="flex-shrink-0 ml-1 bg-blue-500 text-white rounded-full p-0.5 shadow-sm flex items-center justify-center">
                          <HiCheckCircle className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </h3>
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        conv.unread ? 'font-medium text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(conv.timestamp), { addSuffix: true })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          selectedChat ? 'flex' : 'hidden'
        } flex-col flex-1 bg-gray-50 h-full min-h-0`}
      >
        {selectedChat && (
          <div className="flex flex-col h-full min-h-0">
            {/* Chat Header */}
            <div className="shrink-0 p-3 sm:p-4 bg-white border-b flex items-center gap-3 shadow-sm">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden text-gray-600 hover:text-gray-900"
                aria-label="Back to conversations"
              >
                ←
              </button>
              <img
                src={selectedChat.profile_image || 'https://via.placeholder.com/40'}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800 text-sm sm:text-base flex items-center">
                  {selectedChat.name}
                  {isUserVerified(selectedChat) && (
                    <span className="flex-shrink-0 ml-1 bg-blue-500 text-white rounded-full p-0.5 shadow-sm flex items-center justify-center">
                      <HiCheckCircle className="h-2.5 w-2.5" />
                    </span>
                  )}
                </h3>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-3 min-h-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loading variant="spinner" size="md" color="blue" text="Loading messages..." />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">Start the conversation</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderId._id === selectedChat._id ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-lg shadow-sm text-sm ${
                        msg.senderId._id === selectedChat._id
                          ? 'bg-white text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      <div className={`mt-1 flex items-center ${msg.senderId._id === selectedChat._id ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-[10px] opacity-90">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.senderId._id !== selectedChat._id && (
                          <span className="ml-2 text-[10px] opacity-90">
                            {msg.read ? 'Read' : 'Sent'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at Bottom */}
            <form onSubmit={handleSend} className="shrink-0 p-3 sm:p-4 bg-white border-t sticky bottom-0">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  id="chat-input"
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      if (!isSending && newMessage.trim()) {
                        handleSend(e);
                      }
                    }
                  }}
                  placeholder="Type a message... (Ctrl/⌘+Enter to send)"
                  className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className={`bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium ${
                    isSending || !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {isSending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Placeholder when no chat selected (visible only on desktop) */}
      {!selectedChat && (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-500">
          <p className="text-lg">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;