import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiCode, HiPencilAlt, HiPhotograph, HiMusicNote,
  HiBriefcase, HiShoppingBag, HiFilter, HiSearch,
  HiLocationMarker, HiStar, HiCheckCircle, HiChevronDown
} from 'react-icons/hi';
import { getFeaturedProviders, getCategoryCounts, searchProviders } from '../services/api';

const BrowseCategoriesDesktop = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Category definitions
  const categories = [
    {
      id: 'development',
      name: 'Development & IT',
      icon: <HiCode className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
      description: 'Web, mobile & software development'
    },
    {
      id: 'design',
      name: 'Design & Creative',
      icon: <HiPencilAlt className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
      description: 'Graphic design, UI/UX, branding'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: <HiPhotograph className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
      description: 'Digital marketing, SEO, advertising'
    },
    {
      id: 'writing',
      name: 'Writing & Translation',
      icon: <HiMusicNote className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Content writing, copywriting, translation'
    },
    {
      id: 'vendor',
      name: 'Vendors & Retail',
      icon: <HiShoppingBag className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600',
      description: 'Product vendors, retail services'
    },
    {
      id: 'business',
      name: 'Business Consulting',
      icon: <HiBriefcase className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Business advisors, strategy consultants'
    }
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providersData, countsData] = await Promise.all([
          getFeaturedProviders(),
          getCategoryCounts()
        ]);

        setProviders(providersData);
        setCategoryCounts(countsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Set fallback data
        setProviders([]);
        setCategoryCounts({
          development: 0,
          design: 0,
          marketing: 0,
          writing: 0,
          vendor: 0,
          business: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get providers for specific category
  const getProvidersByCategory = (categoryId) => {
    // For now, return a subset of all providers (we'll improve this with backend filtering later)
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    const startIndex = categoryIndex * 2; // Distribute providers across categories
    return providers.slice(startIndex, startIndex + 4); // Show 4 providers per category
  };

  // Filter providers based on search and filters
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = !searchQuery ||
      provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || getProvidersByCategory(selectedCategory).includes(provider);
    const matchesLocation = !selectedLocation || provider.location_state?.includes(selectedLocation);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Sort providers
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name?.localeCompare(b.name) || 0;
      case 'location':
        return a.location_state?.localeCompare(b.location_state) || 0;
      default:
        return 0;
    }
  });

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse All Categories</h1>
              <p className="mt-2 text-gray-600">Discover service providers across all categories</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <HiFilter className="w-5 h-5 mr-2" />
              Filters
              <HiChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Location Filter */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Kano">Kano</option>
                  <option value="Ibadan">Ibadan</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name</option>
                  <option value="location">Sort by Location</option>
                </select>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {sortedProviders.length} provider{sortedProviders.length !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryProviders = getProvidersByCategory(category.id);
              const providerCount = categoryCounts[category.id] || 0;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        {category.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        {providerCount} providers
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>

                    {/* Top providers in this category */}
                    {categoryProviders.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-700">Top providers:</p>
                        {categoryProviders.slice(0, 2).map((provider) => (
                          <div key={provider._id} className="flex items-center space-x-2">
                            <img
                              src={provider.profile_image || 'https://via.placeholder.com/32x32?text=P'}
                              alt={provider.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600 truncate">{provider.name}</span>
                            {provider.isVerifiedBadge && (
                              <HiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className="w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      Browse {category.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Providers Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Service Providers</h2>
            <Link
              to="/search"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Advanced Search →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders.map((provider) => {
                const {
                  _id,
                  name = 'Unknown',
                  location_state,
                  skills = [],
                  profile_image,
                  isVerifiedBadge,
                  verification_status,
                  rating
                } = provider;

                const displayTitle = skills.length > 0 ? skills[0] : 'Service Provider';
                const verified = isVerifiedBadge || verification_status?.toLowerCase() === "approved";

                return (
                  <Link
                    key={_id}
                    to={`/profile/${_id}`}
                    className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={profile_image || 'https://via.placeholder.com/48x48?text=P'}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
                          {verified && <HiCheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{displayTitle}</p>
                        {location_state && (
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <HiLocationMarker className="w-4 h-4 mr-1" />
                            <span className="truncate">{location_state}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <HiStar className="w-4 h-4 text-yellow-400" />
                                                  <span className="text-sm text-gray-600">
                            {(rating || 3.5).toFixed(1)}
                          </span>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">View Profile →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {sortedProviders.length === 0 && !loading && (
            <div className="text-center py-12">
              <HiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCategoriesDesktop;
