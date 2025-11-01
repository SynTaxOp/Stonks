import React, { useState } from 'react';
import { X, Coins, Search } from 'lucide-react';
import { sipAPI, dashboardAPI } from '../../services/api.js';

const SIPForm = ({ isOpen, onClose, fund, userId, onSuccess, sip = null }) => {
  const [formData, setFormData] = useState({
    amount: '',
    fundName: '',
    fundId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Determine if we should show fund search (only when no fund is provided)
  const showFundSearch = !fund && !sip;

  // Initialize form data when editing or when fund is provided
  React.useEffect(() => {
    if (sip) {
      setFormData({
        amount: sip.amount || '',
        fundName: sip.fundName || '',
        fundId: sip.fundId || ''
      });
    } else if (fund) {
      setFormData({
        amount: '',
        fundName: fund.schemeName || '',
        fundId: fund.schemeCode || ''
      });
    } else {
      setFormData({
        amount: '',
        fundName: '',
        fundId: ''
      });
    }
  }, [sip, fund]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFundSearch = async (searchText) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await dashboardAPI.searchFunds(searchText);
      setSearchResults(results || []);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Fund search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFundSelect = (fund) => {
    setFormData(prev => ({
      ...prev,
      fundName: fund.schemeName,
      fundId: fund.schemeCode
    }));
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate fund selection if we're showing fund search
    if (showFundSearch && (!formData.fundName || !formData.fundId)) {
      newErrors.fundName = 'Please select a fund from the search results';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const sipData = {
        fundName: formData.fundName,
        fundId: parseInt(formData.fundId),
        userId: userId,
        amount: parseFloat(formData.amount)
      };

      let response;
      if (sip) {
        // Update existing SIP
        response = await sipAPI.updateSip(sip.id, sipData);
      } else {
        // Create new SIP
        response = await sipAPI.registerSIP(sipData);
      }
      
      // The API service now returns the data directly after handling BaseResponse
      if (response) {
        onSuccess(sip ? 'SIP updated successfully!' : 'SIP registered successfully!');
        handleClose();
      } else {
        setErrors({ general: `Failed to ${sip ? 'update' : 'register'} SIP` });
      }
    } catch (error) {
      console.error(`Error ${sip ? 'updating' : 'registering'} SIP:`, error);
      setErrors({ general: `Failed to ${sip ? 'update' : 'register'} SIP. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      fundName: '',
      fundId: ''
    });
    setErrors({});
    setSearchResults([]);
    setShowSearchResults(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {sip ? 'Edit SIP' : 'Register SIP'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {sip ? 'Update your SIP details below' : 'Create a new SIP for systematic investment'}
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Fund Search Field - Only show when no fund is provided */}
            {showFundSearch && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Fund
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fundSearch"
                    value={formData.fundName}
                    onChange={(e) => {
                      handleFundSearch(e.target.value);
                      setFormData(prev => ({ ...prev, fundName: e.target.value }));
                    }}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fundName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Search for mutual fund..."
                  />
                </div>
                {errors.fundName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fundName}</p>
                )}
                
                {/* Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg z-10">
                    {searchResults.map((fund) => (
                      <div
                        key={fund.schemeCode}
                        onClick={() => handleFundSelect(fund)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{fund.schemeName}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isSearching && (
                  <div className="mt-2 text-center text-sm text-gray-500">
                    Searching funds...
                  </div>
                )}
              </div>
            )}

            {/* Fund Display - Show when fund is provided */}
            {!showFundSearch && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Fund
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="font-medium text-gray-900">{formData.fundName}</div>
                </div>
              </div>
            )}

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIP Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Coins className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter SIP amount"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <Coins className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">SIP Information</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your SIP will be registered for systematic investment in the selected fund.
                    You can modify or cancel it later from your SIP management section.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (sip ? 'Updating...' : 'Registering...') : (sip ? 'Update SIP' : 'Register SIP')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SIPForm;

