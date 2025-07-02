// components/ui/MetricsCard.js
/**
 * Reusable Metrics Card Component
 *
 * Displays financial metrics with proper formatting and visual indicators.
 */

import React from 'react';

const MetricsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null,
  color = 'blue',
  loading = false,
  error = null,
  onClick = null
}) => {
  // Color variants
  const colorClasses = {
    blue: 'border-blue-500/20 bg-blue-900/10',
    green: 'border-green-500/20 bg-green-900/10',
    red: 'border-red-500/20 bg-red-900/10',
    yellow: 'border-yellow-500/20 bg-yellow-900/10',
    purple: 'border-purple-500/20 bg-purple-900/10',
    gray: 'border-gray-500/20 bg-gray-800',
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400',
  };

  const valueColorClasses = {
    blue: 'text-blue-100',
    green: 'text-green-100',
    red: 'text-red-100',
    yellow: 'text-yellow-100',
    purple: 'text-purple-100',
    gray: 'text-white',
  };

  // Handle loading state
  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${colorClasses[color]} animate-pulse`}>
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-5 w-5 bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">{title}</span>
          <div className="h-5 w-5 text-red-400">⚠️</div>
        </div>
        <div className="text-red-400 text-sm">Error loading data</div>
        <div className="text-xs text-gray-500 mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${colorClasses[color]}
        rounded-lg p-6 border
        ${onClick ? 'cursor-pointer hover:bg-gray-700/50 transition-colors' : ''}
        animate-fade-in
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{title}</span>
        {Icon && <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />}
      </div>

      <div className={`text-2xl font-bold ${valueColorClasses[color]} mb-1`}>
        {value}
      </div>

      {subtitle && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{subtitle}</span>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded ${
              trend > 0 ? 'bg-green-900/30 text-green-400' :
              trend < 0 ? 'bg-red-900/30 text-red-400' :
              'bg-gray-700 text-gray-400'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricsCard;
