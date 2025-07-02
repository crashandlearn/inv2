// components/dashboard/HistoricalJourney.js
/**
 * Historical Journey Component
 *
 * Displays the real wealth-building journey from 2018-2025.
 */

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Award } from 'lucide-react';
import { formatCurrency } from '../../lib/utils/currency.js';
import { getHistoricalMetrics } from '../../lib/data/historicalData.js';
import MetricsCard from '../ui/MetricsCard.js';

const HistoricalJourney = ({
  historicalData,
  currency = 'SGD',
  loading = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate metrics
  const metrics = getHistoricalMetrics();

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Banner */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-500/20">
        <h3 className="text-lg font-semibold text-green-400 mb-4">
          Real Wealth Building Performance (2018-2025)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {metrics.cagr.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">CAGR (2018-2025)</div>
            <div className="text-xs text-gray-400">{metrics.totalYears} year track record</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-blue-400">
              {formatCurrency(metrics.totalGains, currency)}
            </div>
            <div className="text-sm text-gray-300">Total Market Gains</div>
            <div className="text-xs text-gray-400">Real compound growth</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-purple-400">
              {formatCurrency(metrics.totalSaved, currency)}
            </div>
            <div className="text-sm text-gray-300">Total Saved</div>
            <div className="text-xs text-gray-400">Your actual discipline</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-orange-400">
              {metrics.overallReturn.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Return on Saved Capital</div>
            <div className="text-xs text-gray-400">Outperforming benchmarks</div>
          </div>
        </div>

        {/* Recovery Story */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <div className="text-sm text-gray-300">
            <strong className="text-yellow-400">Recovery Story:</strong>
            Peak {formatCurrency(metrics.peakNetWorth, currency)} (2021) →
            Low {formatCurrency(346000, currency)} (2022) →
            Current {formatCurrency(historicalData[historicalData.length - 1].networth, currency)}
            <span className="text-green-400 ml-2">
              (+{metrics.recoveryFromPeak.toFixed(1)}% recovery)
            </span>
          </div>
        </div>
      </div>

      {/* Historical Journey */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Your Real Wealth Journey (2018-2025)</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Year Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {historicalData.map((entry, index) => {
            const isCurrentYear = entry.year === 2025;
            const gains = entry.networth - entry.totalSaved;

            return (
              <div
                key={entry.year}
                className={`
                  text-center p-3 rounded border transition-all hover:scale-105
                  ${isCurrentYear
                    ? 'bg-blue-700/20 border-blue-500'
                    : 'bg-gray-700 border-gray-600'
                  }
                `}
              >
                <div className={`text-lg font-bold ${isCurrentYear ? 'text-blue-400' : 'text-blue-400'}`}>
                  {entry.year}
                </div>

                <div className="text-sm text-white mb-1">
                  {formatCurrency(entry.networth, currency)}
                </div>

                {showDetails && (
                  <>
                    <div className="text-xs text-gray-400">
                      Saved: {formatCurrency(entry.totalSaved, currency)}
                    </div>
                    <div className="text-xs text-green-400">
                      Gains: {formatCurrency(gains, currency)}
                    </div>
                    <div className="text-xs text-purple-400">
                      Annual: {formatCurrency(entry.annualSavings, currency)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      entry.gainsPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.gainsPercentage >= 0 ? '+' : ''}{entry.gainsPercentage.toFixed(1)}%
                    </div>
                  </>
                )}

                <div className="text-xs text-gray-500 mt-1 leading-tight">
                  {entry.notes}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Insights */}
        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <h4 className="font-medium text-white mb-2">Key Journey Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-400">Best Year:</span> {metrics.bestYear.year} with {metrics.bestYear.gainsPercentage.toFixed(1)}% gains
            </div>
            <div>
              <span className="text-red-400">Worst Year:</span> {metrics.worstYear.year} with {metrics.worstYear.gainsPercentage.toFixed(1)}% loss
            </div>
            <div>
              <span className="text-purple-400">Peak Value:</span> {formatCurrency(metrics.peakNetWorth, currency)} (2021)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalJourney;
