// components/portfolio/HealthAlerts.js
/**
 * Portfolio Health Alerts Component
 *
 * Displays portfolio health issues and recommended actions.
 */

import React from 'react';
import { AlertCircle, TrendingDown, Shield } from 'lucide-react';
import Alert from '../ui/Alert.js';

const HealthAlerts = ({
  healthIssues = [],
  loading = false,
  onTakeAction = null
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // No issues - show positive message
  if (healthIssues.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Portfolio Health: Good</h3>
        </div>
        <p className="text-gray-300">
          Your portfolio allocation is within target ranges. No immediate action required.
        </p>
      </div>
    );
  }

  // Group issues by severity
  const urgentIssues = healthIssues.filter(issue => issue.type === 'URGENT');
  const mediumIssues = healthIssues.filter(issue => issue.type === 'MEDIUM');

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-red-500/20">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="h-6 w-6 text-red-400" />
        <h3 className="text-lg font-semibold text-red-400">
          Portfolio Health Alerts ({healthIssues.length})
        </h3>
      </div>

      <div className="space-y-4">
        {/* Urgent Issues */}
        {urgentIssues.map((issue, index) => (
          <Alert
            key={`urgent-${index}`}
            type="error"
            title={issue.message}
            message={`Recommended action: ${issue.action}`}
          />
        ))}

        {/* Medium Issues */}
        {mediumIssues.map((issue, index) => (
          <Alert
            key={`medium-${index}`}
            type="warning"
            title={issue.message}
            message={`Suggested action: ${issue.action}`}
          />
        ))}
      </div>

      {/* Action Buttons */}
      {onTakeAction && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {urgentIssues.map((issue, index) => (
              <button
                key={`action-${index}`}
                onClick={() => onTakeAction(issue)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
              >
                Fix: {issue.category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthAlerts;
