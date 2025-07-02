// components/dashboard/Header.js
/**
 * Dashboard Header Component
 *
 * Contains title, currency selector, and action buttons.
 */

import React from 'react';
import { Globe, Brain, Eye, Download, Settings } from 'lucide-react';

const Header = ({
  currency,
  onCurrencyChange,
  onUpdateClick,
  onAICoachClick,
  onExportClick,
  loading = false
}) => {
  const currencies = [
    { code: 'SGD', label: 'SGD' },
    { code: 'USD', label: 'USD' },
    { code: 'INR', label: 'INR' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Investment Command Center</h1>
        <p className="text-gray-400">
          v2.0 • Clean Architecture • Real Historical Data (2018-2025)
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Currency Selector */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
          <Globe className="h-4 w-4 text-gray-400" />
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none"
            disabled={loading}
          >
            {currencies.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center transition-colors"
          title="Export portfolio data"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>

        {/* AI Coach Button */}
        <button
          onClick={onAICoachClick}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center transition-colors"
          title="Get AI-powered portfolio analysis"
        >
          <Brain className="h-4 w-4 mr-2" />
          AI Coach
        </button>

        {/* Update Button */}
        <button
          onClick={onUpdateClick}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center transition-colors"
          title="Update portfolio values"
        >
          <Eye className="h-4 w-4 mr-2" />
          Update
        </button>
      </div>
    </div>
  );
};

export default Header;
