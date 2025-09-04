import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiCheckCircle } from 'react-icons/hi';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilePicture: null,
    skills: [],
    whatsappLink: '',
    phoneNumber: '',
    instagramHandle: '',
    cacNumber: '',
    cacCertificate: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [status, setStatus] = useState('Not Submitted');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setFormData({ ...formData, profilePicture: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setError('Please upload a valid image (JPG/PNG).');
    }
  };

  // Handle CAC certificate upload
  const handleCACUpload = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setFormData({ ...formData, cacCertificate: file });
    } else {
      setError('Please upload a valid CAC certificate (PDF/JPG/PNG).');
    }
  };

  // Handle skills input
  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  // Submit profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('profilePicture', formData.profilePicture);
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      formDataToSend.append('whatsappLink', formData.whatsappLink);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('instagramHandle', formData.instagramHandle);
      formDataToSend.append('cacNumber', formData.cacNumber);
      formDataToSend.append('cacCertificate', formData.cacCertificate);

      // Replace with your backend API endpoint
      const response = await axios.post('/api/profile/setup', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (formData.cacNumber && formData.cacCertificate) {
        setStatus('Pending Verification');
      }
      alert('Profile setup successful!');
      navigate('/dashboard');
    } catch (err) {
      setError('Error submitting profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply for verification badge
  const handleVerificationApply = () => {
    navigate('/verification');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Complete Your Profile</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-green-700">Profile Picture</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleProfilePictureChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-4 w-32 h-32 rounded-full object-cover mx-auto" />
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-green-700">Skills (Press Enter to add)</label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillAdd}
              placeholder="e.g., Web Development"
              className="mt-1 block w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Link */}
          <div>
            <label className="block text-sm font-medium text-green-700">WhatsApp Link</label>
            <input
              type="url"
              name="whatsappLink"
              value={formData.whatsappLink}
              onChange={handleInputChange}
              placeholder="https://wa.me/your-number"
              className="mt-1 block w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-green-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+234XXXXXXXXXX"
              className="mt-1 block w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Instagram Handle (Optional) */}
          <div>
            <label className="block text-sm font-medium text-green-700">Instagram Handle (Optional)</label>
            <input
              type="text"
              name="instagramHandle"
              value={formData.instagramHandle}
              onChange={handleInputChange}
              placeholder="@yourhandle"
              className="mt-1 block w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CAC Number (Optional) */}
          <div>
            <label className="block text-sm font-medium text-green-700">CAC Number (Optional)</label>
            <input
              type="text"
              name="cacNumber"
              value={formData.cacNumber}
              onChange={handleInputChange}
              placeholder="CAC Registration Number"
              className="mt-1 block w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CAC Certificate Upload */}
          <div>
            <label className="block text-sm font-medium text-green-700">CAC Certificate (Optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleCACUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          {/* Status Display */}
          {status !== 'Not Submitted' && (
            <div className="text-center">
              <p className="text-sm font-medium text-green-700">CAC Status: {status}</p>
              {status === 'Verified' && (
                <p className="text-green-600 font-semibold flex items-center">
                  <HiCheckCircle className="h-4 w-4 mr-2" />
                  CAC Registered
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Save Profile'}
          </button>
        </form>

        {/* Verification Badge Application */}
        <div className="mt-6 text-center">
          <button
            onClick={handleVerificationApply}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply for Verification Badge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;