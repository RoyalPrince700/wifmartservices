import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiCode, HiPencilAlt, HiPhotograph, HiMusicNote,
  HiBriefcase, HiShoppingBag, HiFilter, HiSearch,
  HiLocationMarker, HiStar, HiCheckCircle, HiChevronDown,
  HiX, HiArrowRight
} from 'react-icons/hi';
import { getAllProviders, getCategoryCounts } from '../services/api';

const BrowseCategoriesMobile = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'all'

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
          getAllProviders(),
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
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    const startIndex = categoryIndex * 2;
    return providers.slice(startIndex, startIndex + 3); // Show 3 providers per category on mobile
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
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white shadow-sm border-b z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Browse Categories</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <HiFilter className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'categories'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              All Providers
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name</option>
                  <option value="location">Sort by Location</option>
                </select>

                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">
                    {sortedProviders.length} provider{sortedProviders.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {activeTab === 'categories' ? (
          /* Categories Tab */
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h2>
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryProviders = getProvidersByCategory(category.id);
                const providerCount = categoryCounts[category.id] || 0;

                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          {category.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {providerCount} providers
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>

                      {/* Top providers in this category */}
                      {categoryProviders.length > 0 && (
                        <div className="space-y-2 mb-3">
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
                        className="w-full text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        Browse Category
                        <HiArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* All Providers Tab */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">All Providers</h2>
              <Link
                to="/search"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Advanced Search →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
              <div className="space-y-4">
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
                      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={profile_image || 'https://via.placeholder.com/48x48?text=P'}
                          alt={name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
                            {verified && <HiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{displayTitle}</p>
                          {location_state && (
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <HiLocationMarker className="w-3 h-3 mr-1" />
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
              <div className="text-center py-8">
                <HiSearch className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCategoriesMobile;
