import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiSparkles, HiExclamation, HiRefresh, HiX } from 'react-icons/hi';
import debounce from "lodash/debounce";
import SearchResultCard from '../../src/components/SearchResultCard';
import { searchProviders } from '../../src/services/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const SearchResultsDesktop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameFromSearch, setCameFromSearch] = useState(false);

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

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-white min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl transition-all duration-[8000ms] ease-in-out ${isLoaded ? 'animate-float-1' : ''}`}></div>
        <div className={`absolute bottom-20 right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl transition-all duration-[10000ms] ease-in-out ${isLoaded ? 'animate-float-2' : ''}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-50/20 to-transparent rounded-full transition-all duration-[12000ms] ease-in-out ${isLoaded ? 'animate-float-3' : ''}`}></div>
        <div className={`absolute top-32 right-20 w-4 h-4 bg-blue-400/20 rounded-full transition-all duration-[6000ms] ease-in-out ${isLoaded ? 'animate-ping-slow' : ''}`}></div>
        <div className={`absolute bottom-40 left-20 w-6 h-6 bg-purple-400/20 rotate-45 transition-all duration-[8000ms] ease-in-out ${isLoaded ? 'animate-float-4' : ''}`}></div>
        <div className={`absolute top-60 left-32 w-3 h-3 bg-cyan-400/20 rounded-full transition-all duration-[7000ms] ease-in-out ${isLoaded ? 'animate-bounce-slow' : ''}`}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {cameFromSearch ? (
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {category ? getCategoryDisplayName(category) : 'Search Results'}
              {searchQuery && (
                <span className="block text-lg font-normal text-gray-600 mt-1">
                  {category ? `in ${getCategoryDisplayName(category)}` : `for "${searchQuery}"`}
                </span>
              )}
              {!searchQuery && !category && 'Search Results'}
            </h1>
            <p className="text-gray-600 text-sm">
              {providers.length > 0
                ? `Found ${providers.length} professional${providers.length === 1 ? '' : 's'} ${category ? `in ${getCategoryDisplayName(category)}` : ''}`
                : `Browse available service providers ${category ? `in ${getCategoryDisplayName(category)}` : ''}`
              }
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm mb-6">
              <HiSparkles className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-semibold text-blue-700">Discover Professional Service Providers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Service Provider
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Connect with verified professionals across Nigeria. From fashion designers in Lagos to event planners in Abuja.
            </p>
          </div>
        )}

        {/* Search Form */}
        {cameFromSearch ? (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Modify your search..."
                    aria-label="Modify search query"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center group"
                      title="Clear search"
                      aria-label="Clear search input"
                    >
                      <HiX className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <HiSearch className="w-4 h-4 mr-2" />
                  Search
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6 transform hover:shadow-2xl transition-all duration-300">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <HiSearch className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 group-hover:scale-110 transform transition-transform duration-200" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-16 pr-12 py-5 text-lg border-0 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] focus:scale-[1.02]"
                    placeholder="Search for services, skills, or names (e.g., 'bag vendor Lagos' or 'wedding planner Abuja')"
                    aria-label="Search for service providers"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center w-10 h-full group hover:bg-gray-50/50 rounded-r-2xl transition-colors duration-200"
                      title="Clear search"
                      aria-label="Clear search input"
                    >
                      <HiX className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                    </button>
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <span className="relative mr-3 text-lg">Search Providers</span>
                    <HiArrowRight className="relative w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
                  </button>
                </div>
              </form>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm font-medium">
                {providers.length > 0 && !loading && `Found ${providers.length} service provider${providers.length === 1 ? '' : 's'}`}
                {!loading && !error && providers.length === 0 && searchQuery && 'No results found. Try different keywords.'}
                {!searchQuery && 'Start by entering your search above.'}
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {loading && (
          <div className="py-16">
            <Loading
              variant="centered"
              size="lg"
              color="blue"
              text="Finding the best service providers for you..."
            />
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <HiExclamation className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="group relative bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  <HiRefresh className="w-4 h-4 mr-2" />
                  Try Again
                </span>
              </button>
            </div>
          </div>
        )}

        {!loading && !error && providers.length === 0 && (searchQuery || category) && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <HiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No providers found</h3>
              <p className="text-gray-600 mb-6">
                {category
                  ? `No providers found in ${getCategoryDisplayName(category)}. Try adjusting your search terms or browse other categories.`
                  : 'Try adjusting your search terms or check for spelling.'
                }
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p><strong>{category ? 'Popular services in this category:' : 'Popular searches:'}</strong></p>
                <div className="flex flex-wrap justify-center gap-2">
                  {category ? (
                    category === 'development' && ['Website Development', 'Web Development', 'Mobile App Development', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'WordPress Developer', 'React Developer'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    )) ||
                    category === 'design' && ['Graphic Design', 'UI/UX Design', 'Logo Design', 'Brand Identity'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    )) ||
                    category === 'marketing' && ['Digital Marketing', 'Social Media Marketing', 'SEO Services', 'Content Marketing'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    )) ||
                    category === 'writing' && ['Content Writing', 'Copywriting', 'Technical Writing', 'Blog Writing'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    )) ||
                    category === 'vendor' && ['Bag Vendor', 'Fashion Vendor', 'Retail Store', 'Wholesale Supplier'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    )) ||
                    category === 'business' && ['Business Consulting', 'Strategy Consulting', 'Startup Consulting', 'Business Planning'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))
                  ) : (
                    ['Bag Vendor Lagos', 'Wedding Planner Abuja', 'Graphic Designer', 'Event Planner'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:border-blue-300 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="space-y-8">
            {!cameFromSearch && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {providers.length} Professional{providers.length === 1 ? '' : 's'} Found
                </h2>
                <p className="text-gray-600">Connect with verified service providers in your area</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers.map((provider, index) => (
                <div
                  key={provider._id}
                  className={`animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SearchResultCard provider={provider} />
                </div>
              ))}
            </div>
          </div>
        )}
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
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SearchResultsDesktop;
