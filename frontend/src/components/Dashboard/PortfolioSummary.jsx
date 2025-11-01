import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield,
  Calendar,
  Award,
  BarChart3,
  Activity,
  Zap,
  PieChart,
  TrendingUp as Growth,
  Calculator,
  Clock,
  Briefcase,
  Building2,
  Wallet,
  Quote
} from 'lucide-react';
import { dashboardAPI } from '../../services/api';

const PortfolioSummary = ({ dashboardData, dashboardExtraData, onLoadExtraData, loadingExtra, showExtraMetrics, onShowPerformanceTrend }) => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  const isProfit = dashboardData.profitLoss >= 0;
  const profitLossColor = isProfit ? 'text-green-600' : 'text-red-600';

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await dashboardAPI.getQuotes();
        if (response && Array.isArray(response)) {
          setQuotes(response);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };
    
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [quotes]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (percentage) => {
    if (percentage == null || isNaN(percentage)) {
      return 'N/A';
    }
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  // Calculate additional metrics

  const mainMetrics = [
    {
      title: 'Total Invested',
      value: formatCurrency(dashboardData.totalInvested),
      icon: Wallet,
      color: 'text-slate-700',
      bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800',
      iconBg: 'bg-slate-600',
      description: 'Total amount invested across all funds',
      glow: 'shadow-slate-200'
    },
    {
      title: 'Current Value',
      value: formatCurrency(dashboardData.totalValue),
      icon: Target,
      color: 'text-blue-700',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900',
      iconBg: 'bg-blue-600',
      description: 'Current market value of your portfolio',
      glow: 'shadow-blue-200'
    },
    {
      title: 'Unrealized P&L',
      value: formatCurrency(Math.abs(dashboardData.profitLoss)),
      percentage: formatPercentage(dashboardData.profitLossPercent),
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? 'text-green-700' : 'text-red-700',
      bgColor: isProfit ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800 dark:to-green-900' : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-800 dark:to-red-900',
      iconBg: isProfit ? 'bg-green-600' : 'bg-red-600',
      description: 'Current unrealized profit/loss',
      glow: isProfit ? 'shadow-green-200' : 'shadow-red-200'
    },
    {
      title: 'Emergency Fund',
      value: formatCurrency(dashboardData.totalEmergencyFundValue),
      icon: Shield,
      color: 'text-amber-700',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-800 dark:to-amber-900',
      iconBg: 'bg-amber-600',
      description: 'Value of emergency fund investments',
      glow: 'shadow-amber-200'
    }
  ];

  const detailedMetrics = dashboardExtraData ? [
    {
      title: 'XIRR',
      value: formatPercentage(dashboardExtraData.xirr),
      icon: Calculator,
      color: 'text-indigo-700',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      iconBg: 'bg-indigo-600',
      description: 'Extended Internal Rate of Return',
      glow: 'shadow-indigo-200'
    },
    {
      title: 'Realized Profit',
      value: formatCurrency(dashboardExtraData.totalRealizedProfit),
      icon: Award,
      color: 'text-emerald-700',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-600',
      description: 'Total profit from sold investments',
      glow: 'shadow-emerald-200'
    },
    {
      title: 'Current Year Realized',
      value: formatCurrency(dashboardExtraData.currentYearTotalRealizedProfit),
      icon: Calendar,
      color: 'text-orange-700',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconBg: 'bg-orange-600',
      description: 'Realized profit this financial year',
      glow: 'shadow-orange-200'
    },
    {
      title: 'Long Term Gains',
      value: formatCurrency(dashboardExtraData.longTermGains),
      icon: Growth,
      color: 'text-violet-700',
      bgColor: 'bg-gradient-to-br from-violet-50 to-violet-100',
      iconBg: 'bg-violet-600',
      description: 'Long term capital gains from investments',
      glow: 'shadow-violet-200'
    }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Welcome Panel with Quotes */}
      {(quotes.length > 0 || dashboardData.userName) && (
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 px-8 py-8">
            {/* Welcome Message */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Welcome Back, {dashboardData.userName || 'User'} 👋
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
                    Your investment journey continues
                  </p>
                  {dashboardData.todayMessage && (
                    <p className="mt-3">
                      <span className={`text-base font-bold px-3 py-1.5 rounded-lg inline-block border-2 ${
                        dashboardData.todayProfit >= 0 
                          ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                          : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                      }`}>
                        Today's Update: <span className={`font-semibold ${
                          dashboardData.todayProfit >= 0 ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                        }`}>{dashboardData.todayMessage}</span>
                      </span>
                    </p>
                  )}
                </div>
              </div>
              {/* Today's Profit/Loss */}
              {dashboardData.todayProfit != null && (
                <div className={`px-6 py-4 rounded-xl shadow-lg border-2 ${
                  dashboardData.todayProfit >= 0 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700' 
                    : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700'
                }`}>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Today's P&L</p>
                  <div className="flex items-center space-x-2">
                    {dashboardData.todayProfit >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <p className={`text-2xl font-bold ${
                      dashboardData.todayProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(Math.abs(dashboardData.todayProfit))}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quotes Display */}
            {quotes.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm rounded-full">
                      <Quote className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Quote Text */}
                  <blockquote className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-medium leading-relaxed italic">
                    "{quotes[currentQuoteIndex]}"
                  </blockquote>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Portfolio Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Portfolio Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time portfolio performance</p>
              </div>
            </div>
            {onShowPerformanceTrend && (
              <button
                onClick={onShowPerformanceTrend}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Show Performance Trend</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Main Metrics Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainMetrics.map((metric, index) => (
              <div 
                key={index} 
                className={`${metric.bgColor} rounded-xl p-6 border-2 ${isProfit && index === 2 ? 'border-green-300' : 'border-transparent'} hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
                style={{ animation: `fadeInUp ${0.5 + index * 0.1}s ease-out` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${metric.iconBg} rounded-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{metric.title}</p>
                    <p className={`text-2xl font-bold ${metric.color} dark:text-white drop-shadow-sm`}>{metric.value}</p>
                    {metric.percentage && (
                      <p className={`text-sm font-bold mt-1 ${metric.color} dark:text-white inline-flex items-center px-2 py-1 rounded-lg bg-white/50 dark:bg-gray-700/50`}>
                        {isProfit && index === 2 && '📈 '}
                        {!isProfit && index === 2 && '📉 '}
                        {metric.percentage}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Advanced Analytics</h3>
              <p className="text-sm text-indigo-100">Deep insights into your investment performance</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {showExtraMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {detailedMetrics.map((metric, index) => (
                <div 
                  key={index} 
                  className={`${metric.bgColor} rounded-xl p-6 border-2 border-transparent hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
                  style={{ animation: `fadeInUp ${0.5 + index * 0.1}s ease-out` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${metric.iconBg} rounded-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{metric.title}</p>
                      <p className={`text-2xl font-bold ${metric.color} dark:text-gray-100 drop-shadow-sm`}>{metric.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{metric.description}</p>
                </div>
              ))}
            </div>
          ) : loadingExtra ? (
            <div className="py-8">
              <div className="flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 dark:border-gray-500"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading Analytics...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600 animate-pulse">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      <div className="text-right">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
              <div className="py-12 text-center">
              <div className="mb-6 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-full">
                  <BarChart3 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Unlock Advanced Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Dive deep into your investment performance with real-time analytics, XIRR calculations, and long-term gains analysis
              </p>
              <button
                onClick={onLoadExtraData}
                disabled={loadingExtra}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-base flex items-center space-x-2 mx-auto"
              >
                <Activity className="w-5 h-5" />
                <span>Show Advanced Analytics</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PortfolioSummary;
