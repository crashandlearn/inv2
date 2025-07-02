// lib/services/storage.js
/**
 * Local Storage Service
 *
 * Abstraction layer for localStorage with error handling and validation.
 * Provides backup/restore functionality and data migration support.
 */

const STORAGE_KEYS = {
  PORTFOLIO: 'inv2_portfolio',
  SETTINGS: 'inv2_settings',
  BACKUP: 'inv2_backup',
};

const STORAGE_VERSION = '2.0.0';

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is supported
 */
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('localStorage not available:', error.message);
    return false;
  }
};

/**
 * Save portfolio data to localStorage
 * @param {Object} portfolio - Portfolio data to save
 * @returns {boolean} True if save successful
 */
export const savePortfolio = (portfolio) => {
  try {
    if (!isStorageAvailable()) {
      console.warn('Storage not available, portfolio not saved');
      return false;
    }

    if (!portfolio || typeof portfolio !== 'object') {
      throw new Error('Invalid portfolio data');
    }

    // Add metadata
    const dataToSave = {
      ...portfolio,
      lastUpdated: new Date().toISOString(),
      version: STORAGE_VERSION,
    };

    // Save current data
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(dataToSave));

    // Create backup of previous version
    const existing = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    if (existing) {
      localStorage.setItem(STORAGE_KEYS.BACKUP, existing);
    }

    console.log('Portfolio saved successfully');
    return true;

  } catch (error) {
    console.error('Failed to save portfolio:', error.message);
    return false;
  }
};

/**
 * Load portfolio data from localStorage
 * @returns {Object|null} Portfolio data or null if not found
 */
export const loadPortfolio = () => {
  try {
    if (!isStorageAvailable()) {
      console.warn('Storage not available, using default portfolio');
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    if (!stored) {
      console.log('No stored portfolio found');
      return null;
    }

    const parsed = JSON.parse(stored);

    // Validate loaded data structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid stored portfolio format');
    }

    // Check for required fields
    const requiredFields = ['core', 'growth', 'crypto', 'hedge'];
    const missingFields = requiredFields.filter(field => !(field in parsed));

    if (missingFields.length > 0) {
      throw new Error(`Missing portfolio fields: ${missingFields.join(', ')}`);
    }

    console.log('Portfolio loaded successfully');
    return parsed;

  } catch (error) {
    console.error('Failed to load portfolio:', error.message);

    // Try to restore from backup
    const backup = restoreFromBackup();
    if (backup) {
      console.log('Restored from backup');
      return backup;
    }

    return null;
  }
};

/**
 * Save app settings to localStorage
 * @param {Object} settings - Settings object
 * @returns {boolean} True if save successful
 */
export const saveSettings = (settings) => {
  try {
    if (!isStorageAvailable()) return false;

    const dataToSave = {
      ...settings,
      lastUpdated: new Date().toISOString(),
      version: STORAGE_VERSION,
    };

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(dataToSave));
    return true;

  } catch (error) {
    console.error('Failed to save settings:', error.message);
    return false;
  }
};

/**
 * Load app settings from localStorage
 * @returns {Object} Settings object (with defaults if not found)
 */
export const loadSettings = () => {
  try {
    if (!isStorageAvailable()) {
      return getDefaultSettings();
    }

    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return getDefaultSettings();
    }

    const parsed = JSON.parse(stored);
    return { ...getDefaultSettings(), ...parsed };

  } catch (error) {
    console.error('Failed to load settings:', error.message);
    return getDefaultSettings();
  }
};

/**
 * Get default settings
 * @returns {Object} Default settings object
 */
const getDefaultSettings = () => ({
  currency: 'SGD',
  theme: 'dark',
  notifications: true,
  autoSave: true,
});

/**
 * Create backup of current data
 * @returns {Object|null} Backup data or null if failed
 */
export const createBackup = () => {
  try {
    const portfolio = loadPortfolio();
    const settings = loadSettings();

    const backup = {
      portfolio,
      settings,
      timestamp: new Date().toISOString(),
      version: STORAGE_VERSION,
    };

    return backup;

  } catch (error) {
    console.error('Failed to create backup:', error.message);
    return null;
  }
};

/**
 * Restore data from backup
 * @returns {Object|null} Restored portfolio or null if failed
 */
const restoreFromBackup = () => {
  try {
    if (!isStorageAvailable()) return null;

    const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
    if (!backup) return null;

    const parsed = JSON.parse(backup);
    console.log('Restoring from backup');
    return parsed;

  } catch (error) {
    console.error('Failed to restore from backup:', error.message);
    return null;
  }
};

/**
 * Export all data as JSON string
 * @returns {string} JSON string of all data
 */
export const exportData = () => {
  try {
    const data = {
      portfolio: loadPortfolio(),
      settings: loadSettings(),
      timestamp: new Date().toISOString(),
      version: STORAGE_VERSION,
      app: 'INV2 Investment Command Center',
    };

    return JSON.stringify(data, null, 2);

  } catch (error) {
    console.error('Failed to export data:', error.message);
    return null;
  }
};

/**
 * Import data from JSON string
 * @param {string} jsonData - JSON string to import
 * @returns {boolean} True if import successful
 */
export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);

    // Validate import data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid import data format');
    }

    // Import portfolio if present
    if (data.portfolio) {
      const success = savePortfolio(data.portfolio);
      if (!success) {
        throw new Error('Failed to import portfolio');
      }
    }

    // Import settings if present
    if (data.settings) {
      saveSettings(data.settings);
    }

    console.log('Data imported successfully');
    return true;

  } catch (error) {
    console.error('Failed to import data:', error.message);
    return false;
  }
};

/**
 * Clear all stored data
 * @returns {boolean} True if clear successful
 */
export const clearAllData = () => {
  try {
    if (!isStorageAvailable()) return false;

    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('All data cleared');
    return true;

  } catch (error) {
    console.error('Failed to clear data:', error.message);
    return false;
  }
};

export default {
  savePortfolio,
  loadPortfolio,
  saveSettings,
  loadSettings,
  createBackup,
  exportData,
  importData,
  clearAllData,
};
