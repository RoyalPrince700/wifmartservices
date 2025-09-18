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
import instagramIcon from '../assets/social-insta.svg';
import linkedinIcon from '../assets/social-linkedin.svg';
import xIcon from '../assets/social-x.svg';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
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

  // Helper function to check if text should be truncated
  const shouldTruncateText = (text, maxLength = 300) => {
    return text && text.length > maxLength;
  };

  // Helper function to get truncated text
  const getTruncatedText = (text, maxLength = 300) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Helper function to shorten URLs for display
  const shortenUrlForDisplay = (url, maxLength = 30) => {
    if (!url) return '';
    if (url.length <= maxLength) return url;

    // For URLs, show domain + shortened path
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const path = urlObj.pathname + urlObj.search + urlObj.hash;

      if (domain.length + path.length <= maxLength) return url;

      // Shorten path if too long
      const availableLength = maxLength - domain.length - 3; // 3 for "..."
      if (availableLength > 5) {
        const shortenedPath = path.length > availableLength ? path.substring(0, availableLength) + '...' : path;
        return `${domain}${shortenedPath}`;
      } else {
        return `${domain}...`;
      }
    } catch {
      // If not a valid URL, just truncate normally
      return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    }
  };

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

    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/signin?redirect=/profile/${id}`);
      return;
    }

    setShowChat(true); // Open chat modal
  };

  const handleImageClick = () => {
    setSelectedPortfolioImage(null);
    setSelectedPortfolioIndex(null);
    setShowImageModal(true);
  };

  const handlePortfolioImageClick = (image, index) => {
    setSelectedPortfolioImage(image);
    setSelectedPortfolioIndex(index);
    setShowImageModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue banner */}
      <div className="h-40 bg-gradient-to-r from-blue-700 to-blue-600 relative">
        {/* Share button in top-right corner */}
        <button
          onClick={copyProfileLink}
          className="absolute top-4 right-4 px-3 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
          title="Share Profile"
        >
          🔗 Share
        </button>
      </div>

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
                  onClick={handleImageClick}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                    {verified && <HiCheckCircle className="h-6 w-6 text-blue-600" />}
                  </div>
                  {provider.location_state && (
                    <p className="text-gray-600 mt-1">📍 {provider.location_state}</p>
                  )}

                  {/* Get Verified Button - Mobile: Show directly under name */}
                  {String(currentUser?._id) === String(provider._id) && !verified && (
                    <div className="lg:hidden mt-3">
                      <button
                        onClick={() => navigate('/dashboard?tab=verification')}
                        className="w-full px-4 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                      >
                        <HiCheckCircle className="h-5 w-5 text-blue-600" />
                        Get Verified
                      </button>
                    </div>
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

              {/* Action Buttons - Responsive Layout */}
              <div className="mt-6 space-y-3">
                {/* Get Verified Button - Desktop: Show in action buttons */}
                {String(currentUser?._id) === String(provider._id) && !verified && (
                  <div className="hidden lg:block">
                    <button
                      onClick={() => navigate('/dashboard?tab=verification')}
                      className="w-full px-4 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                    >
                      <HiCheckCircle className="h-5 w-5 text-blue-600" />
                      Get Verified
                    </button>
                  </div>
                )}

                {/* Desktop: 2 buttons in a row */}
                <div className="hidden lg:flex gap-3">
                  {String(currentUser?._id) === String(provider._id) ? (
                    <button onClick={() => navigate('/profile/edit')} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <button onClick={handleHireClick} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      💼 Hire
                    </button>
                  )}
                  {String(currentUser?._id) !== String(provider._id) && (
                    <button onClick={handleSendMessage} className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      💬 Message
                    </button>
                  )}
                </div>

                {/* Tablet/Mobile: Stack buttons vertically */}
                <div className="lg:hidden space-y-3">
                  {String(currentUser?._id) === String(provider._id) ? (
                    <button onClick={() => navigate('/profile/edit')} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <button onClick={handleHireClick} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      💼 Hire
                    </button>
                  )}
                  {String(currentUser?._id) !== String(provider._id) && (
                    <button onClick={handleSendMessage} className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      💬 Message
                    </button>
                  )}
                </div>
              </div>

              {/* Socials / Links */}
              <div className="mt-6 space-y-2">
                {provider.portfolio_link && (
                  <a href={provider.portfolio_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline">
                    <span className="text-gray-500">🌐</span>
                    {shortenUrlForDisplay(provider.portfolio_link, 25)}
                  </a>
                )}
                {provider.instagram_handle && (
                  <a href={`https://instagram.com/${provider.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-700">
                    <img src={instagramIcon} alt="Instagram" className="w-4 h-4" />
                    Instagram @{shortenUrlForDisplay(provider.instagram_handle, 20)}
                  </a>
                )}
                {provider.x_handle && (
                  <a href={`https://x.com/${provider.x_handle.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-700">
                    <img src={xIcon} alt="X" className="w-4 h-4" />
                    X {shortenUrlForDisplay(provider.x_handle, 20)}
                  </a>
                )}
                {provider.linkedin_handle && (
                  <a href={provider.linkedin_handle} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-700">
                    <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4" />
                    {shortenUrlForDisplay(provider.linkedin_handle, 25)}
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
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {shouldTruncateText(provider.experience_pitch) ? (
                    <>
                      <div className={`overflow-hidden transition-all duration-300 ${!isAboutExpanded ? 'max-h-24' : 'max-h-none'}`}>
                        <p>
                          {isAboutExpanded ? provider.experience_pitch : getTruncatedText(provider.experience_pitch)}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        {isAboutExpanded ? 'View Less' : 'View More'}
                      </button>
                    </>
                  ) : (
                    <p>{provider.experience_pitch}</p>
                  )}
                </div>
              </section>
            )}

            {/* Portfolio */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
                {provider.portfolio_link && (
                  <a href={provider.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">{shortenUrlForDisplay(provider.portfolio_link, 20)}</a>
                )}
              </div>
              {provider.portfolio_images?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                  {provider.portfolio_images.map((image, index) => (
                    <img
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                      loading="lazy"
                      onClick={() => handlePortfolioImageClick(image, index)}
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
        {String(currentUser?._id) === String(provider._id) ? (
          <button onClick={() => navigate('/profile/edit')} className="flex-1 py-3 bg-blue-600 text-white rounded-lg">Edit Profile</button>
        ) : (
          <button onClick={handleHireClick} className="flex-1 py-3 bg-blue-600 text-white rounded-lg">Hire</button>
        )}
        {String(currentUser?._id) !== String(provider._id) && (
          <button onClick={handleSendMessage} className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-lg">Message</button>
        )}
      </div>

      {/* Hire Modal */}
      {isModalOpen && (
        <HireRequestModal provider={provider} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full md:max-w-md h-[85vh] md:h-auto max-h-[90vh] flex flex-col">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{provider.name}</h3>
                <button onClick={() => setShowChat(false)} className="text-gray-500 text-2xl hover:text-gray-700">&times;</button>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => {
                    setShowChat(false);
                    navigate('/chat');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Open Full Chat
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow otherUser={provider} onClose={() => setShowChat(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
            aria-label="Close image modal"
          >
            &times;
          </button>
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPortfolioImage ? (typeof selectedPortfolioImage === 'string' ? selectedPortfolioImage : selectedPortfolioImage.url) : provider.profile_image}
              alt={selectedPortfolioImage ? `Portfolio ${selectedPortfolioIndex + 1}` : `${provider.name}'s profile picture`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;