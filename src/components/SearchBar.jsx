import React, { useState, useEffect } from 'react';
import { Search, Wifi, Users, Loader } from 'lucide-react';
import useCricketData from '../hooks/useCricketData';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search players...",
  enableRealTimeSearch = false
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [realTimeSearchActive, setRealTimeSearchActive] = useState(false);

  // Get real-time player search results
  const { data: searchResults, loading: searchLoading } = 
    enableRealTimeSearch && searchTerm.length > 2 && realTimeSearchActive
      ? useCricketData.usePlayerSearch(searchTerm)
      : { data: null, loading: false };

  useEffect(() => {
    if (searchResults && enableRealTimeSearch) {
      setSuggestions(searchResults.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchResults, enableRealTimeSearch]);

  const handleSearchChange = (value) => {
    onSearchChange(value);
    
    if (enableRealTimeSearch && value.length > 2) {
      setRealTimeSearchActive(true);
    } else {
      setRealTimeSearchActive(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion.name);
    setShowSuggestions(false);
    setRealTimeSearchActive(false);
  };

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {searchLoading ? (
            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        
        {enableRealTimeSearch && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {realTimeSearchActive ? (
              <Wifi className="h-4 w-4 text-green-500" title="Real-time search active" />
            ) : (
              <Users className="h-4 w-4 text-gray-400" title="Static search" />
            )}
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center">
                  <Users size={16} className="text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    {suggestion.team && (
                      <div className="text-sm text-gray-500">{suggestion.team}</div>
                    )}
                  </div>
                  <Wifi size={12} className="ml-auto text-green-500" />
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <div className="flex items-center text-xs text-gray-600">
              <Wifi size={12} className="mr-1 text-green-500" />
              Real-time search results
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
