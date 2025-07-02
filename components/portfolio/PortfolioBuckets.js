// components/portfolio/PortfolioBuckets.js
/**
 * Portfolio Buckets Display Component
 *
 * Shows the four-bucket allocation with target comparisons.
 */

import React from 'react';
import { PORTFOLIO_BUCKETS } from '../../lib/data/portfolioData.js';
import { PORTFOLIO_CONFIG } from '../../lib/data/config.js';
import { formatCurrency } from '../../lib/utils/currency.js';
import { calculateAllocations } from '../../lib/utils/calculations.js';
import ProgressBar from '../ui/ProgressBar.js';

const PortfolioBuckets = ({
  portfolio,
  total,
  currency = 'SGD',
  loading = false
}) => {
  // Calculate current allocations
  const allocations = calculateAllocations(portfolio);
  const targets = PORTFOLIO_CONFIG.targets;

  // Bucket status helper
  const getBucketStatus = (current, target) => {
    const percent = (current / target) * 100;
    if (percent >= 95 && percent <= 105) return { color: 'green', status: 'On Target' };
    if (percent >= 80 && percent <= 120) return { color: 'yellow', status: 'Close' };
    return { color: 'red', status: 'Off Target' };
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Portfolio Buckets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-700 rounded-lg p-4 border border-gray-600 animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-6 bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-6">Portfolio Buckets</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(PORTFOLIO_BUCKETS).map(([key, bucket]) => {
          const currentValue = portfolio[key] || 0;
          const targetValue = targets[key] || 0;
          const status = getBucketStatus(currentValue, targetValue);
          const allocationPercent = allocations[key] || 0;
          const targetPercent = (targetValue / targets.lean) * 100; // Rough target %

          return (
            <div
              key={key}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium text-${bucket.color}-400`}>
                  {bucket.name}
                </h4>
                <span className={`
                  text-xs px-2 py-1 rounded
                  ${status.color === 'green' ? 'bg-green-900/30 text-green-400' :
                    status.color === 'yellow' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'}
                `}>
                  {status.status}
                </span>
              </div>

              {/* Current Value */}
              <div className="text-xl font-bold text-white mb-1">
                {formatCurrency(currentValue, currency)}
              </div>

              {/* Target and Progress */}
              <div className="text-sm text-gray-400 mb-3">
                Target: {formatCurrency(targetValue, currency)}
              </div>

              {/* Progress Bar */}
              <ProgressBar
                value={currentValue}
                max={targetValue}
                color={bucket.color}
                size="small"
                showPercentage={false}
              />

              {/* Allocation Percentage */}
              <div className="mt-2 text-xs text-gray-500">
                {allocationPercent.toFixed(1)}% of portfolio
              </div>

              {/* Risk Level */}
              <div className="mt-2">
                <span className="text-xs text-gray-400">
                  Risk: {bucket.riskLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
        <h4 className="font-medium text-white mb-2">Allocation Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {Object.entries(allocations).map(([key, percent]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-400 capitalize">{key}:</span>
              <span className="text-white">{percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuckets;
