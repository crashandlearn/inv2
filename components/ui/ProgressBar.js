// components/ui/ProgressBar.js
/**
 * Progress Bar Component
 *
 * Displays progress with animations and color coding.
 */

import React from 'react';

const ProgressBar = ({
  value,
  max = 100,
  label = '',
  color = 'blue',
  size = 'medium',
  showPercentage = true,
  animated = true
}) => {
  // Calculate percentage
  const percentage = Math.min((value / max) * 100, 100);

  // Size variants
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4',
  };

  // Color variants
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}

      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`
            ${colorClasses[color]}
            ${sizeClasses[size]}
            rounded-full
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
