// components/portfolio/PortfolioMetrics.js
/**
 * Portfolio Metrics Display Component
 *
 * Shows key portfolio metrics with proper formatting and visual indicators.
 */

import React from 'react';
import { DollarSign, Target, TrendingUp, PieChart } from 'lucide-react';
import MetricsCard from '../ui/MetricsCard.js';
import { formatCurrency } from '../../lib/utils/currency.js';
import { calculateFIProgress } from '../../lib/utils/calculations.js';
import { PORTFOLIO_CONFIG } from '../../lib/data/config.js';

const PortfolioMetrics = ({
  portfolio,
  total,
  metrics,
  currency = 'SGD',
  loading = false
}) => {
  // Calculate FI progress
  const leanFI = calculateFIProgress(total, PORTFOLIO_CONFIG.targets.lean);
  const fullFI = calculateFIProgress(total, PORTFOLIO_CONFIG.targets.full);
  const passiveMonthly = (total * PORTFOLIO_CONFIG.withdrawalRate) / 12;

  // Error handling
  if (!portfolio && !loading) {
    return (
      <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/20">
        <p className="text-red-400">Error: Portfolio data not available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Portfolio Value */}
      <MetricsCard
        title="Total Portfolio"
        value={formatCurrency(total, currency)}
        subtitle={`${leanFI.percentage.toFixed(1)}% to Lean FI`}
        icon={DollarSign}
        color="blue"
        loading={loading}
        trend={metrics.cagr ? Number(metrics.cagr.toFixed(1)) : null}
      />

      {/* Monthly Passive Income */}
      <MetricsCard
        title="Passive Monthly"
        value={formatCurrency(passiveMonthly, currency)}
        subtitle="4% withdrawal rule"
        icon={Target}
        color="green"
        loading={loading}
      />

      {/* Lean FI Progress */}
      <MetricsCard
        title="Lean FI Progress"
        value={`${leanFI.percentage.toFixed(1)}%`}
        subtitle={formatCurrency(PORTFOLIO_CONFIG.targets.lean, currency) + ' target'}
        icon={Target}
        color="green"
        loading={loading}
      />

      {/* Full FI Progress */}
      <MetricsCard
        title="Full FI Progress"
        value={`${fullFI.percentage.toFixed(1)}%`}
        subtitle={formatCurrency(PORTFOLIO_CONFIG.targets.full, currency) + ' target'}
        icon={TrendingUp}
        color="purple"
        loading={loading}
      />
    </div>
  );
};

export default EditModal; PortfolioMetrics;
