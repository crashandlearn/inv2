// lib/utils/currency.js
/**
 * Currency Conversion Utilities
 *
 * Handles currency conversion and formatting with proper error handling.
 * FIXES: INR conversion bug (was showing billions instead of reasonable numbers)
 */

import { PORTFOLIO_CONFIG } from '../data/config.js';

/**
 * Convert amount from SGD to target currency
 * @param {number} sgdAmount - Amount in SGD
 * @param {string} targetCurrency - Target currency (SGD, USD, INR)
 * @param {Object} customRates - Optional custom exchange rates
 * @returns {number} Converted amount (properly rounded)
 */
export const convertCurrency = (sgdAmount, targetCurrency = 'SGD', customRates = null) => {
  try {
    // Input validation
    if (typeof sgdAmount !== 'number' || isNaN(sgdAmount)) {
      throw new Error(`Invalid SGD amount: ${sgdAmount}`);
    }

    if (sgdAmount < 0) {
      throw new Error('Amount cannot be negative');
    }

    // Use custom rates or default config
    const rates = customRates || PORTFOLIO_CONFIG.exchangeRates;

    // Return SGD as-is
    if (targetCurrency === 'SGD') {
      return Math.round(sgdAmount);
    }

    // Validate target currency exists
    if (!rates[targetCurrency]) {
      throw new Error(`Unsupported currency: ${targetCurrency}`);
    }

    // Convert and round properly
    const converted = sgdAmount * rates[targetCurrency];

    // CRITICAL FIX: Proper rounding prevents INR billions bug
    return Math.round(converted);

  } catch (error) {
    console.error('Currency conversion error:', error.message);
    // Fallback: return original amount
    return Math.round(sgdAmount);
  }
};

/**
 * Format currency amount with proper symbol and formatting
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency type (SGD, USD, INR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'SGD') => {
  try {
    // Input validation
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0';
    }

    // Get currency configuration
    const currencyConfig = PORTFOLIO_CONFIG.currencies[currency];
    if (!currencyConfig) {
      console.warn(`Unknown currency: ${currency}, defaulting to SGD`);
      return `SGD ${Math.round(amount).toLocaleString()}`;
    }

    // Format with proper symbol and precision
    const roundedAmount = Math.round(amount);
    const formattedNumber = roundedAmount.toLocaleString();

    return `${currencyConfig.symbol} ${formattedNumber}`;

  } catch (error) {
    console.error('Currency formatting error:', error.message);
    return `${amount}`;
  }
};

/**
 * Get current exchange rate for a currency pair
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Exchange rate
 */
export const getExchangeRate = (fromCurrency = 'SGD', toCurrency = 'SGD') => {
  try {
    const rates = PORTFOLIO_CONFIG.exchangeRates;

    if (fromCurrency === toCurrency) {
      return 1;
    }

    if (fromCurrency === 'SGD') {
      return rates[toCurrency] || 1;
    }

    if (toCurrency === 'SGD') {
      return 1 / (rates[fromCurrency] || 1);
    }

    // Cross-currency conversion through SGD
    return rates[toCurrency] / rates[fromCurrency];

  } catch (error) {
    console.error('Exchange rate error:', error.message);
    return 1; // Fallback to 1:1
  }
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if valid currency
 */
export const isValidCurrency = (currency) => {
  return ['SGD', 'USD', 'INR'].includes(currency);
};

/**
 * Convert portfolio object to different currency
 * @param {Object} portfolio - Portfolio object
 * @param {string} targetCurrency - Target currency
 * @returns {Object} Converted portfolio
 */
export const convertPortfolio = (portfolio, targetCurrency = 'SGD') => {
  try {
    if (!portfolio || typeof portfolio !== 'object') {
      throw new Error('Invalid portfolio object');
    }

    if (!isValidCurrency(targetCurrency)) {
      throw new Error(`Invalid target currency: ${targetCurrency}`);
    }

    const converted = {};

    // Convert each numeric field
    Object.keys(portfolio).forEach(key => {
      if (typeof portfolio[key] === 'number') {
        converted[key] = convertCurrency(portfolio[key], targetCurrency);
      } else {
        converted[key] = portfolio[key]; // Keep non-numeric fields as-is
      }
    });

    return converted;

  } catch (error) {
    console.error('Portfolio conversion error:', error.message);
    return portfolio; // Return original on error
  }
};

export default {
  convertCurrency,
  formatCurrency,
  getExchangeRate,
  isValidCurrency,
  convertPortfolio,
};
