import React from 'react';
import { HiChevronRight, HiShieldCheck, HiLockClosed, HiEye, HiDocumentText, HiUser } from 'react-icons/hi2';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <HiLockClosed className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-purple-200 mt-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8 lg:p-12">

            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiChevronRight className="h-8 w-8 text-purple-600 mr-3" />
                Our Commitment to Privacy
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Wifmart, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiDocumentText className="h-8 w-8 text-blue-600 mr-3" />
                Information We Collect
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <HiUser className="h-6 w-6 text-purple-600 mr-2" />
                    Personal Information
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Name and contact details</li>
                    <li>• Profile information and photos</li>
                    <li>• Professional credentials</li>
                    <li>• Payment information</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <HiEye className="h-6 w-6 text-green-600 mr-2" />
                    Usage Information
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• How you use our platform</li>
                    <li>• Device and browser information</li>
                    <li>• Location data (with permission)</li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiShieldCheck className="h-8 w-8 text-green-600 mr-3" />
                How We Use Your Information
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100/50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Platform Operation</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Connect providers with clients</li>
                      <li>• Process payments securely</li>
                      <li>• Provide customer support</li>
                      <li>• Maintain platform security</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Service Improvement</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Analyze usage patterns</li>
                      <li>• Improve user experience</li>
                      <li>• Develop new features</li>
                      <li>• Send relevant notifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Information Sharing & Disclosure</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">We Share Information When:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-600">
                      <li>• You connect with other users</li>
                      <li>• Required by law or legal process</li>
                      <li>• To protect our rights and safety</li>
                      <li>• With your explicit consent</li>
                    </ul>
                    <ul className="space-y-2 text-gray-600">
                      <li>• To complete transactions</li>
                      <li>• With trusted service providers</li>
                      <li>• In connection with business transfers</li>
                      <li>• To comply with regulations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiLockClosed className="h-8 w-8 text-red-600 mr-3" />
                Data Security
              </h2>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100/50">
                <p className="text-gray-700 mb-4">
                  We implement robust security measures to protect your information:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <HiShieldCheck className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Encryption</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <HiLockClosed className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Access Control</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <HiEye className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Regular Audits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Rights & Choices</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Access & Control</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Access your personal data</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Delete your account and data</li>
                    <li>• Export your data</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Communication Preferences</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Opt out of marketing emails</li>
                    <li>• Control notification settings</li>
                    <li>• Manage cookie preferences</li>
                    <li>• Update privacy settings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Privacy Questions?</h2>
              <p className="mb-6">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Contact Us
                </a>
                <a
                  href="/help"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
