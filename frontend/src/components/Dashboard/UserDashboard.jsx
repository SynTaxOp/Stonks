import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardAPI } from '../../services/api.js';
import DashboardNavigation from './DashboardNavigation.jsx';
import FundSearch from './FundSearch.jsx';
import PortfolioSummary from './PortfolioSummary.jsx';
import UserFundDetail from './UserFundDetail.jsx';
import StockDataTable from './StockDataTable.jsx';
import SIPManagement from './SIPManagement.jsx';
import HistoricDataModal from './HistoricDataModal.jsx';
import Profile from './Profile.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import ConfirmationDialog from '../common/ConfirmationDialog.jsx';

const UserDashboard = ({ user, onLogout, onUserUpdate }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardExtraData, setDashboardExtraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [showExtraMetrics, setShowExtraMetrics] = useState(false);
  const [orderBy, setOrderBy] = useState('TOTAL_VALUE');
  const [orderDirection, setOrderDirection] = useState('DESC');
  const [showHistoricDataModal, setShowHistoricDataModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getUserDashboard(user.id);
      
      console.log('Dashboard API Response:', response);
      
      if (response) {
        setDashboardData(response);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const loadDashboardExtraData = useCallback(async () => {
    try {
      setLoadingExtra(true);
      setError(null);
      const response = await dashboardAPI.getUserDashboardExtra(user.id);
      
      console.log('Dashboard Extra API Response:', response);
      
      if (response) {
        setDashboardExtraData(response);
        setShowExtraMetrics(true);
      } else {
        setError('Failed to load extra dashboard data');
      }
    } catch (err) {
      console.error('Error loading dashboard extra:', err);
      setError('Failed to load extra dashboard data. Please try again.');
    } finally {
      setLoadingExtra(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user.id, loadDashboardData]);

  const handleSearch = async (searchText) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await dashboardAPI.searchFunds(searchText);
      console.log('Search API Response:', response);
      
      if (response) {
        setSearchResults(response || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching funds:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleFundSelect = (fund) => {
    // Convert fund data to MutualFundDTO format for UserFundDetail
    // Handle both search results (schemeCode/schemeName) and dashboard data (fundId/name)
    const fundForDetail = {
      schemeCode: fund.schemeCode || fund.fundId,
      schemeName: fund.schemeName || fund.name
    };
    setSelectedFund(fundForDetail);
  };

  const handleBackToDashboard = () => {
    setSelectedFund(null);
    setCurrentView('dashboard');
  };

  // Memoized sorted fund summaries - only recalculates when dependencies change
  const sortedFundSummaries = useMemo(() => {
    if (!dashboardData?.fundSummaries) return [];
    
    return [...dashboardData.fundSummaries].sort((a, b) => {
      let comparison = 0;
      
      switch (orderBy) {
        case 'TOTAL_VALUE':
          comparison = (a.totalValue || 0) - (b.totalValue || 0);
          break;
        case 'PROFIT_PERCENT':
          comparison = (a.profitLossPercent || 0) - (b.profitLossPercent || 0);
          break;
        case 'TAG':
          const tagA = (a.tag || '').toLowerCase();
          const tagB = (b.tag || '').toLowerCase();
          comparison = tagA.localeCompare(tagB);
          break;
        case 'FUND_NAME':
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'TOTAL_INVESTED':
          comparison = (a.totalInvested || 0) - (b.totalInvested || 0);
          break;
        case 'PROFIT_LOSS':
          comparison = (a.profitLoss || 0) - (b.profitLoss || 0);
          break;
        default:
          comparison = 0;
      }
      
      return orderDirection === 'ASC' ? comparison : -comparison;
    });
  }, [dashboardData?.fundSummaries, orderBy, orderDirection]);

  const handleSortChange = (newOrderBy, newOrderDirection) => {
    setOrderBy(newOrderBy);
    setOrderDirection(newOrderDirection);
  };

  const handleRecordTransaction = (fund) => {
    // This will be handled by UserFundDetail component
    console.log('Record transaction for:', fund);
  };

  const handleRegisterSIP = (fund) => {
    // This will be handled by UserFundDetail component
    console.log('Register SIP for:', fund);
  };

  const handleUserUpdate = (updatedUser) => {
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'sips':
        return <SIPManagement userId={user.id} onSuccess={(message) => console.log(message)} />;
      case 'transactions':
        return (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">Transaction Management</div>
            <div className="text-gray-400 dark:text-gray-500">Transaction features coming soon...</div>
          </div>
        );
      case 'funds':
        return (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">Fund Details</div>
            <div className="text-gray-400 dark:text-gray-500">Fund details features coming soon...</div>
          </div>
        );
      case 'profile':
        return <Profile user={user} onUpdate={handleUserUpdate} onDelete={onLogout} />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      {/* Enhanced Search Section */}
      <div className="mb-8 relative">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/30 to-slate-600/30"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Search Mutual Funds</h2>
                <p className="text-slate-300">Discover and analyze investment opportunities</p>
              </div>
            </div>
        <FundSearch onSearch={handleSearch} />
          </div>
        </div>

        {/* Search Results Dropdown */}
        {(isSearching || searchResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-gray-700 max-h-[60vh] overflow-hidden">
              <div className="overflow-y-auto max-h-[60vh]">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-white text-sm">Searching mutual funds...</p>
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white">No mutual funds found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700">
                    {searchResults.map((fund, index) => (
                      <div
                        key={fund.schemeCode}
                        className="px-6 py-4 hover:bg-slate-700/50 cursor-pointer transition-colors duration-200 group"
                        onClick={() => {
                          handleFundSelect(fund);
                          setSearchResults([]);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 truncate">
                                {fund.schemeName}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center text-blue-400 font-medium text-sm ml-4">
                            <span>View</span>
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      {dashboardData ? (
        <div className="space-y-8">
          {/* Portfolio Summary */}
          <PortfolioSummary 
            dashboardData={dashboardData} 
            dashboardExtraData={dashboardExtraData}
            onLoadExtraData={loadDashboardExtraData}
            loadingExtra={loadingExtra}
            showExtraMetrics={showExtraMetrics}
            onShowPerformanceTrend={() => setShowHistoricDataModal(true)}
          />

          {/* Fund Data Table */}
          {dashboardData.fundSummaries && dashboardData.fundSummaries.length > 0 && (
            <StockDataTable 
              fundSummaries={sortedFundSummaries} 
              onFundClick={handleFundSelect}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onSortChange={handleSortChange}
            />
          )}

          {/* Empty State */}
          {(!dashboardData.fundSummaries || dashboardData.fundSummaries.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No investments found</div>
              <div className="text-gray-400 dark:text-gray-500">Start by searching for mutual funds above</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">Welcome to your dashboard!</div>
          <div className="text-gray-400 dark:text-gray-500">Search for mutual funds to get started</div>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Show UserFundDetail if a fund is selected
  if (selectedFund) {
    return (
      <UserFundDetail
        fund={selectedFund}
        userId={user.id}
        onBack={handleBackToDashboard}
        onRecordTransaction={handleRecordTransaction}
        onRegisterSIP={handleRegisterSIP}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <div className="relative z-10">
      <DashboardNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
        user={user}
      />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {renderCurrentView()}
      </main>

      {/* Historic Data Modal */}
      {showHistoricDataModal && (
        <HistoricDataModal
          userId={user.id}
          fundId={null}
          title="Dashboard Historic Data"
          onClose={() => setShowHistoricDataModal(false)}
          fetchData={dashboardAPI.getDashboardHistoricData}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default UserDashboard;
