import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Coins, 
  Edit, 
  Trash2, 
  Plus, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { sipAPI } from '../../services/api.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import SIPForm from './SIPForm.jsx';
import SIPTransactionsPage from './SIPTransactionsPage.jsx';

const SIPManagement = ({ userId, onSuccess }) => {
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSIPForm, setShowSIPForm] = useState(false);
  const [showSIPTransactions, setShowSIPTransactions] = useState(false);
  const [editingSIP, setEditingSIP] = useState(null);
  const [deletingSIP, setDeletingSIP] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sipToDelete, setSipToDelete] = useState(null);

  const loadSIPs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sipAPI.getAllSips(userId);
      
      // The API service now returns the data directly after handling BaseResponse
      if (response) {
        setSips(response || []);
      } else {
        setError('Failed to load SIPs');
      }
    } catch (err) {
      console.error('Error loading SIPs:', err);
      setError('Failed to load SIPs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadSIPs();
    }
  }, [userId, loadSIPs]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSIPs();
    setRefreshing(false);
  };

  const handleEdit = (sip) => {
    setEditingSIP(sip);
    setShowSIPForm(true);
  };

  const handleDelete = (sip) => {
    setSipToDelete(sip);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!sipToDelete) return;

    try {
      setDeletingSIP(sipToDelete.id);
      const response = await sipAPI.deleteSip(sipToDelete.id);
      
      // The API service now returns the data directly after handling BaseResponse
      if (response) {
        onSuccess('SIP deleted successfully!');
        await loadSIPs();
        setShowDeleteConfirm(false);
        setSipToDelete(null);
      } else {
        setError('Failed to delete SIP');
      }
    } catch (err) {
      console.error('Error deleting SIP:', err);
      setError('Failed to delete SIP. Please try again.');
    } finally {
      setDeletingSIP(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSipToDelete(null);
  };

  const handleSIPSuccess = (message) => {
    onSuccess(message);
    setShowSIPForm(false);
    setEditingSIP(null);
    loadSIPs();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getSIPStatus = (sip) => {
    // This would need to be determined based on your business logic
    // For now, we'll show all as active
    return 'active';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'stopped':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stopped':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading SIPs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage message={error} onClose={() => setError(null)} />
          <button
            onClick={handleRefresh}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SIP Management
                </h1>
                <p className="text-gray-600">Manage your Systematic Investment Plans</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => setShowSIPForm(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New SIP
              </button>
              <button
                onClick={() => setShowSIPTransactions(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Register SIP Transactions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No SIPs Found</h3>
            <p className="text-gray-500 mb-6">Start building your investment portfolio with a Systematic Investment Plan</p>
            <button
              onClick={() => setShowSIPForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Create Your First SIP
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats - Moved to top */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SIP Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{sips.length}</div>
                  <div className="text-sm text-gray-600">Total SIPs</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(sips.reduce((sum, sip) => sum + (sip.amount || 0), 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Monthly Investment</div>
                </div>
              </div>
            </div>

            {/* SIPs Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your SIPs</h3>
                <p className="text-sm text-gray-500">Manage your Systematic Investment Plans</p>
              </div>
              
              <div className="overflow-hidden">
                <table className="w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fund Name
                      </th>
                      <th className="w-1/4 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sips.map((sip) => {
                      const status = getSIPStatus(sip);
                      return (
                        <tr
                          key={sip.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium text-sm">
                                    {sip.fundName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 break-words">
                                  {sip.fundName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">
                            <div className="flex items-center justify-end space-x-1">
                              <Coins className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold">{formatCurrency(sip.amount)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(sip)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(sip)}
                                disabled={deletingSIP === sip.id}
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                              >
                                {deletingSIP === sip.id ? (
                                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-1" />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && sipToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete SIP</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete this SIP?
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{sipToDelete.fundName}</h4>
                      <p className="text-sm text-gray-500">SIP Amount</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(sipToDelete.amount)}
                      </p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-red-600 mt-3">
                  ⚠️ This will permanently remove the SIP from your account.
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={deletingSIP === sipToDelete.id}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingSIP === sipToDelete.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deletingSIP === sipToDelete.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete SIP
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIP Form Modal */}
      {showSIPForm && (
        <SIPForm
          isOpen={showSIPForm}
          onClose={() => {
            setShowSIPForm(false);
            setEditingSIP(null);
          }}
          sip={editingSIP}
          userId={userId}
          onSuccess={handleSIPSuccess}
        />
      )}

      {/* SIP Transactions Modal */}
      {showSIPTransactions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <SIPTransactionsPage
                userId={userId}
                onBack={() => setShowSIPTransactions(false)}
                onSuccess={handleSIPSuccess}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SIPManagement;
