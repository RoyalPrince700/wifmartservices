import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiSparkles, HiCode, HiPencilAlt, HiBriefcase, HiLocationMarker, HiOfficeBuilding, HiPhotograph, HiPencil, HiDesktopComputer, HiChip, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

// Custom Typewriter Hook
const useTypewriter = (text, speed = 50, delay = 0) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setCurrentIndex(0);
      setDisplayText('');
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [delay]);

  return { displayText, isComplete };
};

const Hero = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [hasTyped, setHasTyped] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Motion copy
  const subHeadingText = "In Minutes";
  const { displayText: subHeadingDisplay, isComplete: subHeadingComplete } = useTypewriter(subHeadingText, 100, 600);
  const valuePropOneLiner = "Need a bag vendor in Lagos? Wedding planner Abuja? Graphic designer for your business? Find verified professionals instantly.";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Search Suggestions Data
  const searchSuggestions = [
    {
      category: 'Fashion & Accessories',
      icon: HiPencilAlt,
      color: 'text-pink-500',
      items: [
        'Bag Vendor', 'Bag Maker', 'Bag Seller', 'Fashion Designer', 'Tailor', 'Shoe Maker',
        'Jewelry Maker', 'Clothing Designer', 'Fashion Stylist', 'Accessory Designer'
      ]
    },
    {
      category: 'Events & Planning',
      icon: HiOfficeBuilding,
      color: 'text-purple-500',
      items: [
        'Event Planner', 'Wedding Planner', 'Party Planner', 'Event Decorator', 'Catering Service',
        'Event Photographer', 'Wedding Photographer', 'MC/Event Host', 'Event Coordinator'
      ]
    },
    {
      category: 'Design & Creative',
      icon: HiPencil,
      color: 'text-blue-500',
      items: [
        'Graphic Designer', 'Logo Designer', 'Web Designer', 'UI/UX Designer', 'Brand Designer',
        'Print Designer', 'Digital Artist', 'Illustrator', 'Video Editor', 'Motion Graphics'
      ]
    },
    {
      category: 'Technology & Development',
      icon: HiDesktopComputer,
      color: 'text-green-500',
      items: [
        'Web Developer', 'Mobile App Developer', 'Software Developer', 'Website Developer',
        'E-commerce Developer', 'WordPress Developer', 'Frontend Developer', 'Backend Developer',
        'Full Stack Developer', 'IT Support', 'System Administrator'
      ]
    },
    {
      category: 'Marketing & Business',
      icon: HiBriefcase,
      color: 'text-orange-500',
      items: [
        'Digital Marketer', 'Social Media Manager', 'Content Creator', 'SEO Specialist',
        'Business Consultant', 'Brand Manager', 'Copywriter', 'PR Specialist', 'Sales Consultant'
      ]
    },
    {
      category: 'Media & Photography',
      icon: HiPhotograph,
      color: 'text-indigo-500',
      items: [
        'Photographer', 'Video Producer', 'Photo Editor', 'Videographer', 'Photo Studio',
        'Product Photographer', 'Event Photographer', 'Portrait Photographer', 'Commercial Photographer'
      ]
    }
  ];

  // Filter suggestions based on search query
  const filterSuggestions = (query) => {
    if (!query.trim()) return [];

    const filtered = [];
    const queryLower = query.toLowerCase();

    searchSuggestions.forEach(category => {
      const matchingItems = category.items.filter(item =>
        item.toLowerCase().includes(queryLower)
      );

      if (matchingItems.length > 0) {
        filtered.push({
          ...category,
          items: matchingItems.slice(0, 5) // Limit to 5 suggestions per category
        });
      }
    });

    return filtered;
  };

  // Handle input change with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!hasTyped && value.length > 0) {
      setHasTyped(true);
      // Auto-navigate to search-input page on first character
      setTimeout(() => {
        navigate(`/search-input?q=${encodeURIComponent(value)}`);
      }, 100);
    }

    if (value.length > 0) {
      const suggestions = filterSuggestions(value);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search-input?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search-input?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const quickSearches = [
    { label: 'Bag Vendors', icon: HiPencilAlt, color: 'text-blue-500' },
    { label: 'Event Planners', icon: HiCode, color: 'text-blue-600' },
    { label: 'Graphic Design', icon: HiBriefcase, color: 'text-blue-700' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-white min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className={`absolute top-20 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl transition-all duration-[8000ms] ease-in-out ${isLoaded ? 'animate-float-1' : ''}`}></div>
        <div className={`absolute bottom-20 right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl transition-all duration-[10000ms] ease-in-out ${isLoaded ? 'animate-float-2' : ''}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-50/20 to-transparent rounded-full transition-all duration-[12000ms] ease-in-out ${isLoaded ? 'animate-float-3' : ''}`}></div>

        {/* Additional floating elements */}
        <div className={`absolute top-32 right-20 w-4 h-4 bg-blue-400/20 rounded-full transition-all duration-[6000ms] ease-in-out ${isLoaded ? 'animate-ping-slow' : ''}`}></div>
        <div className={`absolute bottom-40 left-20 w-6 h-6 bg-purple-400/20 rotate-45 transition-all duration-[8000ms] ease-in-out ${isLoaded ? 'animate-float-4' : ''}`}></div>
        <div className={`absolute top-60 left-32 w-3 h-3 bg-cyan-400/20 rounded-full transition-all duration-[7000ms] ease-in-out ${isLoaded ? 'animate-bounce-slow' : ''}`}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200/50 backdrop-blur-sm mb-8 animate-pulse">
            <HiSparkles className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm font-semibold text-red-700">⚡ Limited Time: Get Your First Client Free</span>
          </div>

          {/* Main Heading - Static with typed subheading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
            Get Quality Services
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
              {subHeadingDisplay}
              <span className={`inline-block w-1 h-8 bg-blue-600 ml-1 align-middle animate-pulse ${subHeadingComplete ? 'opacity-0' : 'opacity-100'}`}></span>
            </span>
              </h1>

          {/* Concise value proposition */}
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            {valuePropOneLiner}
          </p>

          {/* Creative Search Section */}
          <div className="max-w-3xl mx-auto">
            {/* Main Search Container */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5 mb-4 transform hover:shadow-2xl transition-all duration-300">
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input - Creative Design with Animation */}
                <div className="relative group" ref={searchInputRef}>
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <HiSearch className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 group-hover:scale-110 transform transition-transform duration-200" />
                    </div>
                    <input
                      type="text"
                      name="query"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="block w-full pl-16 pr-6 py-5 text-lg border-0 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] focus:scale-[1.02]"
                      placeholder="Try: 'Bag vendor in Lagos' or 'Wedding planner Abuja' or 'Logo design'"
                      aria-label="Search for vendors, freelancers, projects, or specific professionals"
                      autoComplete="off"
                    />
                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <>
                      {/* Mobile Overlay */}
                      <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowSuggestions(false)} />

                      {/* Suggestions Dropdown */}
                      <div
                        ref={suggestionsRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50
                                   md:max-h-96 md:top-full md:mt-2
                                   fixed md:static inset-x-4 md:inset-x-auto top-24 md:top-auto md:left-0 md:right-0"
                      >
                        {/* Mobile Header */}
                        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-blue-50 rounded-t-2xl">
                          <h3 className="text-lg font-semibold text-gray-800">Search Suggestions</h3>
                          <button
                            onClick={() => setShowSuggestions(false)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <HiX className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>

                        {/* Suggestions Content */}
                        <div className="max-h-80 md:max-h-96 overflow-y-auto">
                          {filteredSuggestions.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="p-4 border-b border-gray-50 last:border-b-0">
                              <div className="flex items-center mb-3">
                                <category.icon className={`w-5 h-5 mr-2 ${category.color}`} />
                                <span className="text-sm font-semibold text-gray-800">{category.category}</span>
                              </div>
                              <div className="space-y-1">
                                {category.items.map((item, itemIndex) => (
                                  <button
                                    key={itemIndex}
                                    onClick={() => handleSuggestionClick(item)}
                                    className="w-full text-left px-3 py-3 md:py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium
                                               md:text-sm md:px-3 md:py-2"
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl md:rounded-none">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              Press Enter to search
                            </p>
                            <button
                              onClick={() => setShowSuggestions(false)}
                              className="md:hidden px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Popular Nigerian Services */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">Popular:</span>
                  {quickSearches.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSearchQuery(item.label)}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-110 hover:-translate-y-1 animate-fade-in-stagger"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <item.icon className={`w-4 h-4 mr-2 ${item.color} transition-transform duration-200 group-hover:scale-110`} />
                      {item.label}
                    </button>
                  ))}
                  </div>

                {/* Search Button - Creative Design */}
                <div className="flex justify-center pt-1">
                  <button
                    type="submit"
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <span className="relative mr-3 text-lg">Find Your Match</span>
                    <HiArrowRight className="relative w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                  </button>
                </div>
                </form>
              </div>

            {/* Dual CTA Section */}
            <div className="mt-8 space-y-4">
              {/* For Service Providers */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-200/50">
                <h3 className="text-lg font-semibold text-green-800 mb-2">🎯 Want More Clients?</h3>
                <p className="text-green-700 text-sm mb-4">Set up your professional profile in 5 minutes and start getting clients today.</p>
                <button className="group relative bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    Start Getting Clients
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                  </span>
                  {/* Success particles effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping delay-100"></div>
                  </div>
                </button>
              </div>

              {/* Trust & Stats */}
              <div className="text-center">
                <p className="text-gray-500 text-sm font-medium">
                  Join 500+ vendors, freelancers & businesses • 98% satisfaction rate • 2,000+ projects completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(20px) translateY(-15px); }
          50% { transform: translateX(-10px) translateY(-30px); }
          75% { transform: translateX(-20px) translateY(-15px); }
        }

        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-25px) rotate(45deg); }
        }

        @keyframes ping-slow {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-stagger {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 10s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 12s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 8s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 7s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-stagger {
          animation: fade-in-stagger 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Hero;