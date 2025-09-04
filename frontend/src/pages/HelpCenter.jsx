import React, { useState } from 'react';
import { HiMagnifyingGlass, HiChevronDown, HiChevronUp, HiQuestionMarkCircle, HiUserGroup, HiCreditCard, HiWrenchScrewdriver, HiChatBubbleOvalLeft, HiChatBubbleLeftRight, HiArrowRight } from 'react-icons/hi2';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HiQuestionMarkCircle },
    { id: 'account', name: 'Account & Profile', icon: HiUserGroup },
    { id: 'payments', name: 'Payments & Billing', icon: HiCreditCard },
    { id: 'services', name: 'Services', icon: HiWrenchScrewdriver },
    { id: 'support', name: 'Support', icon: HiChatBubbleOvalLeft }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account on Wifmart?',
      answer: 'To create an account, click on the "Sign Up" button in the top navigation. Fill in your basic information including name, email, and password. You can then complete your profile by adding a photo, bio, and professional details.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How can I verify my account?',
      answer: 'Account verification helps build trust. Go to your profile settings and click on "Verify Account". You can verify through email, phone, or by uploading identification documents. Verified accounts get a special badge.'
    },
    {
      id: 3,
      category: 'services',
      question: 'How do I post a service?',
      answer: 'To post a service, go to your dashboard and click "Add Service". Fill in details like service title, description, pricing, and category. Add photos to showcase your work and set your availability.'
    },
    {
      id: 4,
      category: 'services',
      question: 'How do I find and hire a service provider?',
      answer: 'Use our search feature to find providers by category, location, or keywords. Browse provider profiles, check reviews, and contact them directly. You can also post a project request for providers to respond to.'
    },
    {
      id: 5,
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment partners with industry-standard encryption.'
    },
    {
      id: 6,
      category: 'payments',
      question: 'How do refunds work?',
      answer: 'Refunds are processed within 3-5 business days after approval. Contact our support team with your transaction details. Refund eligibility depends on the service completion status and our refund policy.'
    },
    {
      id: 7,
      category: 'support',
      question: 'How do I contact customer support?',
      answer: 'You can contact us through the contact form, email us at support@wifmart.com, or use our live chat feature. We typically respond within 24 hours during business days.'
    },
    {
      id: 8,
      category: 'support',
      question: 'What should I do if I have a dispute with a provider?',
      answer: 'Contact our dispute resolution team through the support center. Provide details about the transaction and issue. We\'ll work with both parties to reach a fair resolution within 7-10 business days.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <HiQuestionMarkCircle className="h-12 w-12" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Help Center
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions and get the help you need.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 p-6 mb-8">
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 shadow-md'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/30 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HiQuestionMarkCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No results found for your search.</p>
                <p className="text-gray-500">Try different keywords or browse all topics.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                    >
                      <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <HiChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <HiChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Still Need Help?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiChatBubbleLeftRight className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-blue-100 mb-4">Get instant help from our support team</p>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                  Start Chat
                </button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiArrowRight className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                <p className="text-blue-100 mb-4">Send us a detailed message about your issue</p>
                <a
                  href="/contact"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  Contact Form
                </a>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiQuestionMarkCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Topics</h3>
                <p className="text-blue-100 mb-4">Explore our comprehensive help documentation</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  All Topics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
