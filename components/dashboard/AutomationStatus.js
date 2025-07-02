// components/dashboard/AutomationStatus.js
/**
 * Automation Status Component
 *
 * Shows DBS transfer status and next automation steps.
 */

import React from 'react';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { AUTOMATION_STATUS } from '../../lib/data/portfolioData.js';

const AutomationStatus = ({ loading = false }) => {
  const { dbs_transfer, ibkr_dca } = AUTOMATION_STATUS;

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4 w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20">
      <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5" />
        Automation Status
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DBS Transfer Status */}
        <div className={`
          p-4 rounded border transition-colors
          ${dbs_transfer.active
            ? 'bg-green-900/20 border-green-500/20'
            : 'bg-red-900/20 border-red-500/20'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            {dbs_transfer.active ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <h4 className={`font-medium ${
              dbs_transfer.active ? 'text-green-400' : 'text-red-400'
            }`}>
              DBS → IBKR Transfer
            </h4>
          </div>

          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex items-center gap-2">
              {dbs_transfer.active ? (
                <CheckCircle className="h-3 w-3 text-green-400" />
              ) : (
                <AlertCircle className="h-3 w-3 text-red-400" />
              )}
              SGD {dbs_transfer.amount.toLocaleString()} monthly on 30th
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Last transfer: {dbs_transfer.lastTransfer}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Status: {dbs_transfer.status}
            </div>
          </div>
        </div>

        {/* IBKR Auto-Buy Status */}
        <div className={`
          p-4 rounded border transition-colors
          ${ibkr_dca.active
            ? 'bg-green-900/20 border-green-500/20'
            : 'bg-blue-900/20 border-blue-500/20'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            {ibkr_dca.active ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <Clock className="h-5 w-5 text-blue-400" />
            )}
            <h4 className={`font-medium ${
              ibkr_dca.active ? 'text-green-400' : 'text-blue-400'
            }`}>
              Next: IBKR Auto-Buy
            </h4>
          </div>

          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-400" />
              Set up recurring {ibkr_dca.target} purchase
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-blue-400" />
              Target: Boost Core Growth allocation
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              Perfect timing for DCA strategy
            </div>
          </div>

          {/* Priority Badge */}
          {ibkr_dca.priority === 'high' && (
            <div className="mt-2 inline-block px-2 py-1 bg-orange-900/30 border border-orange-500/20 rounded text-xs text-orange-400">
              High Priority
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
        <h4 className="font-medium text-blue-400 mb-2">Recommended Next Steps</h4>
        <ol className="text-sm text-gray-300 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-blue-400">1.</span>
            Log into IBKR and set up recurring VUAA purchase
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-400">2.</span>
            Configure automatic investment of monthly transfers
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-400">3.</span>
            Monitor and adjust allocation quarterly
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AutomationStatus;
