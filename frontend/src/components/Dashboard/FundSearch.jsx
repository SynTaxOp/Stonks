import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

const FundSearch = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchedText, setLastSearchedText] = useState('');
  const searchTimeoutRef = useRef(null);

  // Only search when text has actually changed and user stops typing
  const handleSearch = async (text) => {
    if (text.trim() === lastSearchedText) {
      return; // Don't search if text hasn't changed
    }

    if (text.trim().length < 2) {
      setLastSearchedText('');
      onSearch('');
      return;
    }

    try {
      setIsSearching(true);
      await onSearch(text);
      setLastSearchedText(text);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search - only search when text changes and user stops typing
  const handleTextChange = (value) => {
    setSearchText(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value);
      }, 800); // Increased delay to 800ms for better UX
    } else {
      setLastSearchedText('');
      onSearch('');
    }
  };

  const handleClear = () => {
    setSearchText('');
    setLastSearchedText('');
    onSearch('');
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

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Search for mutual funds..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {searchText && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      {searchText && (
        <p className="mt-2 text-sm text-gray-600">
          {isSearching ? 'Searching...' : 'Type to search for mutual funds'}
        </p>
      )}
    </div>
  );
};

export default FundSearch;
