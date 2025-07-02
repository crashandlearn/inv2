/**
 * Current Portfolio Data
 *
 * Defines the current portfolio state and structure.
 * This represents the actual portfolio composition as of latest update.
 */

export const INITIAL_PORTFOLIO = {
  // Portfolio components (in SGD)
  core: 105356,       // Core growth: VUAA ETF, India equities
  growth: 100441,     // Alpha growth: Individual stocks (NVDA, GOOG, TSLA, etc.)
  crypto: 101000,     // Crypto hedge: BTC, ETH, alts
  hedge: 170050,      // Stability hedge: Cash, bonds, gold

  // Settings
  savings: 7000,      // Monthly savings target (SGD)
  currency: 'SGD',    // Display currency

  // Metadata
  lastUpdated: new Date().toISOString(),
  version: '2.0.0',
};

/**
 * Portfolio bucket definitions
 * Describes what each bucket contains and its purpose
 */
export const PORTFOLIO_BUCKETS = {
  core: {
    name: 'Core Growth',
    description: 'Broad market exposure through ETFs and diversified equity',
    color: 'blue',
    components: ['VUAA ETF', 'India equities (ICICI)', 'Diversified funds'],
    strategy: 'Buy and hold, regular DCA',
    riskLevel: 'Medium',
  },
  growth: {
    name: 'Alpha Growth',
    description: 'Individual stocks for alpha generation',
    color: 'purple',
    components: ['NVDA', 'GOOG', 'TSLA', 'UNH', 'AAPL', 'Other singles'],
    strategy: 'Selective stock picking, trim winners',
    riskLevel: 'High',
  },
  crypto: {
    name: 'Crypto Hedge',
    description: 'Digital assets as inflation and system hedge',
    color: 'orange',
    components: ['BTC', 'ETH', 'ONDO', 'CVX', 'Other alts'],
    strategy: 'Long-term hold, rotate alts to BTC',
    riskLevel: 'Very High',
  },
  hedge: {
    name: 'Stability Hedge',
    description: 'Capital preservation and liquidity',
    color: 'green',
    components: ['Cash', 'T-bills', 'SGS bonds', 'Physical gold'],
    strategy: 'Defensive positioning, deploy on opportunities',
    riskLevel: 'Low',
  },
};

/**
 * Automation status tracking
 */
export const AUTOMATION_STATUS = {
  dbs_transfer: {
    active: true,
    amount: 5000,
    frequency: 'monthly',
    nextDate: '2025-07-30',
    lastTransfer: '2025-06-30',
    status: 'working',
  },
  ibkr_dca: {
    active: false,
    target: 'VUAA',
    setup_needed: true,
    priority: 'high',
  },
};

export default INITIAL_PORTFOLIO;
