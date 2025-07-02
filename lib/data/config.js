/**
 * Portfolio Configuration Constants
 *
 * Centralized configuration for portfolio targets, exchange rates,
 * and other settings that may need to be adjusted over time.
 */

export const PORTFOLIO_CONFIG = {
  // Financial Independence targets (in SGD)
  targets: {
    lean: 1850000,    // Lean FI target
    full: 2500000,    // Full FI target
    // Portfolio bucket targets
    core: 222400,     // Core growth allocation
    growth: 48700,    // Alpha growth allocation
    crypto: 73000,    // Crypto hedge allocation
    hedge: 146000,    // Stability hedge allocation
  },

  // Target allocation percentages
  allocations: {
    core: 45.6,       // Core growth %
    growth: 10.0,     // Alpha growth %
    crypto: 15.0,     // Crypto hedge %
    hedge: 30.0,      // Stability hedge %
  },

  // Exchange rates (updated July 2025)
  exchangeRates: {
    SGD: 1,           // Base currency
    USD: 0.74,        // 1 SGD = 0.74 USD
    INR: 67.30,       // 1 SGD = 67.30 INR (fixed rate)
  },

  // Currency display settings
  currencies: {
    SGD: { symbol: 'SGD', precision: 0 },
    USD: { symbol: '$', precision: 0 },
    INR: { symbol: '₹', precision: 0 },
  },

  // Withdrawal rate for FI calculations
  withdrawalRate: 0.04, // 4% rule

  // Portfolio health thresholds
  healthThresholds: {
    cashMax: 25,      // Max cash % before alert
    growthMax: 12,    // Max individual stock % before alert
    cryptoMax: 20,    // Max crypto % before alert
  },

  // App settings
  app: {
    name: 'Investment Command Center v2.0',
    version: '2.0.0',
    baseCurrency: 'SGD',
    defaultSavings: 7000, // Default monthly savings
  },
};

// Validation helpers
export const validateConfig = () => {
  const { targets, allocations } = PORTFOLIO_CONFIG;

  // Ensure allocations add up to ~100%
  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  if (Math.abs(totalAllocation - 100) > 1) {
    console.warn('Portfolio allocations do not sum to 100%:', totalAllocation);
  }

  // Ensure all targets are positive
  Object.entries(targets).forEach(([key, value]) => {
    if (value <= 0) {
      console.error(`Invalid target for ${key}:`, value);
    }
  });
};

export default PORTFOLIO_CONFIG;
