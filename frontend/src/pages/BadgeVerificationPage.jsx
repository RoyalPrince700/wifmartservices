// src/pages/BadgeVerificationPage.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const BadgeVerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    portfolio_images: [],
    additional_docs: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [previewDocs, setPreviewDocs] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, portfolio_images: files }));
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleDocChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, additional_docs: files }));
    setPreviewDocs(files.map(file => URL.createObjectURL(file)));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('reason', formData.reason);
    formData.portfolio_images.forEach(file => data.append('portfolio_images', file));
    formData.additional_docs.forEach(file => data.append('additional_docs', file));

    try {
      await api.post('/api/users/apply-badge', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Badge application submitted! Awaiting admin review.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Apply for Verified Badge</h1>
      <p className="text-gray-600 mb-6">
        Get the <strong>Verified Badge</strong> to increase trust and visibility on Wifmart.
        Show clients you're serious about your craft.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reason for Application */}
        <div>
          <label className="block font-medium mb-2">
            Why do you deserve a verified badge?
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3"
            rows="4"
            placeholder="Tell us about your experience, achievements, or why you should be verified..."
            required
          />
        </div>

        {/* Portfolio Images */}
        <div>
          <label className="block font-medium mb-2">
            Upload Portfolio Images (Showcase your best work)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500"
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {previewImages.map((src, i) => (
              <img key={i} src={src} alt="Portfolio preview" className="h-20 object-cover rounded" />
            ))}
          </div>
        </div>

        {/* Additional Documents */}
        <div>
          <label className="block font-medium mb-2">
            Upload Supporting Documents (Optional)
          </label>
          <input
            type="file"
            multiple
            onChange={handleDocChange}
            className="block w-full text-sm text-gray-500"
          />
          <p className="text-sm text-gray-500">
            Examples: Certificates, Awards, Press Features, Client Testimonials (PDF/Image)
          </p>
          <div className="mt-2">
            {previewDocs.map((src, i) => (
              <a
                key={i}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-500 text-sm"
              >
                View Document {i + 1}
              </a>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BadgeVerificationPage;