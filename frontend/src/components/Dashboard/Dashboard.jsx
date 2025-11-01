import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Search, 
  TrendingUp, 
  PieChart, 
  BarChart3,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';
import { dashboardAPI } from '../../services/api.js';
import FundSearch from './FundSearch.jsx';
import FundSummaryCard from './FundSummaryCard.jsx';
import PortfolioSummary from './PortfolioSummary.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // For demo purposes, using a hardcoded user ID
  // In a real app, this would come from authentication context
  const userId = 'demo-user-123';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getUserDashboard(userId);
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleFundSearch = async (searchText) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const results = await dashboardAPI.searchFunds(searchText);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Fund search error:', err);
      setError('Failed to search funds. Please try again.');
    }
  };

  const handleSearchClose = () => {
    setShowSearchResults(false);
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Dashboard Data</h2>
            <p className="text-gray-600 mb-6">Unable to load your dashboard data.</p>
            <button
              onClick={fetchDashboardData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Stonks
                </h1>
                <p className="text-gray-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                  Welcome back, {dashboardData.userName}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Fund Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Search className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Fund Search</h2>
            </div>
            <FundSearch onSearch={handleFundSearch} />
            
            {showSearchResults && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Search Results ({searchResults.length})
                  </h3>
                  <button
                    onClick={handleSearchClose}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((fund) => (
                    <div
                      key={fund.schemeCode}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{fund.schemeName}</h4>
                      <p className="text-sm text-gray-600">Code: {fund.schemeCode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary dashboardData={dashboardData} />

        {/* Enhanced Fund Summaries */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <PieChart className="w-6 h-6 mr-3 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Funds</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{dashboardData.fundSummaries?.length || 0} funds</span>
              </div>
            </div>
            
            {dashboardData.fundSummaries?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PieChart className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No funds yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start building your portfolio by searching for funds above and adding them to your investment portfolio.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Search className="w-4 h-4" />
                  <span>Use the search above to find mutual funds</span>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardData.fundSummaries.map((fund) => (
                  <FundSummaryCard key={fund.fundId} fund={fund} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
