
import { Link } from 'react-router-dom';
import { HiStar, HiLocationMarker, HiCurrencyDollar, HiCheckCircle } from 'react-icons/hi';

const SearchResultCard = ({ provider }) => {
  const {
    _id,
    name = 'Unknown',
    location,
    location_state, // ✅ This is the main location field from backend
    city,
    state,
    country,
    address,
    physical_address,
    hourlyRate = 0,
    rating = 0,
    skills = [],
    profile_image,
    image,
    isVerified,
    isVerifiedBadge,
    bio = '',
    experience_pitch = '',
  } = provider;

  // ✅ Derive title from first skill or provide default
  const displayTitle = skills.length > 0 ? skills[0] : 'Service Provider';

  // ✅ Debug log to inspect location data
  console.log("📍 Provider Location Debug:", name, {
    rawLocation: provider.location,
    locationState: location_state,
    locationType: typeof provider.location,
    locationString: location,
    individualFields: { city, state, country, address, physical_address },
    providerKeys: Object.keys(provider)
  });


  // ✅ Format location properly
  const formatLocation = () => {
    // ✅ Priority 1: location_state (main backend field)
    if (location_state && typeof location_state === 'string' && location_state.trim()) {
      return location_state.trim();
    }

    // ✅ Priority 2: Main location field
    if (location) {
      if (typeof location === 'string' && location.trim()) {
        return location.trim();
      }

      // If location is an object
      if (typeof location === 'object') {
        const { city: locCity, state: locState, country: locCountry, address: locAddress } = location;

        if (locCity && locState && locCountry) {
          return `${locCity}, ${locState}, ${locCountry}`;
        } else if (locCity && locCountry) {
          return `${locCity}, ${locCountry}`;
        } else if (locState && locCountry) {
          return `${locState}, ${locCountry}`;
        } else if (locCity && locState) {
          return `${locCity}, ${locState}`;
        } else if (locCity) {
          return locCity;
        } else if (locState) {
          return locState;
        } else if (locCountry) {
          return locCountry;
        } else if (locAddress) {
          return locAddress;
        }
      }
    }

    // ✅ Priority 3: Individual location fields
    if (city && state && country) {
      return `${city}, ${state}, ${country}`;
    } else if (city && country) {
      return `${city}, ${country}`;
    } else if (state && country) {
      return `${state}, ${country}`;
    } else if (city && state) {
      return `${city}, ${state}`;
    } else if (city) {
      return city;
    } else if (state) {
      return state;
    } else if (country) {
      return country;
    } else if (address) {
      return address;
    } else if (physical_address) {
      return physical_address;
    }

    return 'Location not specified';
  };

  const displayLocation = formatLocation();

  // ✅ Debug final result
  console.log("📍 Final Location Result:", name, {
    displayLocation: displayLocation
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
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
                <p className="text-sm font-medium text-gray-500 truncate">{displayTitle}</p>
              </div>

              {/* ✅ Verified Badge */}
              {verified && (
                <HiCheckCircle className="h-5 w-5 text-blue-500 ml-1 flex-shrink-0" />
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
