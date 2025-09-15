import { useState } from 'react';
import { HiUser } from 'react-icons/hi';

// Reusable Avatar Component with Error Handling
const AvatarImage = ({ src, alt, name, size = "h-16 w-16", className = "", onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500'
  ];

  const getColor = (name) => {
    if (!name) return 'bg-gray-500';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (imageError || !src) {
    return (
      <div
        className={`${size} rounded-full ${getColor(name)} flex items-center justify-center text-white font-semibold text-lg ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={onClick}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`${size} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={onClick}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <HiUser className="h-6 w-6 text-gray-400" />
        </div>
      )}
      <img
        className={`${size} rounded-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default AvatarImage;
