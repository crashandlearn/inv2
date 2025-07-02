// lib/utils/calculations.js
/**
 * Portfolio Calculation Utilities
 * 
 * Pure functions for portfolio calculations.
 * All functions are stateless and testable.
 */

/**
 * Calculate total portfolio value from components
 * @param {Object} portfolio - Portfolio object with core, growth, crypto, hedge
 * @returns {number} Total portfolio value
 */
export const calculatePortfolioTotal = (portfolio) => {
  if (!portfolio || typeof portfolio !== 'object') {
    throw new Error('Portfolio must be a valid object');
  }
  
  const { core = 0, growth = 0, crypto = 0, hedge = 0 } = portfolio;
  
  // Validate all values are numbers
  [core, growth, crypto, hedge].forEach((value, index) => {
    if (typeof value !== 'number' || isNaN(value)) {
      const keys = ['core', 'growth', 'crypto', 'hedge'];
      throw new Error(`Invalid value for ${keys[index]}: ${value}`);
    }
  });
  
  return core + growth + crypto + hedge;
};

/**
 * Calculate compound annual growth rate (CAGR)
 * @param {number} startValue - Starting value
 * @param {number} endValue - Ending value  
 * @param {number} years - Number of years
 * @returns {number} CAGR as percentage
 */
export const calculateCAGR = (startValue, endValue, years) => {
  if (startValue <= 0 || endValue <= 0 || years <= 0) {
    throw new Error('All values must be positive for CAGR calculation');
  }
  
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};

/**
 * Calculate portfolio allocation percentages
 * @param {Object} portfolio - Portfolio object
 * @returns {Object} Allocation percentages
 */
export const calculateAllocations = (portfolio) => {
  const total = calculatePortfolioTotal(portfolio);
  
  if (total === 0) {
    return { core: 0, growth: 0, crypto: 0, hedge: 0 };
  }
  
  return {
    core: (portfolio.core / total) * 100,
    growth: (portfolio.growth / total) * 100,
    crypto: (portfolio.crypto / total) * 100,
    hedge: (portfolio.hedge / total) * 100,
  };
};

/**
 * Calculate Financial Independence progress
 * @param {number} currentValue - Current portfolio value
 * @param {number} targetValue - FI target value
 * @returns {Object} Progress metrics
 */
export const calculateFIProgress = (currentValue, targetValue) => {
  if (targetValue <= 0) {
    throw new Error('Target value must be positive');
  }
  
  const progress = (currentValue / targetValue) * 100;
  const remaining = targetValue - currentValue;
  const monthlyPassive = (currentValue * 0.04) / 12; // 4% withdrawal rule
  
  return {
    percentage: Math.min(progress, 100), // Cap at 100%
    remaining: Math.max(remaining, 0),   // Never negative
    monthlyPassive,
    yearsToTarget: remaining > 0 ? remaining / (currentValue * 0.07) : 0, // Assume 7% growth
  };
};

/**
 * Calculate portfolio health metrics
 * @param {Object} portfolio - Portfolio object
 * @param {Object} thresholds - Health threshold configuration
 * @returns {Array} Array of health issues
 */
export const calculatePortfolioHealth = (portfolio, thresholds) => {
  const allocations = calculateAllocations(portfolio);
  const total = calculatePortfolioTotal(portfolio);
  const issues = [];
  
  // Check cash position
  if (allocations.hedge > thresholds.cashMax) {
    issues.push({
      type: 'URGENT',
      category: 'cash_drag',
      message: `Cash position: ${allocations.hedge.toFixed(1)}% (target: ${thresholds.cashMax}%)`,
      action: `Deploy ${((allocations.hedge - 15) * total / 100).toFixed(0)} SGD`,
      priority: 1,
      impact: 'high',
    });
  }
  
  // Check individual stock concentration
  if (allocations.growth > thresholds.growthMax) {
    issues.push({
      type: 'MEDIUM',
      category: 'concentration_risk', 
      message: `Single stocks: ${allocations.growth.toFixed(1)}% (target: ${thresholds.growthMax}%)`,
      action: `Trim ${((allocations.growth - thresholds.growthMax) * total / 100).toFixed(0)} SGD`,
      priority: 2,
      impact: 'medium',
    });
  }
  
  // Check crypto allocation
  if (allocations.crypto > thresholds.cryptoMax) {
    issues.push({
      type: 'MEDIUM',
      category: 'crypto_overweight',
      message: `Crypto position: ${allocations.crypto.toFixed(1)}% (target: 15%)`,
      action: `Reduce crypto exposure by ${((allocations.crypto - 15) * total / 100).toFixed(0)} SGD`,
      priority: 2,
      impact: 'medium',
    });
  }
  
  return issues.sort((a, b) => a.priority - b.priority);
};

/**
 * Calculate real portfolio metrics from historical data
 * @param {number} currentTotal - Current portfolio total
 * @param {Array} historicalData - Historical data array
 * @returns {Object} Comprehensive metrics
 */
export const calculateRealMetrics = (currentTotal, historicalData) => {
  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    throw new Error('Historical data must be a non-empty array');
  }
  
  const latest = historicalData[historicalData.length - 1];
  const first = historicalData[0];
  const years = latest.year - first.year;
  
  // Calculate totals
  const totalSaved = latest.totalSaved;
  const actualGains = currentTotal - totalSaved;
  const gainsPercentage = (actualGains / totalSaved) * 100;
  
  // Calculate CAGR using actual performance
  const cagr = calculateCAGR(first.annualSavings, currentTotal, years);
  
  // Find peak and recovery
  const peakEntry = historicalData.reduce((peak, current) => 
    current.networth > peak.networth ? current : peak
  );
  const recoveryFromPeak = ((currentTotal - peakEntry.networth) / peakEntry.networth) * 100;
  
  return {
    totalSaved,
    actualGains,
    gainsPercentage,
    cagr,
    years,
    peakValue: peakEntry.networth,
    peakYear: peakEntry.year,
    recoveryFromPeak,
    currentNetworth: currentTotal,
  };
};

export default {
  calculatePortfolioTotal,
  calculateCAGR,
  calculateAllocations,
  calculateFIProgress,
  calculatePortfolioHealth,
  calculateRealMetrics,
};