// frontend/src/pages/ProfileEdit.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupProfile } from '../../src/services/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import toast from 'react-hot-toast';

// Icons
import { FaPlus, FaImage, FaUser } from 'react-icons/fa';
import { BiLockAlt } from 'react-icons/bi';

// List of Nigerian states
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const ProfileEdit = ({ setActiveTab }) => {
  const { user, login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    skills: [],
    whatsapp: '',
    phone: '',
    instagram_handle: '',
    x_handle: '',
    linkedin_handle: '',
    portfolio_link: '',
    location_state: '',
    physical_address: '',
    cac_number: '',
    profile_image: null,
    cac_certificate: null,
    portfolio_images: [],        // New files to upload
    portfolio_image_urls: [],     // Existing URLs from DB
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Populate form with existing user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        skills: user.skills || [],
        whatsapp: user.whatsapp || '',
        phone: user.phone || '',
        instagram_handle: user.instagram_handle || '',
        x_handle: user.x_handle || '',
        linkedin_handle: user.linkedin_handle || '',
        portfolio_link: user.portfolio_link || '',
        location_state: user.location_state || '',
        physical_address: user.physical_address || '',
        cac_number: user.cac_number || '',
        portfolio_image_urls: user.portfolio_images || [],
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    const skills = value
      .split(/,|\|\|/)
      .map(skill => skill.trim())
      .filter(skill => skill);
    setFormData({ ...formData, skills });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'portfolio_images') {
      const fileArray = Array.from(files);
      const maxFiles = user?.verification_status === 'Approved' ? 15 : 3;
      const totalExisting = formData.portfolio_image_urls.length;
      const totalCurrent = totalExisting + formData.portfolio_images.length;

      if (fileArray.length > (maxFiles - totalCurrent)) {
        toast.error(`You can only upload up to ${maxFiles} images`);
        return;
      }

      const validFiles = fileArray.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });

      setFormData(prev => ({
        ...prev,
        portfolio_images: [...prev.portfolio_images, ...validFiles]
      }));
    } else {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const removePortfolioImage = (index) => {
    setFormData({
      ...formData,
      portfolio_images: formData.portfolio_images.filter((_, i) => i !== index),
    });
  };

  const removeProfileImage = () => {
    setFormData({ ...formData, profile_image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const uploadFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(item => uploadFormData.append(key, item));
      } else if (formData[key]) {
        uploadFormData.append(key, formData[key]);
      }
    });

    try {
      const result = await setupProfile(uploadFormData);
      const { message, user: updatedUser } = result;
      login(token, updatedUser);
      setSuccess(message);

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    navigate('/signin');
    return null;
  }

  const maxPortfolio = user?.verification_status === 'Approved' ? 15 : 3;
  const totalExisting = formData.portfolio_image_urls.length;
  const totalNew = formData.portfolio_images.length;
  const totalUploaded = totalExisting + totalNew;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Your Profile</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture (Circular with +) */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
          <div className="relative inline-block">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-sm cursor-pointer hover:shadow"
              onClick={() => document.getElementById('profile-upload').click()}
            >
              {formData.profile_image ? (
                <img
                  src={URL.createObjectURL(formData.profile_image)}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Current Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <FaUser className="text-gray-400 text-3xl" />
                </div>
              )}
            </div>
            <div
              className="absolute bottom-0 right-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600"
              onClick={() => document.getElementById('profile-upload').click()}
            >
              <FaPlus size={12} />
            </div>
          </div>
          <input
            id="profile-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            name="profile_image"
            className="hidden"
          />
          {formData.profile_image && (
            <button
              type="button"
              onClick={removeProfileImage}
              className="text-sm text-red-600 hover:underline mt-2"
            >
              Remove
            </button>
          )}
        </div>

        {/* Portfolio Upload Grid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Portfolio Images (max 5MB each)</label>
          <p className="text-xs text-gray-500 mb-2">
            {user?.verification_status === 'Approved'
              ? 'You can upload up to 15 images'
              : 'You can upload up to 3 images. Get verified to upload more.'}
          </p>

          <div className="grid grid-cols-4 gap-3">
  {/* Show existing portfolio images */}
  {formData.portfolio_image_urls.map((url, index) => (
    <div key={`existing-${index}`} className="relative group">
      <img
        src={url}
        alt={`Portfolio ${index}`}
        className="w-full h-20 object-cover rounded border-2 border-blue-400"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        Saved
      </div>
    </div>
  ))}

  {/* Show newly selected images to upload */}
  {formData.portfolio_images.map((file, index) => (
    <div key={`new-${index}`} className="relative group">
      <img
        src={URL.createObjectURL(file)}
        alt={`New ${index}`}
        className="w-full h-20 object-cover rounded border-2 border-green-400"
      />
      <button
        type="button"
        onClick={() => removePortfolioImage(index)}
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  ))}

  {/* Show upload slots for remaining capacity */}
  {Array.from({ length: maxPortfolio - totalUploaded }).map((_, index) => (
    <label
      key={`upload-slot-${index}`}
      className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer"
    >
      <FaImage className="text-gray-400" size={24} />
    </label>
  ))}

  {/* 4th Box: Verification Prompt (Only after 3 images, if not verified) */}
  {user?.verification_status !== 'Approved' &&
    totalUploaded >= 3 && (
      <div
        className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded bg-gray-50 cursor-pointer hover:bg-gray-100 group"
        onClick={() => {
          toast(
            <div>
              <p className="font-medium">Want to upload more images?</p>
              <p className="text-sm text-gray-600 mt-1">
                Get verified to upload up to 15 portfolio images and unlock premium features.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.dismiss();
                  setActiveTab('verification');
                  navigate('/dashboard');
                }}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Go to Verification
              </button>
            </div>,
            {
              duration: 10000,
              position: 'top-center',
            }
          );
        }}
      >
        <BiLockAlt className="text-gray-400 group-hover:text-blue-500 transition" size={24} />
        <span className="text-xs text-gray-500 mt-1">Get Verified</span>
      </div>
    )}
</div>

{/* Hidden file input */}
<input
  id="portfolio-upload"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  multiple
  name="portfolio_images"
  onChange={handleFileChange}
  className="hidden"
/>

          <p className="text-xs text-gray-500 mt-2">
            {totalUploaded}/{maxPortfolio} images
          </p>
        </div>

        {/* Rest of form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills (separate with comma or ||)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Fashion Designer, Makeup Artist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              name="location_state"
              value={formData.location_state}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select your state</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Physical Office Address (Optional)</label>
            <input
              type="text"
              name="physical_address"
              value={formData.physical_address}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 123 Main Street, Ikeja"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2348123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +2348123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Handle</label>
            <input
              type="text"
              name="instagram_handle"
              value={formData.instagram_handle}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., yourhandle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">X (Twitter) Handle</label>
            <input
              type="text"
              name="x_handle"
              value={formData.x_handle}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., @yourxhandle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin_handle"
              value={formData.linkedin_handle}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourname"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Portfolio or Website</label>
            <input
              type="url"
              name="portfolio_link"
              value={formData.portfolio_link}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CAC Number</label>
            <input
              type="text"
              name="cac_number"
              value={formData.cac_number}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., RC1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CAC Certificate (PDF/Image)</label>
            <input
              type="file"
              name="cac_certificate"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 font-semibold rounded-md transition-all duration-300 
            flex items-center justify-center
            ${loading ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;