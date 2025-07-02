// components/ui/LoadingSpinner.js
/**
 * Loading Spinner Component
 *
 * Shows loading state with optional text.
 */

import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  text = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`
        ${sizeClasses[size]}
        border-2 ${colorClasses[color]}
        border-t-transparent rounded-full animate-spin
      `} />
      {text && (
        <p className="mt-2 text-sm text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
