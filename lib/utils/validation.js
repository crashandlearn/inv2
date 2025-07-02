// lib/utils/validation.js
/**
 * Input Validation Utilities
 *
 * Comprehensive validation for user inputs with helpful error messages.
 */

/**
 * Validate portfolio input value
 * @param {string|number} input - User input to validate
 * @param {string} fieldName - Name of field for error messages
 * @returns {number} Validated number
 * @throws {Error} If validation fails
 */
export const validatePortfolioInput = (input, fieldName = 'value') => {
  try {
    // Handle empty input
    if (input === '' || input === null || input === undefined) {
      return 0;
    }

    // Convert string input to number (remove commas, spaces)
    let cleanInput = input;
    if (typeof input === 'string') {
      cleanInput = input.replace(/[^0-9.-]/g, '');
    }

    const number = Number(cleanInput);

    // Check if valid number
    if (isNaN(number)) {
      throw new Error(`${fieldName} must be a valid number`);
    }

    // Check for negative values
    if (number < 0) {
      throw new Error(`${fieldName} cannot be negative`);
    }

    // Check for unreasonably large values (over 10M SGD)
    if (number > 10000000) {
      throw new Error(`${fieldName} seems unreasonably high (over 10M SGD)`);
    }

    // Check for decimal precision (round to cents)
    return Math.round(number * 100) / 100;

  } catch (error) {
    throw new Error(`Validation error for ${fieldName}: ${error.message}`);
  }
};

/**
 * Validate portfolio object
 * @param {Object} portfolio - Portfolio object to validate
 * @returns {Object} Validated portfolio
 * @throws {Error} If validation fails
 */
export const validatePortfolio = (portfolio) => {
  if (!portfolio || typeof portfolio !== 'object') {
    throw new Error('Portfolio must be an object');
  }

  const requiredFields = ['core', 'growth', 'crypto', 'hedge'];
  const validated = {};

  // Validate each required field
  requiredFields.forEach(field => {
    if (!(field in portfolio)) {
      throw new Error(`Missing required field: ${field}`);
    }

    validated[field] = validatePortfolioInput(portfolio[field], field);
  });

  // Validate optional fields
  if ('savings' in portfolio) {
    validated.savings = validatePortfolioInput(portfolio.savings, 'savings');
  }

  // Copy non-numeric fields as-is
  Object.keys(portfolio).forEach(key => {
    if (!requiredFields.includes(key) && key !== 'savings') {
      validated[key] = portfolio[key];
    }
  });

  return validated;
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {string} Validated currency code
 * @throws {Error} If invalid currency
 */
export const validateCurrency = (currency) => {
  if (!currency || typeof currency !== 'string') {
    throw new Error('Currency must be a string');
  }

  const upperCurrency = currency.toUpperCase();
  const validCurrencies = ['SGD', 'USD', 'INR'];

  if (!validCurrencies.includes(upperCurrency)) {
    throw new Error(`Invalid currency: ${currency}. Must be one of: ${validCurrencies.join(', ')}`);
  }

  return upperCurrency;
};

/**
 * Sanitize string input (remove potentially harmful characters)
 * @param {string} input - String to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input, maxLength = 100) => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially harmful characters
  const sanitized = input
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/[{}]/g, '') // Remove curly braces
    .trim()
    .substring(0, maxLength);

  return sanitized;
};

/**
 * Validate and format user input in real-time
 * @param {string} input - Raw user input
 * @param {string} type - Input type ('number', 'currency', 'text')
 * @returns {Object} Validation result with formatted value and errors
 */
export const validateInput = (input, type = 'number') => {
  const result = {
    value: input,
    formattedValue: input,
    isValid: true,
    error: null,
  };

  try {
    switch (type) {
      case 'number':
      case 'currency':
        // Allow typing numbers with commas and decimals
        const cleanNumber = input.replace(/[^0-9.,]/g, '');
        result.formattedValue = cleanNumber;

        if (cleanNumber && cleanNumber !== '') {
          const numValue = validatePortfolioInput(cleanNumber);
          result.value = numValue;
          result.formattedValue = numValue.toLocaleString();
        }
        break;

      case 'text':
        result.formattedValue = sanitizeString(input);
        result.value = result.formattedValue;
        break;

      default:
        result.formattedValue = input;
    }
  } catch (error) {
    result.isValid = false;
    result.error = error.message;
  }

  return result;
};

/**
 * Create validation error with helpful message
 * @param {string} field - Field name
 * @param {string} message - Error message
 * @param {*} value - Invalid value
 * @returns {Error} Formatted error
 */
export const createValidationError = (field, message, value) => {
  const error = new Error(`${field}: ${message}`);
  error.field = field;
  error.value = value;
  error.type = 'VALIDATION_ERROR';
  return error;
};

export default {
  validatePortfolioInput,
  validatePortfolio,
  validateCurrency,
  sanitizeString,
  validateInput,
  createValidationError,
};
