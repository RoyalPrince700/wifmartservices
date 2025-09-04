import React from 'react';
import { HiChevronRight, HiDocumentText, HiShieldCheck, HiUserGroup, HiExclamationCircle } from 'react-icons/hi2';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <HiDocumentText className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Please read these terms carefully before using Wifmart platform
              </p>
              <p className="text-sm text-blue-200 mt-4">
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
                <HiChevronRight className="h-8 w-8 text-blue-600 mr-3" />
                Agreement to Terms
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                By accessing and using Wifmart, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            {/* Service Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiChevronRight className="h-8 w-8 text-blue-600 mr-3" />
                Service Description
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100/50">
                <p className="text-gray-700 leading-relaxed">
                  Wifmart is a platform that connects skilled service providers with clients seeking their expertise.
                  Our platform facilitates the connection between service providers and clients for various professional services.
                </p>
              </div>
            </div>

            {/* User Obligations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiUserGroup className="h-8 w-8 text-purple-600 mr-3" />
                User Obligations
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">For Service Providers</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Provide accurate and truthful information
                    </li>
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Maintain professional standards
                    </li>
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Complete services as agreed
                    </li>
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Respect client confidentiality
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">For Clients</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      Provide clear project requirements
                    </li>
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      Make timely payments
                    </li>
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      Respect provider's time and expertise
                    </li>
                    <li className="flex items-start">
                      <HiChevronRight className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      Provide constructive feedback
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiExclamationCircle className="h-8 w-8 text-red-500 mr-3" />
                Prohibited Activities
              </h2>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100/50">
                <p className="text-gray-700 mb-4 font-medium">Users are strictly prohibited from:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-600">
                    <li>• Using the platform for illegal activities</li>
                    <li>• Posting false or misleading information</li>
                    <li>• Harassing or discriminating against others</li>
                    <li>• Sharing inappropriate content</li>
                  </ul>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Violating intellectual property rights</li>
                    <li>• Attempting to hack or disrupt the platform</li>
                    <li>• Creating fake accounts</li>
                    <li>• Spamming other users</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HiShieldCheck className="h-8 w-8 text-green-600 mr-3" />
                Payment Terms
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100/50">
                <div className="space-y-4 text-gray-700">
                  <p>• All payments are processed securely through our payment system</p>
                  <p>• Service fees are clearly displayed before any transaction</p>
                  <p>• Refunds are available according to our refund policy</p>
                  <p>• Disputes should be resolved through our dispute resolution process</p>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                Wifmart reserves the right to terminate or suspend any account at any time for violations of these terms.
                Users may also terminate their account at any time through their account settings.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;
