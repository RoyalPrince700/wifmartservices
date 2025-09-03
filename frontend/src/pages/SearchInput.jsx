// frontend/src/pages/SearchInput.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiSparkles, HiX } from 'react-icons/hi';

const SearchInput = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Search Suggestions Data - Flat list without categories
  const searchSuggestions = [
    // Web/Website related
    'Website Developer', 'Website Development', 'Web Developer', 'Web Design', 'Website Design',
    'WordPress Developer', 'Shopify Developer', 'E-commerce Website', 'Landing Page Design',
    'React Developer', 'Frontend Developer', 'Full Stack Developer', 'Web Application Developer',
    'HTML Developer', 'CSS Developer', 'JavaScript Developer', 'PHP Developer', 'Laravel Developer',
    'Node.js Developer', 'Next.js Developer', 'Vue.js Developer', 'Angular Developer',

    // Bag/Fashion related
    'Bag Vendor', 'Bag Maker', 'Bag Seller', 'Custom Bag Maker', 'Designer Bags', 'Leather Bag Maker',
    'Fashion Designer', 'Clothing Designer', 'Tailor', 'Seamstress', 'Fashion Stylist',
    'Shoe Maker', 'Shoe Designer', 'Footwear Designer', 'Jewelry Maker', 'Accessory Designer',

    // Event related
    'Event Planner', 'Wedding Planner', 'Event Coordinator', 'Party Planner', 'Corporate Event Planner',
    'Event Decorator', 'Catering Service', 'Event Photographer', 'Wedding Photographer',
    'MC/Event Host', 'DJ Services', 'Sound System Rental', 'Lighting Services',

    // Design/Creative related
    'Graphic Designer', 'Logo Designer', 'Brand Designer', 'UI/UX Designer', 'Print Designer',
    'Digital Artist', 'Illustrator', 'Video Editor', 'Motion Graphics', 'Animation Artist',
    'Photo Editor', 'Adobe Photoshop Expert', 'Adobe Illustrator Expert', 'Canva Designer',

    // Marketing/Business related
    'Digital Marketer', 'Social Media Manager', 'SEO Specialist', 'Content Creator',
    'Business Consultant', 'Brand Manager', 'Copywriter', 'PR Specialist', 'Sales Consultant',
    'Email Marketer', 'Influencer Marketing', 'PPC Specialist', 'Content Marketing',

    // Photography/Media related
    'Photographer', 'Videographer', 'Photo Studio', 'Product Photographer', 'Event Photographer',
    'Portrait Photographer', 'Commercial Photographer', 'Wedding Photographer', 'Real Estate Photographer',
    'Video Producer', 'Video Editor', 'Drone Photography', 'Photo Retoucher',

    // Technology/IT related
    'IT Support', 'System Administrator', 'Network Administrator', 'Cybersecurity Expert',
    'Mobile App Developer', 'iOS Developer', 'Android Developer', 'Flutter Developer',
    'Software Developer', 'Database Administrator', 'Cloud Services', 'DevOps Engineer',

    // General services
    'Virtual Assistant', 'Data Entry Specialist', 'Transcription Services', 'Customer Service',
    'Project Manager', 'Business Analyst', 'Quality Assurance', 'Technical Writer'
  ];

  // Filter suggestions based on search query
  const filterSuggestions = (query) => {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();

    // Filter the flat array of suggestions
    const matchingItems = searchSuggestions.filter(item =>
      item.toLowerCase().includes(queryLower)
    );

    // Return up to 20 most relevant suggestions
    return matchingItems.slice(0, 20);
  };

  // Handle input change with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

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
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Search Form - Fixed at top */}
        <div className="pt-8 pb-4">
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative" ref={searchInputRef}>
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <HiSearch className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="query"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="block w-full pl-16 pr-12 py-5 text-xl border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-lg"
                  placeholder="Search for services..."
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center"
                  >
                    <HiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Main Content Area - Takes remaining space */}
        <div className="flex-1 flex flex-col px-4 pb-8">
          {showSuggestions && filteredSuggestions.length > 0 ? (
            <div className="max-w-4xl mx-auto w-full" ref={suggestionsRef}>
              {/* Suggestions Display - Smaller and more compact */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-md transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-sm text-sm font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchQuery ? (
            <div className="text-center">
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                <HiSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No suggestions found</h3>
                <p className="text-gray-600 mb-4 text-sm">Try typing something like "website", "bag", or "photographer"</p>
                <button
                  onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Search Anyway
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-50 rounded-xl p-6 max-w-xl mx-auto">
                <HiSparkles className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <span className="text-gray-500">Try:</span>
                  <span className="bg-white px-2 py-1 rounded-full text-gray-700 border text-xs">website</span>
                  <span className="bg-white px-2 py-1 rounded-full text-gray-700 border text-xs">bag</span>
                  <span className="bg-white px-2 py-1 rounded-full text-gray-700 border text-xs">photographer</span>
                  <span className="bg-white px-2 py-1 rounded-full text-gray-700 border text-xs">designer</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS Styles */}
      <style>{`
        /* Prevent scrolling on this page */
        html, body {
          overflow: hidden;
          height: 100%;
        }

        /* Ensure white background fills entire viewport */
        html, body, #root {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default SearchInput;
