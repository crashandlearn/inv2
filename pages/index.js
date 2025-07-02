// pages/index.js
/**
 * Main Dashboard Page
 *
 * Clean, modular dashboard using the new architecture.
 */

import React, { useState } from 'react';
import { Brain } from 'lucide-react';

// Custom hooks and utilities
import { usePortfolio } from '../lib/hooks/usePortfolio.js';
import { convertPortfolio } from '../lib/utils/currency.js';
import { exportData } from '../lib/services/storage.js';

// UI Components
import LoadingSpinner from '../components/ui/LoadingSpinner.js';
import Alert from '../components/ui/Alert.js';

// Dashboard Components
import Header from '../components/dashboard/Header.js';
import HistoricalJourney from '../components/dashboard/HistoricalJourney.js';
import AutomationStatus from '../components/dashboard/AutomationStatus.js';

// Portfolio Components
import PortfolioMetrics from '../components/portfolio/PortfolioMetrics.js';
import PortfolioBuckets from '../components/portfolio/PortfolioBuckets.js';
import HealthAlerts from '../components/portfolio/HealthAlerts.js';
import EditModal from '../components/portfolio/EditModal.js';

export default function Dashboard() {
  // Portfolio state and actions
  const {
    portfolio,
    total,
    allocations,
    healthIssues,
    metrics,
    loading,
    error,
    updatePortfolio,
    getStatus,
    historicalData,
  } = usePortfolio();

  // UI state
  const [currency, setCurrency] = useState('SGD');
  const [showEditModal, setShowEditModal] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Convert portfolio data to display currency
  const displayPortfolio = convertPortfolio(portfolio, currency);
  const displayTotal = total * (currency === 'SGD' ? 1 : currency === 'USD' ? 0.74 : 67.30);

  // Handle currency change
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  // Handle portfolio update
  const handlePortfolioUpdate = (newPortfolio) => {
    const success = updatePortfolio(newPortfolio);
    if (success) {
      setShowEditModal(false);
    }
  };

  // Handle data export
  const handleExport = () => {
    try {
      const data = exportData();
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inv2-portfolio-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Handle AI coaching (mock implementation)
  const handleAICoach = async () => {
    setIsLoadingAI(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAiAdvice({
        urgent: `Your ${((portfolio.hedge / total) * 100).toFixed(1)}% cash position is dragging returns. Deploy SGD ${((portfolio.hedge / total * 100 - 15) * total / 100).toLocaleString()} immediately.`,
        strategic: "Your DCA automation is working well. Continue the SGD 5k monthly transfers and set up VUAA auto-purchase in IBKR.",
        tactical: `Strong recovery from 2023! Your ${metrics.cagr?.toFixed(1)}% CAGR proves the strategy works. Stay disciplined.`,
        generated: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('AI Coach error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your portfolio..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Alert
            type="error"
            title="Portfolio Loading Error"
            message={error}
          />
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <Header
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          onUpdateClick={() => setShowEditModal(true)}
          onAICoachClick={handleAICoach}
          onExportClick={handleExport}
          loading={isLoadingAI}
        />

        {/* AI Insights */}
        {aiAdvice && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 mb-8 border border-purple-500/20">
            <div className="flex items-start gap-4">
              <Brain className="h-6 w-6 text-purple-400 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  AI Strategic Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-red-400 mb-1">🚨 Urgent Action</h4>
                    <p className="text-purple-100 text-sm">{aiAdvice.urgent}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">📈 Strategic</h4>
                    <p className="text-purple-100 text-sm">{aiAdvice.strategic}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-400 mb-1">⚡ Tactical</h4>
                    <p className="text-purple-100 text-sm">{aiAdvice.tactical}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-xs text-purple-200">Generated: {aiAdvice.generated}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Metrics */}
        <div className="mb-8">
          <PortfolioMetrics
            portfolio={displayPortfolio}
            total={displayTotal}
            metrics={metrics}
            currency={currency}
          />
        </div>

        {/* Portfolio Health */}
        <div className="mb-8">
          <HealthAlerts
            healthIssues={healthIssues}
          />
        </div>

        {/* Portfolio Buckets */}
        <div className="mb-8">
          <PortfolioBuckets
            portfolio={displayPortfolio}
            total={displayTotal}
            currency={currency}
          />
        </div>

        {/* Historical Journey */}
        <div className="mb-8">
          <HistoricalJourney
            historicalData={historicalData}
            currency={currency}
          />
        </div>

        {/* Automation Status */}
        <div className="mb-8">
          <AutomationStatus />
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Debug Info</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Status: {JSON.stringify(getStatus())}</div>
              <div>Total: {total.toLocaleString()}</div>
              <div>Issues: {healthIssues.length}</div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Modal */}
     <EditModal
       isOpen={showEditModal}
       onClose={() => setShowEditModal(false)}
       portfolio={portfolio}
       onSave={handlePortfolioUpdate}
       currency={currency}
     />
   </div>
 );
}
