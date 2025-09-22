import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { HiStar, HiLocationMarker, HiCheckCircle, HiArrowRight } from 'react-icons/hi';
import { getFeaturedProviders } from '../services/api';
import AvatarImage from './AvatarImage';

const FeaturedProviders = () => {
  const [allProviders, setAllProviders] = useState([]);
  const [visibleProviders, setVisibleProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  // Initially load 1 provider, then progressively load more
  const INITIAL_LOAD = 1;
  const LOAD_MORE_COUNT = 1;

  useEffect(() => {
    const fetchFeaturedProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedProviders();
        setAllProviders(data);
        // Initially show only first provider
        setVisibleProviders(data.slice(0, INITIAL_LOAD));
        setHasMore(data.length > INITIAL_LOAD);
      } catch (err) {
        console.error('Error fetching featured providers:', err);
        setError('Failed to load featured providers');
        setAllProviders([]);
        setVisibleProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProviders();
  }, []);

  const loadMoreProviders = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const currentCount = visibleProviders.length;
      const nextCount = Math.min(currentCount + LOAD_MORE_COUNT, allProviders.length);

      setVisibleProviders(allProviders.slice(0, nextCount));
      setHasMore(nextCount < allProviders.length);
      setLoadingMore(false);
    }, 500); // Small delay to show loading state
  }, [visibleProviders.length, allProviders, loadingMore, hasMore]);

  const lastProviderRef = useCallback((node) => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProviders();
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMoreProviders]);

  // Format location (similar to SearchResultCard)
  const formatLocation = (provider) => {
    if (provider.location_state && typeof provider.location_state === 'string' && provider.location_state.trim()) {
      return provider.location_state.trim();
    }
    return 'Location not specified';
  };

  // Check verification status
  const isVerified = (provider) => {
    return provider?.isVerifiedBadge === true || provider?.verification_status?.toLowerCase() === "approved";
  };

  // Loading state
  if (loading) {
    return (
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Service Providers</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover top-rated professionals ready to help with your projects
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="flex p-5 pb-4 gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Service Providers</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover top-rated professionals ready to help with your projects
            </p>
          </div>
          <div className="mt-10 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!loading && visibleProviders.length === 0) {
    return (
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Service Providers</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover top-rated professionals ready to help with your projects
            </p>
          </div>
          <div className="mt-10 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-gray-600">No featured providers available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Service Providers</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover top-rated professionals ready to help with your projects
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProviders.map((provider, index) => {
            const {
              _id,
              name = 'Unknown',
              location_state,
              hourlyRate,
              rating,
              skills = [],
              profile_image,
              isVerifiedBadge,
              verification_status,
              experience_pitch = '',
              bio = '',
            } = provider;

            // Derive title from first skill or provide default
            const displayTitle = skills.length > 0 ? skills[0] : 'Service Provider';
            const displayLocation = formatLocation(provider);
            const verified = isVerified(provider);

            return (
              <Link
                key={_id}
                to={`/profile/${_id}`}
                className="block h-full"
                ref={index === visibleProviders.length - 1 ? lastProviderRef : null}
              >
                <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  {/* Header: Image & Name */}
                  <div className="flex p-5 pb-4 gap-4">
                    <div className="flex-shrink-0">
                      <AvatarImage
                        src={profile_image}
                        alt={name}
                        name={name}
                        size="h-16 w-16"
                        className="ring-2 ring-gray-100"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-2">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
                          <p className="text-sm font-medium text-gray-500 truncate">{displayTitle}</p>
                        </div>

                        {/* Verified Badge */}
                        {verified && (
                          <HiCheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>

                      {/* Location */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <HiLocationMarker className="h-4 w-4 mr-1" />
                          {displayLocation}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mt-1">
                        <HiStar className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-700">
                          {(rating || 3.5).toFixed(1)}{' '}
                          <span className="text-gray-500">(reviews)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio/Experience Preview */}
                  {(bio || experience_pitch) && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {experience_pitch || bio}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="px-5 pb-5">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="px-5 pt-2 pb-5 mt-auto">
                    <button className="w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                      View Full Profile →
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Loading skeletons for lazy loading */}
          {loadingMore && (
            [...Array(LOAD_MORE_COUNT)].map((_, index) => (
              <div key={`loading-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="flex p-5 pb-4 gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                {/* Bio section skeleton */}
                <div className="px-5 pb-4">
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                </div>
                {/* Skills section skeleton */}
                <div className="px-5 pb-5">
                  <div className="flex gap-2 mt-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                  </div>
                </div>
                {/* CTA button skeleton */}
                <div className="px-5 pt-2 pb-5">
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/browse-categories"
            className="group relative inline-flex items-center px-8 py-4 border-2 border-gray-300 shadow-lg text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <span className="relative">Browse All Providers</span>
            <HiArrowRight className="relative ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            <div className="absolute inset-0 rounded-xl bg-gray-400/10 scale-0 group-active:scale-100 transition-transform duration-150"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;