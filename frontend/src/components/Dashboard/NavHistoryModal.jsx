import React, { useState, useEffect, useMemo } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const NavHistoryModal = ({ userId, fundId, title, onClose, fetchData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState('1Y'); // 7D, 15D, 1M, 6M, YTD, 1Y, 5Y, MAX

  const timeWindows = ['7D', '15D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchData(userId, fundId);
        console.log('NAV History Data Response:', response);
        
        // Check if response is an array
        if (Array.isArray(response)) {
          setData(response);
        } else if (response && typeof response === 'object') {
          // If it's an object, try to extract the array from common properties
          const dataArray = response.data || response.chartData || response.historicData || response.navHistory || Object.values(response)[0] || [];
          setData(Array.isArray(dataArray) ? dataArray : []);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error loading NAV history:', err);
        setError('Failed to load NAV history');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, fundId, fetchData]);

  // Detect data keys
  const navKey = useMemo(() => 
    data[0] ? Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('nav') || 
      key.toLowerCase().includes('value') ||
      key.toLowerCase().includes('price')
    ) : null
  , [data]);

  const dateKey = useMemo(() => 
    data[0] ? Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('date') || 
      key.toLowerCase().includes('time')
    ) : null
  , [data]);

  // Filter data based on time window (show all points without sampling)
  const filteredData = useMemo(() => {
    if (!data || data.length === 0 || !dateKey) return [];

    console.log('📊 Total data points received from API:', data.length);
    
    const now = new Date();
    let cutoffDate = new Date();

    switch (selectedWindow) {
      case '7D':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '15D':
        cutoffDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case 'YTD':
        cutoffDate = new Date(now.getFullYear(), 0, 1);
        break;
      case '1Y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case '5Y':
        cutoffDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      case 'MAX':
      default:
        cutoffDate = new Date(0); // Start from beginning
        break;
    }

    // Helper function to parse DD-MM-YYYY format dates
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      try {
        // Try parsing as DD-MM-YYYY format
        const parts = dateStr.split('-');
        if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
          // DD-MM-YYYY format
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        // Try standard date parsing
        return new Date(dateStr);
      } catch {
        return null;
      }
    };

    // Sort data by date first
    let sortedData = [...data].sort((a, b) => {
      try {
        const dateA = parseDate(a[dateKey]);
        const dateB = parseDate(b[dateKey]);
        if (!dateA || !dateB) return 0;
        return dateA - dateB;
      } catch {
        return 0;
      }
    });

    // For 7D and 15D, just show the last N points from entire dataset (no date filtering)
    // For other windows, filter by date
    let filtered;
    if (selectedWindow === '7D') {
      // Just take the last 7 data points from the entire dataset
      filtered = sortedData.slice(-7);
    } else if (selectedWindow === '15D') {
      // Just take the last 15 data points from the entire dataset
      filtered = sortedData.slice(-15);
    } else {
      // Filter data by date - from today going back to cutoffDate
      filtered = sortedData.filter(item => {
        try {
          const itemDate = parseDate(item[dateKey]);
          if (!itemDate) return true; // Keep item if date parsing fails
          return itemDate >= cutoffDate && itemDate <= now;
        } catch {
          return true; // Keep item if date parsing fails
        }
      });
    }

    console.log(`📈 Filtered data for ${selectedWindow}: ${filtered.length} points`);
    console.log('📅 Date range:', { 
      from: cutoffDate.toISOString(), 
      to: now.toISOString() 
    });

    return filtered;
  }, [data, dateKey, selectedWindow]);

  // Helper function to parse DD-MM-YYYY format dates (used in stats calculation)
  const parseDateForStats = (dateStr) => {
    if (!dateStr) return null;
    try {
      // Try parsing as DD-MM-YYYY format
      const parts = dateStr.split('-');
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        // DD-MM-YYYY format
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
      // Try standard date parsing
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0 || !navKey) {
      return { currentValue: 0, change: 0, changePercent: 0 };
    }

    // Sort by date to ensure correct order for stats calculation
    const sortedData = [...filteredData].sort((a, b) => {
      try {
        const dateA = parseDateForStats(a[dateKey]);
        const dateB = parseDateForStats(b[dateKey]);
        if (!dateA || !dateB) return 0;
        return dateA - dateB;
      } catch {
        return 0;
      }
    });

    const currentValue = sortedData[sortedData.length - 1]?.[navKey] || 0;
    const firstValue = sortedData[0]?.[navKey] || 0;
    const change = currentValue - firstValue;
    const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

    return {
      currentValue,
      change,
      changePercent
    };
  }, [filteredData, navKey, dateKey]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      // Try parsing DD-MM-YYYY format
      const parts = dateString.split('-');
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        // DD-MM-YYYY format
        const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        return date.toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      // Try standard parsing
      return new Date(dateString).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatValue = (value) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex items-center justify-center p-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0 || !navKey) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">{error || 'No NAV history available'}</p>
            {!navKey && (
              <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto max-w-md mx-auto">
                {JSON.stringify(data.slice(0, 2), null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stats.changePercent >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Statistics Section */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{formatValue(stats.currentValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Change (%)</p>
              <div className="flex items-center space-x-2">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '↑' : '↓'}{Math.abs(stats.changePercent).toFixed(2)}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Change (₹)</p>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : '-'}₹{Math.abs(formatValue(stats.change))}
              </p>
            </div>
          </div>

          {/* Time Window Selector */}
          <div className="mb-6 flex items-center space-x-2">
            {timeWindows.map((window) => (
              <button
                key={window}
                onClick={() => setSelectedWindow(window)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedWindow === window
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {window}
              </button>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">NAV History - {selectedWindow}</h3>
            <ResponsiveContainer width="100%" height={600}>
              <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                <defs>
                  <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey={dateKey} 
                  tickFormatter={(value) => {
                    try {
                      // Parse DD-MM-YYYY format
                      const parts = value.split('-');
                      let date;
                      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                        date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                      } else {
                        date = new Date(value);
                      }
                      const now = new Date();
                      const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
                      
                      if (daysDiff < 30) {
                        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                      } else {
                        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
                      }
                    } catch {
                      return value;
                    }
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => `₹${formatValue(value)}`} 
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    
                    return (
                      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                        {payload.map((entry, index) => (
                          <div key={index}>
                            <p className="text-xs text-gray-500 mb-1">
                              {formatDate(entry.payload[dateKey])}
                            </p>
                            <p className="font-semibold" style={{ color: entry.color }}>
                              ₹{formatValue(entry.value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Area 
                  type="linear" 
                  dataKey={navKey} 
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#colorNav)" 
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={true}
                  activeDot={{ r: 6, fill: isPositive ? '#10b981' : '#ef4444' }}
                  name="NAV" 
                />
                <Brush 
                  dataKey={dateKey} 
                  height={40} 
                  stroke="#8884d8"
                  fill="#f0f0f0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavHistoryModal;
