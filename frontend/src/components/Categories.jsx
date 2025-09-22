import React, { useState, useEffect } from 'react';
import { HiCode, HiPencilAlt, HiPhotograph, HiMusicNote, HiAcademicCap, HiBriefcase, HiShoppingBag, HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { getCategoryCounts } from '../services/api';
import Loading from './Loading';

const Categories = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Static category definitions (6 categories as requested)
  const categories = [
    {
      id: 'development',
      name: 'Development & IT',
      icon: <HiCode className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      status: 'available' // Available with website development included
    },
    {
      id: 'design',
      name: 'Design & Creative',
      icon: <HiPencilAlt className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      status: 'available' // Available
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: <HiPhotograph className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      status: 'available' // Available
    },
    {
      id: 'writing',
      name: 'Writing & Translation',
      icon: <HiMusicNote className="h-8 w-8" />,
      color: 'bg-yellow-100 text-yellow-600',
      status: 'available' // Available
    },
    {
      id: 'vendor',
      name: 'Vendors & Retail',
      icon: <HiShoppingBag className="h-8 w-8" />,
      color: 'bg-orange-100 text-orange-600',
      status: 'available' // Available
    },
    {
      id: 'business',
      name: 'Business Consulting',
      icon: <HiBriefcase className="h-8 w-8" />,
      color: 'bg-indigo-100 text-indigo-600',
      status: 'available' // Available
    },
  ];

  // Fetch category counts on component mount
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const counts = await getCategoryCounts();
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Failed to fetch category counts:', error);
        // Set default counts if API fails
        const defaultCounts = {
          development: 0,
          design: 0,
          marketing: 0,
          writing: 0,
          vendor: 0,
          business: 0
        };
        setCategoryCounts(defaultCounts);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  // Format count display (text only)
  const formatCount = (count) => {
    return `${count || 0} provider${count === 1 ? '' : 's'}`;
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Browse by Category</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
            Find the right service for your needs from our diverse categories
          </p>
        </div>

        <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={category.status === 'available' ? () => handleCategoryClick(category.id) : undefined}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                category.status === 'available'
                  ? 'cursor-pointer hover:shadow-lg hover:translate-y-1'
                  : 'cursor-not-allowed opacity-75'
              }`}
            >
              <div className="p-4 sm:p-6 relative">
                {/* Status Badge */}
                {category.status === 'development' && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Under Development
                    </span>
                  </div>
                )}
                {category.status === 'coming-soon' && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Mobile: horizontal layout (icon left, content right) */}
                {/* Desktop: vertical layout (icon top, content below) */}
                <div className="flex flex-row sm:flex-col items-start sm:items-center gap-3 sm:gap-0">
                  <div className={`rounded-lg p-2 sm:p-3 inline-flex flex-shrink-0 ${category.color} ${
                    category.status !== 'available' ? 'grayscale' : ''
                  }`}>
                    <div className="w-6 h-6 sm:w-8 sm:h-8">
                      {React.cloneElement(category.icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 sm:text-center">
                    <h3 className={`text-base sm:text-lg font-medium ${
                      category.status === 'available' ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {category.name}
                    </h3>
                    {category.status === 'available' ? (
                      loading ? (
                        <div className="mt-1 text-sm text-gray-500">
                          <Loading variant="spinner" size="xs" color="blue" />
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          {formatCount(categoryCounts[category.id])}
                        </p>
                      )
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">Coming Soon</p>
                    )}
                    <div className="mt-2 sm:mt-3">
                      <span className={`text-sm font-medium ${
                        category.status === 'available'
                          ? 'text-blue-600 hover:text-blue-800'
                          : 'text-gray-400'
                      }`}>
                        {category.status === 'available'
                          ? 'Browse services →'
                          : 'Not Available Yet'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-10 text-center">
          <button
            onClick={() => navigate('/browse-categories')}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse All Categories
            <HiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;