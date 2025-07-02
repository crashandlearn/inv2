// components/portfolio/EditModal.js
/**
 * Portfolio Edit Modal Component
 * 
 * Allows users to update portfolio values with validation.
 */

import React, { useState, useEffect } from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal.js';
import Alert from '../ui/Alert.js';
import { validateInput } from '../../lib/utils/validation.js';
import { formatCurrency } from '../../lib/utils/currency.js';
import { calculatePortfolioTotal } from '../../lib/utils/calculations.js';

const EditModal = ({ 
  isOpen, 
  onClose, 
  portfolio, 
  onSave,
  currency = 'SGD' 
}) => {
  const [editValues, setEditValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize edit values when modal opens
  useEffect(() => {
    if (isOpen && portfolio) {
      setEditValues({
        core: portfolio.core?.toString() || '0',
        growth: portfolio.growth?.toString() || '0',
        crypto: portfolio.crypto?.toString() || '0',
        hedge: portfolio.hedge?.toString() || '0',
        savings: portfolio.savings?.toString() || '0',
      });
      setErrors({});
      setIsDirty(false);
    }
  }, [isOpen, portfolio]);

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    const validation = validateInput(value, 'currency');
    
    setEditValues(prev => ({
      ...prev,
      [field]: validation.formattedValue
    }));

    // Update errors
    setErrors(prev => ({
      ...prev,
      [field]: validation.error
    }));

    setIsDirty(true);
  };

  // Calculate new total
  const getNewTotal = () => {
    try {
      const values = {
        core: parseFloat(editValues.core?.replace(/,/g, '') || '0'),
        growth: parseFloat(editValues.growth?.replace(/,/g, '') || '0'),
        crypto: parseFloat(editValues.crypto?.replace(/,/g, '') || '0'),
        hedge: parseFloat(editValues.hedge?.replace(/,/g, '') || '0'),
      };
      return calculatePortfolioTotal(values);
    } catch (error) {
      return 0;
    }
  };

  // Check if form is valid
  const isValid = () => {
    return Object.values(errors).every(error => !error) && isDirty;
  };

  // Handle save
  const handleSave = () => {
    try {
      const newPortfolio = {
        core: parseFloat(editValues.core?.replace(/,/g, '') || '0'),
        growth: parseFloat(editValues.growth?.replace(/,/g, '') || '0'),
        crypto: parseFloat(editValues.crypto?.replace(/,/g, '') || '0'),
        hedge: parseFloat(editValues.hedge?.replace(/,/g, '') || '0'),
        savings: parseFloat(editValues.savings?.replace(/,/g, '') || '0'),
      };

      onSave(newPortfolio);
      onClose();
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  // Handle close with unsaved changes
  const handleClose = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const fields = [
    { key: 'core', label: 'Core Growth', description: 'VUAA ETF, India equities' },
    { key: 'growth', label: 'Alpha Growth', description: 'Individual stocks (NVDA, GOOG, TSLA)' },
    { key: 'crypto', label: 'Crypto Hedge', description: 'BTC, ETH, alts' },
    { key: 'hedge', label: 'Stability Hedge', description: 'Cash, bonds, gold' },
    { key: 'savings', label: 'Monthly Savings', description: 'Target monthly savings amount' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Portfolio"
      size="large"
    >
      {/* General Error */}
      {errors.general && (
        <Alert type="error" message={errors.general} className="mb-4" />
      )}

      {/* New Total Display */}
      <div className="mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
        <div className="text-sm text-blue-400 mb-1">New Portfolio Total</div>
        <div className="text-2xl font-bold text-blue-100">
          {formatCurrency(getNewTotal(), currency)}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        {fields.map(({ key, label, description }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={editValues[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={`
                w-full bg-gray-700 border rounded px-3 py-2 text-white 
                focus:outline-none transition-colors
                ${errors[key] 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-600 focus:border-blue-500'
                }
              `}
              placeholder="Enter amount"
            />
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {errors[key] && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid()}
          className={`
            px-4 py-2 rounded font-medium transition-colors flex items-center gap-2
            ${isValid()
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <Save className="h-4 w-4" />
          Save & Recalculate
        </button>
      </div>
    </Modal>
  );
};

export default EditModal;