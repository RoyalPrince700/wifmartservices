// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProviderProfile } from '../services/api';
import HireRequestModal from '../components/HireRequestModal';
import { AuthContext } from '../../src/contexts/AuthContext';
import ChatWindow from '../components/ChatWindow';
import { HiCheckCircle } from 'react-icons/hi';
import Loading from '../components/Loading';
import AvatarImage from '../components/AvatarImage';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading
        variant="spinner"
        size="lg"
        color="blue"
        text="Loading profile..."
      />
    </div>
  );
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

  const skills = Array.isArray(provider?.skills)
    ? provider.skills
    : (provider?.skills ? String(provider.skills).split(',').map(s => s.trim()).filter(Boolean) : []);

  const profileUrl = `${window.location.origin}/profile/${id}`;

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      alert('Profile link copied');
    } catch (_) {
      // no-op
    }
  };

  const handleSendMessage = () => {
    if (String(currentUser?._id) === String(provider._id)) {
      navigate("/search");
      return;
    }
    setShowChat(true); // Open chat modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue banner */}
      <div className="h-40 bg-gradient-to-r from-blue-700 to-blue-600" />

      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Profile Card */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-start gap-4">
                <AvatarImage
                  src={provider.profile_image}
                  alt={provider.name}
                  name={provider.name}
                  size="h-24 w-24"
                  className="ring-4 ring-white shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                    {verified && <HiCheckCircle className="h-6 w-6 text-blue-600" />}
                  </div>
                  {provider.location_state && (
                    <p className="text-gray-600 mt-1">📍 {provider.location_state}</p>
                  )}
                </div>
              </div>

              {skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button onClick={handleHireClick} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  💼 Hire
                </button>
                {currentUser && String(currentUser._id) !== String(provider._id) && (
                  <button onClick={handleSendMessage} className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                    💬 Message
                  </button>
                )}
                <button onClick={copyProfileLink} className="px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">
                  🔗 Share
                </button>
              </div>

              {/* Socials / Links */}
              <div className="mt-6 space-y-2">
                {provider.portfolio_link && (
                  <a href={provider.portfolio_link} target="_blank" rel="noopener noreferrer" className="block text-blue-700 hover:underline">
                    🌐 Portfolio Website
                  </a>
                )}
                {provider.instagram_handle && (
                  <a href={`https://instagram.com/${provider.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-blue-700">
                    📸 Instagram @{provider.instagram_handle}
                  </a>
                )}
                {provider.x_handle && (
                  <a href={`https://x.com/${provider.x_handle.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-blue-700">
                    ✖️ X {provider.x_handle}
                  </a>
                )}
                {provider.linkedin_handle && (
                  <a href={provider.linkedin_handle} target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-blue-700">
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* Right: Content */}
          <main className="lg:col-span-8 space-y-6">
            {/* About */}
            {provider.experience_pitch && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">About & Experience</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{provider.experience_pitch}</p>
              </section>
            )}

            {/* Portfolio */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
                {provider.portfolio_link && (
                  <a href={provider.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Visit website</a>
                )}
              </div>
              {provider.portfolio_images?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                  {provider.portfolio_images.map((image, index) => (
                    <img
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No portfolio images available.</p>
              )}
            </section>

            {/* Business */}
            {(provider.cac_number || provider.cac_certificate) && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
                {provider.cac_number && (
                  <p className="text-gray-700 mt-2"><span className="font-medium">CAC Number:</span> {provider.cac_number}</p>
                )}
                {provider.cac_certificate && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">CAC Certificate:</span>{' '}
                    <a href={provider.cac_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                  </p>
                )}
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t p-3 flex gap-3 z-40">
        <button onClick={handleHireClick} className="flex-1 py-3 bg-blue-600 text-white rounded-lg">Hire</button>
        {currentUser && String(currentUser._id) !== String(provider._id) && (
          <button onClick={handleSendMessage} className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-lg">Message</button>
        )}
      </div>

      {/* Hire Modal */}
      {isModalOpen && (
        <HireRequestModal provider={provider} onClose={() => setIsModalOpen(false)} />
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
                <button onClick={() => setShowChat(false)} className="text-gray-500 text-2xl hover:text-gray-700">&times;</button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow otherUser={provider} onClose={() => setShowChat(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;