import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Coins, 
  ChevronUp, 
  ChevronDown, 
  X, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { sipAPI, transactionAPI } from '../../services/api.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

const SIPTransactionsPage = ({ userId, onBack, onSuccess }) => {
  // Get userId from URL parameters if not provided as prop
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
  };

  const effectiveUserId = userId || getUserIdFromUrl();
  const [sips, setSips] = useState([]);
  const [sipTransactions, setSipTransactions] = useState([]);
  const [sipDate, setSipDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (effectiveUserId) {
      loadSIPs();
    }
  }, [effectiveUserId]);

  const loadSIPs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sipAPI.getAllSips(effectiveUserId);
      // The API service now returns the data directly after handling BaseResponse
      if (response) {
        setSips(response || []);
        // Initialize SIP transactions with default values
        initializeSIPTransactions(response || []);
      } else {
        setError('Failed to load SIPs');
      }
    } catch (err) {
      console.error('Error loading SIPs:', err);
      setError('Failed to load SIPs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeSIPTransactions = (sipsData) => {
    const today = new Date().toISOString().split('T')[0];
    const transactions = sipsData.map(sip => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      sipId: sip.id,
      fundName: sip.fundName,
      fundId: sip.fundId,
      amount: sip.amount,
      date: sipDate || today,
      originalAmount: sip.amount
    }));
    setSipTransactions(transactions);
  };

  const handleSIPDateChange = (date) => {
    setSipDate(date);
    // Update all transaction dates
    setSipTransactions(prev => 
      prev.map(transaction => ({
        ...transaction,
        date: date
      }))
    );
  };

  const handleAmountChange = (transactionId, amount) => {
    setSipTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, amount: parseFloat(amount) || 0 }
          : transaction
      )
    );
  };

  const handleDateChange = (transactionId, date) => {
    setSipTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, date: date }
          : transaction
      )
    );
  };

  const incrementDate = (transactionId) => {
    setSipTransactions(prev =>
      prev.map(transaction => {
        if (transaction.id === transactionId) {
          const currentDate = new Date(transaction.date);
          currentDate.setDate(currentDate.getDate() + 1);
          return { ...transaction, date: currentDate.toISOString().split('T')[0] };
        }
        return transaction;
      })
    );
  };

  const decrementDate = (transactionId) => {
    setSipTransactions(prev =>
      prev.map(transaction => {
        if (transaction.id === transactionId) {
          const currentDate = new Date(transaction.date);
          currentDate.setDate(currentDate.getDate() - 1);
          return { ...transaction, date: currentDate.toISOString().split('T')[0] };
        }
        return transaction;
      })
    );
  };

  const removeTransaction = (transactionId) => {
    setSipTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
  };


  const validateTransactions = () => {
    return sipTransactions.every(transaction => 
      transaction.fundName && 
      transaction.amount > 0 && 
      transaction.date
    );
  };

  const handleSubmit = async () => {
    if (!validateTransactions()) {
      setError('Please fill in all required fields for all transactions');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const bulkTransactions = sipTransactions.map(transaction => ({
        fundName: transaction.fundName,
        userId: effectiveUserId,
        fundId: transaction.fundId,
        amount: transaction.amount,
        date: formatDateForAPI(transaction.date),
        transactionType: 'BUY'
      }));

      const response = await transactionAPI.addBulkTransactions(bulkTransactions);
      
      // The API service now returns the data directly after handling BaseResponse
      if (response) {
        setSuccessMessage('SIP transactions registered successfully!');
        onSuccess('SIP transactions registered successfully!');
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setError(response?.message || 'Failed to register SIP transactions');
      }
    } catch (err) {
      console.error('Error submitting SIP transactions:', err);
      setError('Failed to register SIP transactions. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (!effectiveUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Invalid Access</h3>
          <p className="text-gray-500 mb-6">User ID is required to access SIP Transactions</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading SIPs...</p>
        </div>
      </div>
    );
  }

  if (error && !sips.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage message={error} onClose={() => setError(null)} />
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Register SIP Transactions
                  </h1>
                  <p className="text-sm text-gray-600">Process your SIP investments for a specific date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* SIP Date Selection */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 mr-3 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">SIP Date</h3>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select the date for SIP transactions
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={sipDate}
                onChange={(e) => handleSIPDateChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              This date will be applied to all SIP transactions by default
            </p>
          </div>
        </div>

        {/* SIP Transactions List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Zap className="h-6 w-6 mr-3 text-green-600" />
                  SIP Transactions
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {sipTransactions.length} transaction{sipTransactions.length !== 1 ? 's' : ''} ready to process
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden">
            {sipTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-gray-500 font-medium">No SIP transactions to process</p>
                <p className="text-sm text-gray-400 mt-2">Add transactions or check your SIPs</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sipTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      {/* Fund Name */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-bold text-lg">
                                {transaction.fundName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 break-words">
                              {transaction.fundName || 'Fund Name'}
                            </div>
                            <div className="text-xs text-gray-500">
                              Transaction #{index + 1}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount (₹)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Coins className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={transaction.amount}
                            onChange={(e) => handleAmountChange(transaction.id, e.target.value)}
                            step="0.01"
                            min="0"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter amount"
                          />
                        </div>
                        {transaction.originalAmount && (
                          <p className="text-xs text-gray-500 mt-1">
                            Original: {formatCurrency(transaction.originalAmount)}
                          </p>
                        )}
                      </div>

                      {/* Date */}
                      <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transaction Date
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decrementDate(transaction.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <div className="flex-1">
                            <input
                              type="date"
                              value={transaction.date}
                              onChange={(e) => handleDateChange(transaction.id, e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            />
                          </div>
                          <button
                            onClick={() => incrementDate(transaction.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => removeTransaction(transaction.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Remove transaction"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {sipTransactions.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={submitting || !validateTransactions()}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg font-semibold"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Processing Transactions...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit SIP Transactions
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIPTransactionsPage;
