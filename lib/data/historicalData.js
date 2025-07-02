/**
 * Historical Portfolio Data (2018-2025)
 *
 * Corrected historical data with proper year alignment.
 * Net worth figures represent end-of-year values.
 */

export const HISTORICAL_DATA = [
  {
    year: 2018,
    networth: 21200,          // End of 2018 net worth
    totalSaved: 20000,        // Cumulative saved by end of 2018
    annualSavings: 20000,     // Amount saved in 2018
    annualGains: 1200,        // Market gains in 2018
    gainsPercentage: 6.0,     // % return in 2018
    notes: "Started journey (Jul-Dec)"
  },
  {
    year: 2019,
    networth: 113547,         // End of 2019 net worth
    totalSaved: 95303,        // Cumulative saved by end of 2019
    annualSavings: 75303,     // Amount saved in 2019
    annualGains: 17044,       // Market gains in 2019
    gainsPercentage: 80.4,    // % return in 2019
    notes: "Building momentum"
  },
  {
    year: 2020,
    networth: 269083,         // End of 2020 net worth
    totalSaved: 173619,       // Cumulative saved by end of 2020
    annualSavings: 78316,     // Amount saved in 2020
    annualGains: 77220,       // Market gains in 2020
    gainsPercentage: 68.0,    // % return in 2020
    notes: "COVID market opportunity"
  },
  {
    year: 2021,
    networth: 578896,         // End of 2021 net worth
    totalSaved: 245219,       // Cumulative saved by end of 2021
    annualSavings: 71600,     // Amount saved in 2021
    annualGains: 238214,      // Market gains in 2021
    gainsPercentage: 88.5,    // % return in 2021
    notes: "Bull market gains - Peak year!"
  },
  {
    year: 2022,
    networth: 346000,         // End of 2022 net worth
    totalSaved: 271219,       // Cumulative saved by end of 2022
    annualSavings: 26000,     // Amount saved in 2022
    annualGains: -258896,     // Market losses in 2022
    gainsPercentage: -44.7,   // % return in 2022
    notes: "Market correction year"
  },
  {
    year: 2023,
    networth: 385530,         // End of 2023 net worth
    totalSaved: 291219,       // Cumulative saved by end of 2023
    annualSavings: 20000,     // Amount saved in 2023
    annualGains: 19530,       // Market gains in 2023
    gainsPercentage: 5.6,     // % return in 2023
    notes: "Recovery begins"
  },
  {
    year: 2024,
    networth: 491132,         // End of 2024 net worth
    totalSaved: 321219,       // Cumulative saved by end of 2024
    annualSavings: 30000,     // Amount saved in 2024
    annualGains: 75602,       // Market gains in 2024
    gainsPercentage: 19.6,    // % return in 2024
    notes: "Strong recovery year"
  },
  {
    year: 2025,
    networth: 491132,         // Current net worth (YTD)
    totalSaved: 327219,       // Cumulative saved (YTD)
    annualSavings: 6000,      // Amount saved YTD
    annualGains: -6000,       // Market performance YTD
    gainsPercentage: -1.2,    // % return YTD
    notes: "YTD - building for second half"
  }
];

/**
 * Calculate derived metrics from historical data
 */
export const getHistoricalMetrics = () => {
  const latest = HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
  const first = HISTORICAL_DATA[0];

  return {
    totalYears: 2025 - 2018,
    totalSaved: latest.totalSaved,
    totalGains: latest.networth - latest.totalSaved,
    overallReturn: ((latest.networth - latest.totalSaved) / latest.totalSaved) * 100,
    cagr: (Math.pow(latest.networth / first.annualSavings, 1 / (2025 - 2018)) - 1) * 100,
    bestYear: HISTORICAL_DATA.reduce((best, current) =>
      current.gainsPercentage > best.gainsPercentage ? current : best
    ),
    worstYear: HISTORICAL_DATA.reduce((worst, current) =>
      current.gainsPercentage < worst.gainsPercentage ? current : worst
    ),
    peakNetWorth: Math.max(...HISTORICAL_DATA.map(d => d.networth)),
    recoveryFromPeak: ((latest.networth - 346000) / 346000) * 100, // Recovery from 2023 low
  };
};

export default HISTORICAL_DATA;
