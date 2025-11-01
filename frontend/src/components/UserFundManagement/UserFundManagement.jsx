import React, { useState, useEffect } from 'react';
import { userFundAPI, userAPI } from '../../services/api.js';
import UserFundDetails from './UserFundDetails.jsx';
import FundSearch from './FundSearch.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

const UserFundManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundDetails, setFundDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      if (response && response.success) {
        setUsers(response.data || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setSelectedFund(null);
    setFundDetails(null);
    setError(null);
  };

  const handleFundSelect = (fund) => {
    setSelectedFund(fund);
    setError(null);
  };

  const handleViewDetails = async () => {
    if (!selectedUser || !selectedFund) {
      setError('Please select both a user and a fund to view details.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await userFundAPI.getUserFundDetails(selectedUser, selectedFund.schemeCode);
      
      if (response && response.success) {
        setFundDetails(response.data);
      } else {
        setError(response?.message || 'No fund details found for the selected user and fund.');
      }
    } catch (err) {
      console.error('Error fetching fund details:', err);
      setError('Failed to fetch fund details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedUser('');
    setSelectedFund(null);
    setFundDetails(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Fund Details</h1>
            <p className="mt-2 text-gray-600">
              View detailed information about user's fund investments including units history and performance.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User Selection */}
            <div>
              <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Select User *
              </label>
              <select
                id="userSelect"
                value={selectedUser}
                onChange={handleUserChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.loginId})
                  </option>
                ))}
              </select>
            </div>

            {/* Fund Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Fund *
              </label>
              <FundSearch
                onFundSelect={handleFundSelect}
                selectedFund={selectedFund}
                isLoading={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-end space-x-2">
              <button
                onClick={handleViewDetails}
                disabled={!selectedUser || !selectedFund || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Loading...' : 'View Details'}
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Selected Fund Info */}
        {selectedFund && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Selected Fund: {selectedFund.schemeName}
                </h3>
                <p className="text-sm text-blue-700">
                  Scheme Code: {selectedFund.schemeCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedUser && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  How to use this tool
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Select a user from the dropdown</li>
                    <li>Search for a mutual fund using the search box</li>
                    <li>Click "View Details" to see the user's fund details</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fund Details */}
      <UserFundDetails fundDetails={fundDetails} isLoading={loading} />
    </div>
  );
};

export default UserFundManagement;
