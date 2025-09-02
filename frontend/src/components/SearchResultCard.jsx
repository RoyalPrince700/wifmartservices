import { Link } from 'react-router-dom';
import { HiStar, HiLocationMarker, HiCurrencyDollar } from 'react-icons/hi';

const SearchResultCard = ({ provider }) => {
  const {
    _id,
    name = 'Unknown',
    title = 'No title provided',
    location = 'Not specified',
    hourlyRate = 0,
    rating = 0,
    skills = [],
    profile_image,
    image,
    isVerified,
    isVerifiedBadge,
    bio = '',
  } = provider;

  // ✅ Debug log to inspect what the backend sends
  console.log("👑 Provider Verified:", name, {
    isVerifiedBadge,
    isVerified,
    verification_status: provider.verification_status,
  });

  // ✅ Normalize fields
  const profileImageSrc =
    profile_image || image || 'https://via.placeholder.com/150?text=Profile';

const verified =
  provider?.isVerifiedBadge === true ||
  provider?.isVerified === true ||
  provider?.verification_status?.toLowerCase() === "approved";
console.log("✅ Verified Check:", {
  name,
  isVerifiedBadge: provider.isVerifiedBadge,
  isVerified: provider.isVerified,
  verification_status: provider.verification_status,
  verified
});


  return (
    <Link to={`/profile/${_id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
        
        {/* Header: Image & Name */}
        <div className="flex p-5 pb-4 gap-4">
          <div className="flex-shrink-0">
            <img
              src={profileImageSrc}
              alt={name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
              </div>

              {/* ✅ Verified Badge */}
              {verified && (
                <span className="flex-shrink-0 ml-2 bg-blue-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>

            {/* Location & Rate */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <HiLocationMarker className="h-4 w-4 mr-1" />
                {location}
              </span>
              <span className="flex items-center">
                <HiCurrencyDollar className="h-4 w-4 mr-1" />
                ${hourlyRate}/hr
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center mt-1">
              <HiStar className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-700">
                {rating?.toFixed(1)}{' '}
                <span className="text-gray-500">(reviews)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bio Preview */}
        {bio && (
          <div className="px-5 pb-4">
            <p className="text-sm text-gray-700 line-clamp-2">{bio}</p>
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
        <div className="px-5 pt-2 pb-5">
          <button className="w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
            View Full Profile →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
