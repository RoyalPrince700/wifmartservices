import React, { useState } from 'react';
import { HiEnvelope, HiDevicePhoneMobile, HiMapPin, HiClock, HiPaperAirplane, HiUser, HiChatBubbleOvalLeft } from 'react-icons/hi2';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to backend API for email processing
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recipient: 'wifmartofficial@gmail.com'
        }),
      });

      if (response.ok) {
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact us directly at wifmartofficial@gmail.com');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-300/10 to-blue-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <HiChatBubbleOvalLeft className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Get in touch with us. We're here to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-6">
                Your message will be sent to our support team at <strong>wifmartofficial@gmail.com</strong>
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <HiEnvelope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
                >
                  <HiPaperAirplane className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                      <HiEnvelope className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Us</h3>
                      <p className="text-gray-600">support@wifmart.com</p>
                      <p className="text-gray-600">business@wifmart.com</p>
                      <p className="text-gray-600">wifmartofficial@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                      <HiDevicePhoneMobile className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Call Us</h3>
                      <p className="text-gray-600">+2348160881705</p>
                      <p className="text-gray-600">+2349075799282</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                      <HiClock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Business Hours</h3>
                      <p className="text-gray-600">24/7 Support Available</p>
                      <p className="text-gray-600">We're always here to help you</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="/help"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <div className="font-semibold mb-1">Help Center</div>
                    <div className="text-sm opacity-90">Find answers quickly</div>
                  </a>
                  <a
                    href="/terms"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <div className="font-semibold mb-1">Terms of Service</div>
                    <div className="text-sm opacity-90">Read our terms</div>
                  </a>
                  <a
                    href="/privacy"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <div className="font-semibold mb-1">Privacy Policy</div>
                    <div className="text-sm opacity-90">Learn about privacy</div>
                  </a>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                    <div className="font-semibold mb-1">Live Chat</div>
                    <div className="text-sm opacity-90">Available 24/7</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Follow Us</h3>
                <p className="text-gray-600 mb-6">
                  Stay connected and get the latest updates from Wifmart.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110">
                    <FaFacebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110">
                    <FaTwitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110">
                    <FaInstagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="p-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 transform hover:scale-110">
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
