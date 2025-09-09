import React from 'react';

// Reusable Loading Component with multiple variants
const Loading = ({
  variant = 'spinner',
  size = 'md',
  color = 'blue',
  text = '',
  fullScreen = false,
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color configurations
  const colorConfig = {
    blue: 'text-blue-500',
    white: 'text-white',
    gray: 'text-gray-500',
    green: 'text-green-500',
    purple: 'text-purple-500'
  };

  // Base spinner component
  const Spinner = () => (
    <div
      className={`${sizeConfig[size]} ${colorConfig[color]} ${className}`}
      role="status"
    >
      <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Skeleton loading component
  const Skeleton = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Pulse dots component
  const Dots = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  // Card skeleton for content loading
  const CardSkeleton = () => (
    <div className={`animate-pulse bg-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  // Render different variants
  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner />;
      case 'skeleton':
        return <Skeleton />;
      case 'dots':
        return <Dots />;
      case 'card':
        return <CardSkeleton />;
      default:
        return <Spinner />;
    }
  };

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          {renderVariant()}
          {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }

  // Centered container
  if (variant === 'centered') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          {renderVariant()}
          {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }

  // Inline with text
  if (text) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {renderVariant()}
        <span className="text-gray-600">{text}</span>
      </div>
    );
  }

  // Default render
  return renderVariant();
};

export default Loading;
