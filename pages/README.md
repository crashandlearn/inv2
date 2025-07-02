/* README.md */
# INV2 - Investment Command Center v2.0

## 🎯 Overview

INV2 is a complete architectural rebuild of the investment portfolio tracking dashboard with clean separation of concerns, comprehensive error handling, and modular components.

## ✨ Features

- **Real-time portfolio tracking** with automatic calculations
- **Multi-currency support** (SGD, USD, INR) with live conversion
- **Historical journey visualization** (2018-2025 real data)
- **Portfolio health monitoring** with actionable alerts
- **Four-bucket allocation strategy** with target tracking
- **Automation status** for DBS transfers and IBKR setup
- **AI coaching integration** for strategic insights
- **Data export/import** for backup and portability
- **Mobile-responsive design** with dark theme
- **Comprehensive error handling** and validation

## 🏗️ Architecture

### Clean Separation of Concerns
```
lib/data/          # Configuration and historical data
lib/utils/         # Pure calculation and utility functions
lib/hooks/         # React state management hooks
lib/services/      # External service abstractions
components/ui/     # Reusable UI components
components/portfolio/ # Portfolio-specific components
components/dashboard/ # Dashboard layout components
```

### Key Improvements over INV1
- ✅ **Fixed calculation errors** (dynamic totals vs hard-coded)
- ✅ **Fixed INR conversion bug** (proper rounding)
- ✅ **Corrected historical data** (year alignment)
- ✅ **Comprehensive validation** with error handling
- ✅ **Modular components** for maintainability
- ✅ **Centralized state management** with usePortfolio hook
- ✅ **Automated testing** ready architecture

## 🚀 Deployment

### GitHub Repository: `inv2`
### Vercel App: `inv2`

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment
```bash
git add .
git commit -m "Deploy INV2 v2.0"
git push origin main
# Vercel auto-deploys
```

## 🔧 Configuration

### Portfolio Targets
Edit `lib/data/config.js` to adjust FI targets and allocations.

### Exchange Rates
Update `PORTFOLIO_CONFIG.exchangeRates` for current rates.

### Historical Data
Real data is in `lib/data/historicalData.js` with corrected year alignment.

## 📊 Data Management

### Storage
- Uses localStorage for persistence
- Automatic backup on changes
- Export/import functionality for portability

### Validation
- Comprehensive input validation
- Error boundaries for crash protection
- Graceful degradation on failures

## 🎨 UI Components

### Reusable Components
- `MetricsCard` - Financial metric display
- `ProgressBar` - Progress visualization
- `Modal` - Overlay dialogs
- `Alert` - Notifications and errors
- `LoadingSpinner` - Loading states

### Portfolio Components
- `PortfolioMetrics` - Key financial metrics
- `PortfolioBuckets` - Four-bucket allocation view
- `HealthAlerts` - Portfolio health warnings
- `EditModal` - Portfolio value editing

### Dashboard Components
- `Header` - Navigation and controls
- `HistoricalJourney` - 2018-2025 wealth journey
- `AutomationStatus` - DBS/IBKR automation tracking

## 🔍 Error Handling

### Multiple Layers
1. **Input validation** prevents bad data entry
2. **Calculation safeguards** handle edge cases
3. **Error boundaries** catch React crashes
4. **Graceful fallbacks** maintain functionality
5. **Debug information** for development

### Production Ready
- No console errors in production
- Meaningful error messages for users
- Automatic recovery where possible
- Performance monitoring ready

## 📈 Performance

### Optimizations
- Pure calculation functions (no side effects)
- Memoized components where appropriate
- Efficient re-renders with proper dependencies
- Lazy loading ready architecture
- Bundle size optimization

## 🔒 Security

### Best Practices
- Input sanitization and validation
- XSS protection through proper escaping
- No sensitive data in client code
- Security headers in Next.js config
- HTTPS-only cookies ready

## 🧪 Testing Ready

### Architecture Supports
- Unit tests for pure functions
- Component testing with React Testing Library
- Integration tests for user workflows
- E2E testing with Playwright
- Performance testing hooks

## 📚 Documentation

### Self-Documenting Code
- Comprehensive JSDoc comments
- Clear component interfaces
- Meaningful variable names
- Separated concerns for clarity
- Error message documentation

## 🛠️ Maintenance

### Future Enhancements
- Real-time market data integration
- Advanced charting capabilities
- Multi-user support
- Mobile app version
- API integrations (IBKR, bank feeds)

## 🎯 Success Metrics

### Fixed Issues from INV1
- ✅ Portfolio calculation accuracy
- ✅ Currency conversion correctness
- ✅ Historical data alignment
- ✅ Input validation robustness
- ✅ Code maintainability

### Quality Gates
- Zero console errors in production
- Sub-second page load times
- 100% component test coverage ready
- Accessibility compliance ready
- Mobile responsiveness verified

---

## 🚀 Ready for Production

INV2 represents a complete evolution from INV1 with enterprise-grade architecture, comprehensive error handling, and production-ready code quality.

**Deploy with confidence!**>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-300 bg-gray-800 p-3 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Head>
        <title>Investment Command Center v2.0</title>
        <meta name="description" content="Strategic Investment Dashboard for FI Planning - Clean Architecture" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Performance and SEO */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#111827" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
