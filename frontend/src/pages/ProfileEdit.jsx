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
    experience_pitch: '',
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

  const [newSkill, setNewSkill] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Populate form with existing user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        skills: (user.skills || []).map(skill => capitalizeWords(skill)),
        experience_pitch: user.experience_pitch || '',
        whatsapp: user.whatsapp || '',
        phone: user.phone || '',
        instagram_handle: user.instagram_handle || '',
        x_handle: user.x_handle || '',
        linkedin_handle: user.linkedin_handle || '',
        portfolio_link: user.portfolio_link || '',
        location_state: user.location_state || '',
        physical_address: user.physical_address || '',
        cac_number: user.cac_number || '',
        portfolio_image_urls: user.portfolio_images?.map(img => img.url) || [],
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to capitalize first letter and handle sentence capitalization
  const handleExperienceChange = (e) => {
    const { value } = e.target;

    // Capitalize first letter of the entire text
    let capitalizedValue = value;

    if (value.length > 0) {
      capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Capitalize first letter after sentence endings (. ! ?)
    capitalizedValue = capitalizedValue.replace(/([.!?]\s*)([a-z])/g, (match, punctuation, letter) => {
      return punctuation + letter.toUpperCase();
    });

    setFormData({ ...formData, experience_pitch: capitalizedValue });
  };



  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    const capitalizedSkill = capitalizeWords(trimmedSkill);
    
    if (trimmedSkill && !formData.skills.includes(capitalizedSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, capitalizedSkill]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'portfolio_images') {
      const fileArray = Array.from(files);
      const maxFiles = user?.verification_status === 'Approved' ? 10 : 3;
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
      if (key === 'skills') {
        // Send skills as comma-separated string to match backend expectation
        if (formData.skills.length > 0) {
          uploadFormData.append('skills', formData.skills.join(', '));
        }
      } else if (Array.isArray(formData[key])) {
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

  const maxPortfolio = user?.verification_status === 'Approved' ? 10 : 3;
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
              ? 'You can upload up to 10 images'
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
    <div
      key={`upload-slot-${index}`}
      className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer"
      onClick={() => document.getElementById('portfolio-upload').click()}
    >
      <FaImage className="text-gray-400" size={24} />
    </div>
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
                Get verified to upload up to 10 portfolio images and unlock premium features.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            
            {/* Display existing skills as tags */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add new skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a skill (e.g., Fashion Designer)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
              >
                <FaPlus size={12} />
                Add
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Press Enter or click Add to add a skill. Click the × on any skill to remove it.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              About Your Experience & Pitch
            </label>
            <textarea
              name="experience_pitch"
              value={formData.experience_pitch}
              onChange={handleExperienceChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell potential clients about your experience, expertise, and what makes you unique. Share your story, achievements, and why they should choose you. (First letter will be automatically capitalized)"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is your chance to pitch yourself and showcase your experience to potential clients. The first letter of each sentence will be automatically capitalized.
            </p>
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
            <label className="block text-sm font-medium text-gray-700">
              CAC Number
              <span className="text-xs text-gray-500 ml-2">
                (Corporate Affairs Commission - Business Registration Number)
              </span>
            </label>
            {user?.verification_status === 'Approved' || user?.isVerifiedBadge ? (
              <input
                type="text"
                name="cac_number"
                value={formData.cac_number}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., RC1234567"
              />
            ) : (
              <div className="mt-1 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      CAC Number Requires Verification
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p className="mb-2">
                        <strong>CAC</strong> stands for <strong>Corporate Affairs Commission</strong> - Nigeria's official business registration body.
                      </p>
                      <p className="mb-2">
                        Your CAC number is your official business registration number (e.g., RC1234567).
                      </p>
                      <p>
                        To add your CAC number, you need to be verified first. Go to Dashboard → Verification tab.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CAC Certificate (PDF/Image)
              <span className="text-xs text-gray-500 ml-2">
                (Upload your official business registration certificate)
              </span>
            </label>
            {user?.verification_status === 'Approved' || user?.isVerifiedBadge ? (
              <input
                type="file"
                name="cac_certificate"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            ) : (
              <div className="mt-1 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      CAC Certificate Upload Requires Verification
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p className="mb-2">
                        <strong>CAC Certificate</strong> is your official business registration document from the Corporate Affairs Commission.
                      </p>
                      <p className="mb-2">
                        To upload your CAC certificate, you need to be verified first.
                      </p>
                      <p>
                        Go to the Dashboard → Verification tab to get verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 font-semibold rounded-lg transition-all duration-300 
            flex items-center justify-center text-white
            ${loading 
              ? 'bg-blue-500 cursor-not-allowed opacity-75' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800'
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Saving Profile...
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