// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProviderProfile } from '../services/api';
import HireRequestModal from '../components/HireRequestModal';
import { AuthContext } from '../../src/contexts/AuthContext';
import ChatWindow from '../components/ChatWindow';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProviderProfile(id);
        setProvider(response);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !provider) return <div className="text-center py-10 text-red-500">{error || 'Not found'}</div>;

  const handleHireClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/signin?redirect=/profile/${id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const verified = provider?.isVerifiedBadge || provider?.isVerified || provider?.verification_status?.toLowerCase() === "approved";

  const handleSendMessage = () => {
    if (String(currentUser?._id) === String(provider._id)) {
      navigate("/search");
      return;
    }
    setShowChat(true); // Open chat modal
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={provider.profile_image || 'https://via.placeholder.com/150'}
          alt={provider.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{provider.name}</h1>
          {verified && <span className="ml-2 text-blue-600">✅</span>}
          <p className="text-gray-600">{provider.skills?.join(', ')}</p>
          <p className="text-gray-500">{provider.location_state}</p>
          
          {/* Social Media Links */}
          <div className="mt-4">
            {provider.instagram_handle && (
              <p className="text-gray-600">
                <span className="font-medium">Instagram:</span>{' '}
                <a
                  href={`https://instagram.com/${provider.instagram_handle}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{provider.instagram_handle}
                </a>
              </p>
            )}
            {provider.x_handle && (
              <p className="text-gray-600">
                <span className="font-medium">X:</span>{' '}
                <a
                  href={`https://x.com/${provider.x_handle.replace('@', '')}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {provider.x_handle}
                </a>
              </p>
            )}
            {provider.linkedin_handle && (
              <p className="text-gray-600">
                <span className="font-medium">LinkedIn:</span>{' '}
                <a
                  href={provider.linkedin_handle}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View LinkedIn
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={handleHireClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          💼 Hire {provider.name}
        </button>

        {currentUser && String(currentUser._id) !== String(provider._id) && (
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Send Message
          </button>
        )}

        {provider.whatsapp && (
          <a
            href={`https://wa.me/${provider.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            📱 WhatsApp
          </a>
        )}
      </div>

      {/* Portfolio Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Portfolio</h2>
        {provider.portfolio_link && (
          <p className="text-gray-600">
            <span className="font-medium">Website:</span>{' '}
            <a
              href={provider.portfolio_link}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {provider.portfolio_link}
            </a>
          </p>
        )}
        {provider.portfolio_images?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {provider.portfolio_images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Portfolio item ${index + 1}`}
                className="w-full h-48 object-cover rounded-md border border-gray-200"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No portfolio images available.</p>
        )}
      </div>

      {/* Additional Info */}
      {provider.cac_number && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Business Details</h2>
          <p className="text-gray-600">
            <span className="font-medium">CAC Number:</span> {provider.cac_number}
          </p>
          {provider.cac_certificate && (
            <p className="text-gray-600">
              <span className="font-medium">CAC Certificate:</span>{' '}
              <a
                href={provider.cac_certificate}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificate
              </a>
            </p>
          )}
        </div>
      )}
      
      {/* Hire Modal */}
      {isModalOpen && (
        <HireRequestModal
          provider={provider}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-96 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Chat with {provider.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowChat(false);
                    navigate('/chat');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Open Full Chat
                </button>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 text-2xl hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                otherUser={provider}
                onClose={() => setShowChat(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;