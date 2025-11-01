import React, { useState, useRef } from 'react';
import { dashboardAPI } from '../../services/api.js';

const FundSearch = ({ onFundSelect, selectedFund, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastSearchedTerm, setLastSearchedTerm] = useState('');
  const searchTimeoutRef = useRef(null);

  const handleSearch = async (term) => {
    if (term.trim() === lastSearchedTerm) {
      return; // Don't search if term hasn't changed
    }

    if (term.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setLastSearchedTerm('');
      return;
    }

    try {
      setIsSearching(true);
      const response = await dashboardAPI.searchFunds(term);
      if (response && response.success) {
        setSearchResults(response.data || []);
        setShowResults(true);
        setLastSearchedTerm(term);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error searching funds:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value);
      }, 800); // Debounced search with 800ms delay
    } else {
      setSearchResults([]);
      setShowResults(false);
      setLastSearchedTerm('');
    }
  };

  const handleFundSelect = (fund) => {
    setSearchTerm(`${fund.schemeName} (${fund.schemeCode})`);
    setShowResults(false);
    onFundSelect(fund);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    setLastSearchedTerm('');
    onFundSelect(null);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (selectedFund) {
      setSearchTerm(`${selectedFund.schemeName} (${selectedFund.schemeCode})`);
    }
  }, [selectedFund]);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for mutual funds..."
          value={searchTerm}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={isLoading}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {isSearching ? (
            <div className="px-4 py-2 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((fund) => (
              <div
                key={fund.schemeCode}
                onClick={() => handleFundSelect(fund)}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 hover:text-blue-900"
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {fund.schemeName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Scheme Code: {fund.schemeCode}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm.length >= 2 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No funds found matching "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default FundSearch;
