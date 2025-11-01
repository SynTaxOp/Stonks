import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Coins, 
  PieChart, 
  Layers,
  Shield,
  Activity,
  BarChart3,
  Zap,
  RefreshCw,
  Edit3,
  Save,
  X,
  Trash2
} from 'lucide-react';
import { userFundAPI, transactionAPI } from '../../services/api.js';
import HistoricDataModal from './HistoricDataModal.jsx';
import NavHistoryModal from './NavHistoryModal.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import TransactionForm from './TransactionForm.jsx';
import SIPForm from './SIPForm.jsx';
import BulkTransactionForm from './BulkTransactionForm.jsx';
import UnitsRow from '../common/UnitsRow.jsx';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog.jsx';

const UserFundDetail = ({ fund, userId, onBack, onRecordTransaction, onRegisterSIP }) => {
  const [fundDetails, setFundDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBulkTransactionForm, setShowBulkTransactionForm] = useState(false);
  const [showSIPForm, setShowSIPForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogError, setDialogError] = useState(null);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [tagValue, setTagValue] = useState('');
  const [isEditingBenchmark, setIsEditingBenchmark] = useState(false);
  const [benchmarkValue, setBenchmarkValue] = useState('');
  const [benchmarkEnums, setBenchmarkEnums] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHistoricDataModal, setShowHistoricDataModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showDeleteFundDialog, setShowDeleteFundDialog] = useState(false);
  const [isDeletingFund, setIsDeletingFund] = useState(false);

  const loadFundDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load benchmark enums and fund details in parallel
      const [response, enums] = await Promise.all([
        userFundAPI.getUserFundDetails(userId, fund.schemeCode),
        userFundAPI.getBenchmarkEnums()
      ]);
      
      console.log('Fund Details Response:', response);
      
      if (response) {
        setFundDetails(response);
      } else {
        setError('Failed to load fund details');
      }
      
      setBenchmarkEnums(enums || []);
    } catch (err) {
      console.error('Error loading fund details:', err);
      setError('Failed to load fund details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, fund.schemeCode]);

  useEffect(() => {
    if (fund && userId) {
      loadFundDetails();
    }
  }, [fund, userId, loadFundDetails]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFundDetails();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    
    try {
      // Handle string format "dd-MM-yyyy"
      if (typeof dateString === 'string') {
        // Parse the dd-MM-yyyy format
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          
          // Create date object (month is 0-indexed in JavaScript)
          const date = new Date(year, month - 1, day);
          
          // Check if date is valid
          if (isNaN(date.getTime())) {
            return 'Invalid Date';
          }
          
          return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
      
      // Fallback for timestamp format (if needed)
      let date;
      if (typeof dateString === 'number') {
        if (dateString > 10000000000) {
          // Timestamp is in milliseconds
          date = new Date(dateString);
        } else {
          // Timestamp is in seconds
          date = new Date(dateString * 1000);
        }
      } else {
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatPercentage = (value) => {
    if (value == null || isNaN(value)) {
      return 'N/A';
    }
    return `${value.toFixed(2)}%`;
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    // Reload fund details to show updated data
    loadFundDetails();
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteTransaction = (unit) => {
    if (!unit.transactionId) {
      setError('Cannot delete transaction: No transaction ID found');
      return;
    }

    setTransactionToDelete(unit);
    setDialogError(null);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    try {
      setIsDeleting(true);
      setDialogError(null);
      setError(null);
      await transactionAPI.deleteTransaction(transactionToDelete.transactionId);
      setSuccessMessage('Transaction deleted successfully');
      // Reload fund details to show updated data
      await loadFundDetails();
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      // Close dialog on success
      setShowDeleteDialog(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      
      // Extract error message from API response
      let errorMessage = 'Please try again.';
      
      if (err.response?.data?.message) {
        // API returned a structured error response
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // Generic error message
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        // String error
        errorMessage = err;
      }
      
      setDialogError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteTransaction = () => {
    setShowDeleteDialog(false);
    setTransactionToDelete(null);
    setIsDeleting(false);
    setDialogError(null);
  };

  const handleDeleteFund = async () => {
    try {
      setIsDeletingFund(true);
      setError(null);
      
      await userFundAPI.deleteUserFund(userId, fund.schemeCode);
      
      setSuccessMessage('Fund deleted successfully. Redirecting...');
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      console.error('Error deleting fund:', err);
      setError('Failed to delete fund. Please try again.');
      setShowDeleteFundDialog(false);
    } finally {
      setIsDeletingFund(false);
    }
  };

  const handleEmergencyToggle = async () => {
    if (!fundDetails?.userFundDTO) return;
    
    try {
      setIsUpdating(true);
      const currentEmergencyStatus = fundDetails.userFundDTO.isEmergency;
      const updateData = {
        userId: userId,
        fundId: fund.schemeCode,
        fundName: fund.schemeName,
        isEmergency: !currentEmergencyStatus,
        tag: fundDetails.userFundDTO.tag || '',
        benchmark: fundDetails.userFundDTO.benchmark || null
      };
      
      await userFundAPI.updateUserFund(userId, fund.schemeCode, updateData);
      
      // Update local state instead of reloading
      setFundDetails(prev => ({
        ...prev,
        userFundDTO: {
          ...prev.userFundDTO,
          isEmergency: !currentEmergencyStatus
        }
      }));
      
      setSuccessMessage(`Fund ${!currentEmergencyStatus ? 'marked as' : 'removed from'} emergency fund`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating emergency status:', error);
      setError('Failed to update emergency status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTagEdit = () => {
    setTagValue(fundDetails?.userFundDTO?.tag || '');
    setIsEditingTag(true);
  };

  const handleTagSave = async () => {
    if (!fundDetails?.userFundDTO) return;
    
    try {
      setIsUpdating(true);
      const updateData = {
        userId: userId,
        fundId: fund.schemeCode,
        fundName: fund.schemeName,
        isEmergency: fundDetails.userFundDTO.isEmergency,
        tag: tagValue.trim(),
        benchmark: fundDetails.userFundDTO.benchmark || null
      };
      
      await userFundAPI.updateUserFund(userId, fund.schemeCode, updateData);
      
      // Update local state instead of reloading
      setFundDetails(prev => ({
        ...prev,
        userFundDTO: {
          ...prev.userFundDTO,
          tag: tagValue.trim()
        }
      }));
      
      setSuccessMessage('Tag updated successfully');
      setIsEditingTag(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating tag:', error);
      setError('Failed to update tag. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTagCancel = () => {
    setIsEditingTag(false);
    setTagValue('');
  };

  const handleBenchmarkEdit = () => {
    setBenchmarkValue(userFundDTO?.benchmark || '');
    setIsEditingBenchmark(true);
  };

  const handleBenchmarkSave = async () => {
    if (!fundDetails?.userFundDTO) return;
    
    // Validate benchmark value
    if (benchmarkValue && !benchmarkEnums.includes(benchmarkValue)) {
      setError('Invalid benchmark value. Please select a valid option.');
      return;
    }
    
    try {
      setIsUpdating(true);
      const updateData = {
        userId: userId,
        fundId: fund.schemeCode,
        fundName: fund.schemeName,
        isEmergency: fundDetails.userFundDTO.isEmergency,
        tag: fundDetails.userFundDTO.tag || '',
        benchmark: benchmarkValue || null
      };
      
      await userFundAPI.updateUserFund(userId, fund.schemeCode, updateData);
      
      // Update local state instead of reloading
      setFundDetails(prev => ({
        ...prev,
        userFundDTO: {
          ...prev.userFundDTO,
          benchmark: benchmarkValue || null
        }
      }));
      
      setSuccessMessage('Benchmark updated successfully');
      setIsEditingBenchmark(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating benchmark:', error);
      setError('Failed to update benchmark. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBenchmarkCancel = () => {
    setIsEditingBenchmark(false);
    setBenchmarkValue('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm text-gray-500">Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md w-full">
          <ErrorMessage message={error} onClose={() => setError(null)} />
          <button
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            type="button"
            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!fundDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md w-full">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-6">No fund details found</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              type="button"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { userFundDTO, summary, extraSummary, units, registeredSIPs } = fundDetails;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Top Row - Back & Title */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              type="button"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Fund Name Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{fund.schemeName}</h1>
              <div className="flex flex-wrap items-center gap-4">
                {fundDetails?.latestNav && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">NAV:</span>
                    <span className="text-lg font-semibold text-gray-900">₹{fundDetails.latestNav.toFixed(2)}</span>
                  </div>
                )}
                {fundDetails?.latestNavDate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm font-medium text-gray-700">{formatDate(fundDetails.latestNavDate)}</span>
                  </div>
                )}
                <button
                  onClick={() => setShowHistoricDataModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">NAV History</span>
                  <span className="sm:hidden">NAV</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={() => setShowBulkTransactionForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Bulk Transaction</span>
                <span className="sm:hidden">Bulk</span>
              </button>
              <button
                onClick={() => setShowSIPForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Register SIP</span>
                <span className="sm:hidden">SIP</span>
              </button>
              <button
                onClick={() => setShowDeleteFundDialog(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete Fund</span>
                <span className="sm:hidden">Delete</span>
              </button>
              <button
                onClick={() => setShowPerformanceModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Investment Performance Graph</span>
                <span className="sm:hidden">Perf Graph</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
            <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Fund Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Invested */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Coins className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Invested</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary?.totalInvested)}</p>
              </div>
            </div>
          </div>

          {/* Current Value */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Value</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary?.totalValue)}</p>
                {summary?.todayProfit != null && (
                  <p className={`text-sm font-semibold mt-1.5 ${
                    summary.todayProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Today: {summary.todayProfit >= 0 ? '+' : ''}{formatCurrency(summary.todayProfit)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profit/Loss */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                (summary?.profitLoss || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <PieChart className={`h-5 w-5 ${
                  (summary?.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Profit/Loss</p>
                <p className={`text-xl font-bold ${
                  (summary?.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(summary?.profitLoss)}
                </p>
                <p className={`text-xs font-medium ${
                  (summary?.profitLossPercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(summary?.profitLossPercent)}
                </p>
              </div>
            </div>
          </div>

          {/* XIRR */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">XIRR</p>
                <p className="text-xl font-bold text-gray-900">{formatPercentage(extraSummary?.xirr)}</p>
              </div>
            </div>
          </div>

          {/* Long Term Gains */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Long Term Gains</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(extraSummary?.longTermGains)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fund Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Fund Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Fund Information</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Fund Name */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Fund Name</span>
                <span className="text-sm font-medium text-gray-900">{userFundDTO?.fundName}</span>
              </div>

              {/* Tag */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Tag</span>
                {isEditingTag ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tagValue}
                      onChange={(e) => setTagValue(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter tag"
                      maxLength={50}
                    />
                    <button
                      onClick={handleTagSave}
                      disabled={isUpdating}
                      className="p-1.5 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleTagCancel}
                      disabled={isUpdating}
                      className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{userFundDTO?.tag || 'No tag'}</span>
                    <button
                      onClick={handleTagEdit}
                      disabled={isUpdating}
                      className="p-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Benchmark */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Benchmark</span>
                {isEditingBenchmark ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={benchmarkValue}
                      onChange={(e) => setBenchmarkValue(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Not Set</option>
                      {benchmarkEnums.map((benchmark, index) => (
                        <option key={index} value={benchmark}>
                          {benchmark}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleBenchmarkSave}
                      disabled={isUpdating}
                      className="p-1.5 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleBenchmarkCancel}
                      disabled={isUpdating}
                      className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{userFundDTO?.benchmark || 'Not Set'}</span>
                    <button
                      onClick={handleBenchmarkEdit}
                      disabled={isUpdating}
                      className="p-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Emergency Fund */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Emergency Fund</span>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium flex items-center ${
                    userFundDTO?.isEmergency ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {userFundDTO?.isEmergency ? (
                      <>
                        <Shield className="w-4 h-4 mr-1" />
                        Yes
                      </>
                    ) : (
                      'No'
                    )}
                  </span>
                  <button
                    onClick={handleEmergencyToggle}
                    disabled={isUpdating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                      userFundDTO?.isEmergency ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        userFundDTO?.isEmergency ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Total Units */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Total Units</span>
                <span className="text-sm font-semibold text-gray-900">
                  {summary?.totalUnits != null ? summary.totalUnits.toFixed(4) : '0.0000'}
                </span>
              </div>
            </div>
          </div>

          {/* Registered SIPs Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Registered SIPs</h3>
            </div>
            <div className="p-6">
              {registeredSIPs && registeredSIPs.length > 0 ? (
                <div className="space-y-3">
                  {registeredSIPs.map((sip, index) => (
                    <div key={sip.id || index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">{sip.fundName}</p>
                          <p className="text-xs text-gray-500">Monthly SIP</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(sip.amount)}</p>
                          <p className="text-xs text-gray-500">per month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-2">No SIPs registered</p>
                  <p className="text-xs text-gray-400">Click "Register SIP" to set up a new SIP</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Units History */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Units History</h3>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                  <span>Sold</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <span>SELL</span>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {units && units.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      P&L %
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {units.map((unit, index) => (
                    <UnitsRow
                      key={index}
                      unit={unit}
                      index={index}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      formatPercentage={formatPercentage}
                      onDelete={handleDeleteTransaction}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-2">No units history available</p>
                <p className="text-xs text-gray-400">Record transactions to see units history</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forms */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        fund={fund}
        userId={userId}
        onSuccess={handleSuccess}
      />
      <BulkTransactionForm
        isOpen={showBulkTransactionForm}
        onClose={() => setShowBulkTransactionForm(false)}
        fund={fund}
        userId={userId}
        onSuccess={handleSuccess}
      />
      <SIPForm
        isOpen={showSIPForm}
        onClose={() => setShowSIPForm(false)}
        fund={fund}
        userId={userId}
        onSuccess={handleSuccess}
      />

      {/* Delete Transaction Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-red-50 rounded-full">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Delete Transaction</h3>

              {/* Message */}
              {transactionToDelete && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 text-center mb-4">Are you sure you want to delete this transaction?</p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(transactionToDelete.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(transactionToDelete.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Units:</span>
                      <span className="font-medium text-gray-900">{transactionToDelete.units?.toFixed(4) || '0.0000'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 text-center mt-4 font-medium">This action cannot be undone.</p>
                </div>
              )}

              {/* Error Message */}
              {dialogError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-red-800">{dialogError}</p>
                      {dialogError.includes('Redeemed Transaction') && (
                        <p className="text-xs text-red-600 mt-1">Tip: Redeemed transactions cannot be deleted.</p>
                      )}
                    </div>
                    <button onClick={() => setDialogError(null)} className="text-red-600 hover:text-red-800">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteTransaction}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTransaction}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV History Modal */}
      {showHistoricDataModal && (
        <NavHistoryModal
          userId={userId}
          fundId={fund.schemeCode || fund.fundId}
          title={`NAV History - ${fund.schemeName || fund.name}`}
          onClose={() => setShowHistoricDataModal(false)}
          fetchData={userFundAPI.getUserFundHistoricData}
        />
      )}

      {/* Performance Chart Modal */}
      {showPerformanceModal && (
        <HistoricDataModal
          userId={userId}
          fundId={fund.schemeCode || fund.fundId}
          title={`Performance Chart - ${fund.schemeName || fund.name}`}
          onClose={() => setShowPerformanceModal(false)}
          fetchData={userFundAPI.getUserFundPerformanceData}
        />
      )}

      {/* Delete Fund Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteFundDialog}
        onClose={() => setShowDeleteFundDialog(false)}
        onConfirm={handleDeleteFund}
        title="Delete Fund"
        warningMessage="This action will permanently delete all transactions, SIPs, and historical data associated with this fund. You will lose all performance analysis, tracking information, and charts. If you want to track this investment again in the future, you will need to manually reenter all transaction details."
        confirmText="Delete Fund"
        cancelText="Cancel"
        isLoading={isDeletingFund}
        confirmationWord="Delete"
      />
    </div>
  );
};

export default UserFundDetail;