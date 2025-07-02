// lib/hooks/usePortfolio.js
/**
 * Portfolio Management Hook
 *
 * Centralized state management for portfolio data with automatic persistence,
 * error handling, and real-time calculations.
 */

import { useState, useEffect, useCallback } from 'react';
import { INITIAL_PORTFOLIO } from '../data/portfolioData.js';
import { HISTORICAL_DATA } from '../data/historicalData.js';
import { PORTFOLIO_CONFIG } from '../data/config.js';
import { savePortfolio, loadPortfolio } from '../services/storage.js';
import { validatePortfolio } from '../utils/validation.js';
import {
  calculatePortfolioTotal,
  calculateAllocations,
  calculatePortfolioHealth,
  calculateRealMetrics
} from '../utils/calculations.js';

/**
 * Custom hook for portfolio management
 * @returns {Object} Portfolio state and methods
 */
export const usePortfolio = () => {
  // Core state
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  // Derived state (computed from portfolio)
  const [total, setTotal] = useState(0);
  const [allocations, setAllocations] = useState({});
  const [healthIssues, setHealthIssues] = useState([]);
  const [metrics, setMetrics] = useState({});

  /**
   * Load portfolio from storage on mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const saved = loadPortfolio();
        if (saved) {
          // Validate loaded data
          const validated = validatePortfolio(saved);
          setPortfolio(validated);
          console.log('Portfolio loaded from storage');
        } else {
          console.log('Using initial portfolio');
        }

      } catch (err) {
        console.error('Failed to load portfolio:', err.message);
        setError(`Failed to load portfolio: ${err.message}`);
        // Use initial portfolio as fallback
        setPortfolio(INITIAL_PORTFOLIO);

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Calculate derived values when portfolio changes
   */
  useEffect(() => {
    if (loading) return;

    try {
      // Calculate total
      const newTotal = calculatePortfolioTotal(portfolio);
      setTotal(newTotal);

      // Calculate allocations
      const newAllocations = calculateAllocations(portfolio);
      setAllocations(newAllocations);

      // Calculate health issues
      const issues = calculatePortfolioHealth(portfolio, PORTFOLIO_CONFIG.healthThresholds);
      setHealthIssues(issues);

      // Calculate real metrics
      const realMetrics = calculateRealMetrics(newTotal, HISTORICAL_DATA);
      setMetrics(realMetrics);

    } catch (err) {
      console.error('Error calculating portfolio metrics:', err.message);
      setError(`Calculation error: ${err.message}`);
    }
  }, [portfolio, loading]);

  /**
   * Save portfolio to storage when it changes
   */
  useEffect(() => {
    if (loading) return;

    const saveData = async () => {
      try {
        const success = savePortfolio(portfolio);
        if (success) {
          setLastSaved(new Date());
        }
      } catch (err) {
        console.error('Failed to save portfolio:', err.message);
        // Don't set error state for save failures (non-critical)
      }
    };

    // Debounce saves (save after 1 second of inactivity)
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);

  }, [portfolio, loading]);

  /**
   * Update portfolio with validation
   */
  const updatePortfolio = useCallback((updates) => {
    try {
      setError(null);

      // Merge updates with current portfolio
      const newPortfolio = { ...portfolio, ...updates };

      // Validate new portfolio
      const validated = validatePortfolio(newPortfolio);

      // Update state
      setPortfolio(validated);

      return true;

    } catch (err) {
      console.error('Failed to update portfolio:', err.message);
      setError(`Update failed: ${err.message}`);
      return false;
    }
  }, [portfolio]);

  /**
   * Update specific bucket value
   */
  const updateBucket = useCallback((bucket, value) => {
    return updatePortfolio({ [bucket]: value });
  }, [updatePortfolio]);

  /**
   * Reset portfolio to initial state
   */
  const resetPortfolio = useCallback(() => {
    try {
      setError(null);
      setPortfolio(INITIAL_PORTFOLIO);
      return true;
    } catch (err) {
      setError(`Reset failed: ${err.message}`);
      return false;
    }
  }, []);

  /**
   * Get portfolio status summary
   */
  const getStatus = useCallback(() => {
    return {
      isLoading: loading,
      hasError: !!error,
      errorMessage: error,
      lastSaved: lastSaved,
      totalValue: total,
      healthScore: healthIssues.length === 0 ? 'Good' :
                   healthIssues.some(i => i.type === 'URGENT') ? 'Urgent' : 'Moderate',
      urgentIssues: healthIssues.filter(i => i.type === 'URGENT').length,
    };
  }, [loading, error, lastSaved, total, healthIssues]);

  /**
   * Manually trigger save
   */
  const saveNow = useCallback(() => {
    try {
      const success = savePortfolio(portfolio);
      if (success) {
        setLastSaved(new Date());
      }
      return success;
    } catch (err) {
      setError(`Save failed: ${err.message}`);
      return false;
    }
  }, [portfolio]);

  // Return hook interface
  return {
    // Core data
    portfolio,
    total,
    allocations,
    healthIssues,
    metrics,

    // State
    loading,
    error,
    lastSaved,

    // Actions
    updatePortfolio,
    updateBucket,
    resetPortfolio,
    saveNow,

    // Utilities
    getStatus,

    // Computed properties
    hasUrgentIssues: healthIssues.some(i => i.type === 'URGENT'),
    allocationPercentages: allocations,
    currentTotal: total,

    // Historical context
    historicalData: HISTORICAL_DATA,
    config: PORTFOLIO_CONFIG,
  };
};

export default usePortfolio;
