import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiSparkles, HiExclamation, HiRefresh, HiX, HiFilter, HiChevronDown } from 'react-icons/hi';
import debounce from "lodash/debounce";
import SearchResultCard from '../../src/components/SearchResultCard';
import { searchProviders } from '../../src/services/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const SearchResultsMobile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameFromSearch, setCameFromSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Category name mapping
  const categoryNames = {
    development: 'Development & IT',
    design: 'Design & Creative',
    marketing: 'Marketing',
    writing: 'Writing & Translation',
    vendor: 'Vendors & Retail',
    business: 'Business Consulting'
  };

  // Get category display name
  const getCategoryDisplayName = (categoryId) => {
    return categoryNames[categoryId] || categoryId;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Detect if user came from search or category
  useEffect(() => {
    const referrer = document.referrer;
    const cameFromSearchInput = referrer.includes('/search-input') ||
                               referrer.includes('SearchInput') ||
                               location.state?.from === 'search';

    const hasSearchQuery = searchParams.get('q');
    const hasCategory = searchParams.get('category');

    setCameFromSearch(cameFromSearchInput || !!hasSearchQuery || !!hasCategory);
  }, [location, searchParams]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, categoryParam) => {
      if (!query.trim() && !categoryParam) {
        setProviders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await searchProviders(query, categoryParam);
        setProviders(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch search results');
        toast.error(err.message || 'Search failed');
        setLoading(false);
      }
    }, 300),
    []
  );

  // Update state when URL params change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    setSearchQuery(query);
    setCategory(cat);
  }, [searchParams]);

  // Fetch providers when search query or category changes
  useEffect(() => {
    debouncedSearch(searchQuery, category);
    return () => debouncedSearch.cancel();
  }, [searchQuery, category, debouncedSearch]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
    }
    if (category) {
      params.category = category;
    }
    setSearchParams(params);
  };

  const handleRetry = () => {
    if (searchQuery.trim() || category) {
      debouncedSearch(searchQuery, category);
    }
  };

  const categorySuggestions = {
    development: ['Website Development', 'Web Development', 'Mobile App Development', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'WordPress Developer', 'React Developer'],
    design: ['Graphic Design', 'UI/UX', 'Logo Design', 'Brand Identity'],
    marketing: ['Digital Marketing', 'Social Media', 'SEO', 'Content Marketing'],
    writing: ['Content Writing', 'Copywriting', 'Technical Writing', 'Blog Writing'],
    vendor: ['Bag Vendor', 'Fashion Vendor', 'Retail Store', 'Wholesale Supplier'],
    business: ['Consulting', 'Strategy', 'Startup', 'Planning']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white shadow-sm border-b z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {category ? getCategoryDisplayName(category) : 'Search Results'}
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <HiFilter className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={category ? `Search in ${getCategoryDisplayName(category)}...` : "Search for services..."}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Category Filter Toggle */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryNames).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => {
                      const newCategory = category === id ? '' : id;
                      const params = {};
                      if (searchQuery.trim()) params.q = searchQuery.trim();
                      if (newCategory) params.category = newCategory;
                      setSearchParams(params);
                      setShowFilters(false);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      category === id
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 bg-white border-b">
        <p className="text-sm text-gray-600">
          {loading ? 'Searching...' :
           providers.length > 0
             ? `${providers.length} provider${providers.length === 1 ? '' : 's'} found`
             : 'No results found'
          }
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {loading && (
          <div className="py-12">
            <Loading
              variant="centered"
              size="md"
              color="blue"
              text="Finding providers..."
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <HiExclamation className="w-5 h-5 text-red-500 mr-2" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <HiRefresh className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!loading && !error && providers.length === 0 && (searchQuery || category) && (
          <div className="text-center py-12">
            <HiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 text-sm mb-6">
              {category
                ? `No providers found in ${getCategoryDisplayName(category)}`
                : 'Try adjusting your search terms'
              }
            </p>

            {category && categorySuggestions[category] && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Popular services:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {categorySuggestions[category].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-2 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="space-y-4">
            {providers.map((provider, index) => (
              <div
                key={provider._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SearchResultCard provider={provider} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SearchResultsMobile;
