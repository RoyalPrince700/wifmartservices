import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

export default function ProfileUpdate() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [cacUpload, setCacUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    skills: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    portfolioLink: '',
    profileImage: '',
    businessName: '',
    businessAddress: '',
    cacNumber: '',
    isBusinessRegistered: false,
    verificationStatus: 'unverified', // unverified, pending, verified, rejected
    cacDocument: ''
  });

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData(prev => ({
              ...prev,
              displayName: userData.displayName || currentUser.displayName || '',
              bio: userData.bio || '',
              skills: userData.skills || '',
              phone: userData.phone || '',
              whatsapp: userData.whatsapp || '',
              instagram: userData.instagram || '',
              portfolioLink: userData.portfolioLink || '',
              profileImage: userData.profileImage || currentUser.photoURL || '',
              businessName: userData.businessName || '',
              businessAddress: userData.businessAddress || '',
              cacNumber: userData.cacNumber || '',
              isBusinessRegistered: userData.isBusinessRegistered || false,
              verificationStatus: userData.verificationStatus || 'unverified',
              cacDocument: userData.cacDocument || ''
            }));
            
            if (userData.profileImage) {
              setPreviewUrl(userData.profileImage);
            } else if (currentUser.photoURL) {
              setPreviewUrl(currentUser.photoURL);
            }
          } else {
            // Set default values from Firebase Auth
            setFormData(prev => ({
              ...prev,
              displayName: currentUser.displayName || '',
              profileImage: currentUser.photoURL || ''
            }));
            setPreviewUrl(currentUser.photoURL || '');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCacChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCacUpload(file);
    }
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;

    const fileRef = ref(storage, `${path}/${currentUser.uid}/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let profileImageUrl = formData.profileImage;
      let cacDocumentUrl = formData.cacDocument;

      // Upload new profile image if selected
      if (imageUpload) {
        profileImageUrl = await uploadFile(imageUpload, 'profile-images');
      }

      // Upload CAC document if selected and business is registered
      if (cacUpload && formData.isBusinessRegistered) {
        cacDocumentUrl = await uploadFile(cacUpload, 'cac-documents');
        
        // Set status to pending if CAC is uploaded
        formData.verificationStatus = 'pending';
      }

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.displayName,
        photoURL: profileImageUrl
      });

      // Save additional data to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: formData.displayName,
        bio: formData.bio,
        skills: formData.skills,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        portfolioLink: formData.portfolioLink,
        profileImage: profileImageUrl,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        cacNumber: formData.cacNumber,
        isBusinessRegistered: formData.isBusinessRegistered,
        verificationStatus: formData.verificationStatus,
        cacDocument: cacDocumentUrl,
        updatedAt: new Date()
      }, { merge: true });

      setMessage('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
      console.error('Update error:', error);
    }
    setLoading(false);
  };

  const renderVerificationBadge = () => {
    switch (formData.verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center text-green-600">
            <FaCheckCircle className="mr-2" />
            <span>Verified Business</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600">
            <FaClock className="mr-2" />
            <span>Verification Pending</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600">
            <FaTimesCircle className="mr-2" />
            <span>Verification Rejected</span>
          </div>
        );
      default:
        return (
          <div className="text-gray-600">
            <span>Not Verified</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Update Your Profile</h1>
              <p className="mt-2 text-lg text-gray-600">
                Complete your profile to attract more clients
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <img
                    className="h-24 w-24 object-cover rounded-full border-2 border-gray-300"
                    src={previewUrl || '/default-avatar.png'}
                    alt="Current profile"
                  />
                </div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  required
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell clients about yourself and your services"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile.
                </p>
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills/Services *
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  required
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Web Development, Graphic Design, Photography"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Separate skills with commas.
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                    WhatsApp Link
                  </label>
                  <input
                    type="url"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://wa.me/1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram Link
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </div>

              {/* Portfolio Link */}
              <div>
                <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  id="portfolioLink"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              {/* Business Registration Section */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
                
                <div className="flex items-center mb-4">
                  <input
                    id="isBusinessRegistered"
                    name="isBusinessRegistered"
                    type="checkbox"
                    checked={formData.isBusinessRegistered}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isBusinessRegistered" className="ml-2 block text-sm text-gray-900">
                    My business is registered with CAC
                  </label>
                </div>

                {formData.isBusinessRegistered && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Your registered business name"
                        />
                      </div>

                      <div>
                        <label htmlFor="cacNumber" className="block text-sm font-medium text-gray-700">
                          CAC Registration Number *
                        </label>
                        <input
                          type="text"
                          id="cacNumber"
                          name="cacNumber"
                          value={formData.cacNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="RC1234567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
                        Business Address
                      </label>
                      <textarea
                        id="businessAddress"
                        name="businessAddress"
                        rows={2}
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Your business physical address"
                      />
                    </div>

                    <div>
                      <label htmlFor="cacDocument" className="block text-sm font-medium text-gray-700">
                        CAC Certificate/Document *
                      </label>
                      <input
                        type="file"
                        id="cacDocument"
                        name="cacDocument"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleCacChange}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Upload a clear photo or scan of your CAC certificate (PDF, JPG, PNG)
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div className="p-3 bg-white rounded-md border">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h3>
                      {renderVerificationBadge()}
                      {formData.verificationStatus === 'pending' && (
                        <p className="mt-2 text-sm text-gray-500">
                          Your documents are under review. This may take 1-3 business days.
                        </p>
                      )}
                      {formData.verificationStatus === 'rejected' && (
                        <p className="mt-2 text-sm text-gray-500">
                          Your verification was rejected. Please check your documents and try again.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}