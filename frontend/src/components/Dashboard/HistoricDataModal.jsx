import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const HistoricDataModal = ({ userId, fundId, title, onClose, fetchData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Visibility toggles for Graph 1 (Investment Overview)
  const [graph1Visibility, setGraph1Visibility] = useState({
    totalValue: true,
    totalInvested: true,
    thisMonthInvested: true,
    totalValueBenchmark: false,
    totalValueNifty50: false,
    totalValueNifty100: false,
  });
  
  // Visibility toggles for Graph 2 (Profit Analysis)
  const [graph2Visibility, setGraph2Visibility] = useState({
    thisMonthProfit: true,
    totalProfit: true,
    growthPercent: true,
  });

  // Custom bar shape for conditional colors
  const ProfitBar = (props) => {
    const { x, y, width, height, payload } = props;
    const value = payload?.thisMonthProfit || 0;
    const fill = value >= 0 ? '#10b981' : '#ef4444';
    
    // Handle negative values - rect needs absolute height and adjusted y position
    const rectHeight = Math.abs(height || 0);
    const rectY = height < 0 ? y + height : y;
    
    return <rect x={x} y={rectY} width={width} height={rectHeight} fill={fill} />;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchData(userId, fundId);
        console.log('Historic Data Response:', response);
        
        // Check if response is an array
        if (Array.isArray(response)) {
          setData(response);
        } else if (response && typeof response === 'object') {
          // If it's an object, try to extract the array from common properties
          const dataArray = response.data || response.chartData || response.historicData || [];
          setData(Array.isArray(dataArray) ? dataArray : []);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error loading historic data:', err);
        setError('Failed to load historic data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, fundId, fetchData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(2) || 0}%`;
  };
  
  // Toggle handlers
  const toggleGraph1Series = (series) => {
    setGraph1Visibility(prev => ({ ...prev, [series]: !prev[series] }));
  };
  
  const toggleGraph2Series = (series) => {
    setGraph2Visibility(prev => ({ ...prev, [series]: !prev[series] }));
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

  if (error || !data || data.length === 0) {
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
            <p className="text-gray-600">{error || 'No historic data available'}</p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex-1 overflow-hidden p-6">
          <div className="space-y-8">
            {/* Graph 1: Total Value, Total Invested, This Month Invested, and Benchmarks */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Investment Overview vs Benchmarks
                </h3>
                <div className="flex flex-wrap gap-3 text-xs">
                  <button onClick={() => toggleGraph1Series('totalValue')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph1Visibility.totalValue ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Total Value
                  </button>
                  <button onClick={() => toggleGraph1Series('totalInvested')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph1Visibility.totalInvested ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Investment
                  </button>
                  <button onClick={() => toggleGraph1Series('thisMonthInvested')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph1Visibility.thisMonthInvested ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Month's Inv
                  </button>
                  <button onClick={() => toggleGraph1Series('totalValueBenchmark')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph1Visibility.totalValueBenchmark ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Benchmark
                  </button>
                  <button onClick={() => toggleGraph1Series('totalValueNifty50')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph1Visibility.totalValueNifty50 ? 'bg-brown-100 border-brown-500 text-brown-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Nifty 50
                  </button>
                  <button onClick={() => toggleGraph1Series('totalValueNifty100')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph1Visibility.totalValueNifty100 ? 'bg-pink-100 border-pink-500 text-pink-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Nifty 100
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={500}>
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      
                      const dataPoint = payload[0]?.payload;
                      const alphaPercent = dataPoint?.alphaPercent;
                      
                      return (
                        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">
                            {label}
                          </p>
                          {payload.map((entry, index) => {
                            let value = entry.value;
                            let formattedValue = formatCurrency(value);
                            
                            return (
                              <p key={index} style={{ color: entry.color }}>
                                {`${entry.name}: ${formattedValue}`}
                              </p>
                            );
                          })}
                          {alphaPercent != null && (
                            <p className="text-gray-700 font-medium mt-2 pt-2 border-t border-gray-200">
                              {`Alpha %: ${formatPercentage(alphaPercent)}`}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  {graph1Visibility.totalValue && <Line type="monotone" dataKey="totalValue" stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8' }} activeDot={{ r: 6 }} name="Total Value" />}
                  {graph1Visibility.totalInvested && <Line type="monotone" dataKey="totalInvested" stroke="#82ca9d" strokeWidth={2} dot={{ fill: '#82ca9d' }} activeDot={{ r: 6 }} name="Total Investment" />}
                  {graph1Visibility.totalValueBenchmark && <Line type="monotone" dataKey="totalValueBenchmark" stroke="#ff7300" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#ff7300' }} activeDot={{ r: 6 }} name="Benchmark" />}
                  {graph1Visibility.totalValueNifty50 && <Line type="monotone" dataKey="totalValueNifty50" stroke="#8c564b" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: '#8c564b' }} activeDot={{ r: 6 }} name="Nifty 50" />}
                  {graph1Visibility.totalValueNifty100 && <Line type="monotone" dataKey="totalValueNifty100" stroke="#e377c2" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: '#e377c2' }} activeDot={{ r: 6 }} name="Nifty 100" />}
                  {graph1Visibility.thisMonthInvested && <Bar dataKey="thisMonthInvested" fill="#ffc658" name="Month's Investment" />}
                  <Brush dataKey="month" height={30} stroke="#8884d8" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Graph 2: This Month Profit, Total Profit, Growth % */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Profit & Growth Analysis
                </h3>
                <div className="flex flex-wrap gap-3 text-xs">
                  <button onClick={() => toggleGraph2Series('thisMonthProfit')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph2Visibility.thisMonthProfit ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Month's Profit
                  </button>
                  <button onClick={() => toggleGraph2Series('totalProfit')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph2Visibility.totalProfit ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Total Profit
                  </button>
                  <button onClick={() => toggleGraph2Series('growthPercent')} className={`px-3 py-1.5 rounded-lg border transition-colors ${graph2Visibility.growthPercent ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Growth %
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={500}>
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={formatCurrency} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={formatPercentage} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      
                      return (
                        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">
                            {label}
                          </p>
                          {payload.map((entry, index) => {
                            let value = entry.value;
                            let formattedValue;
                            
                            if (entry.dataKey === 'growthPercent') {
                              formattedValue = formatPercentage(value);
                            } else {
                              formattedValue = formatCurrency(value);
                            }
                            
                            return (
                              <p key={index} style={{ color: entry.color }}>
                                {`${entry.name}: ${formattedValue}`}
                              </p>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  {graph2Visibility.thisMonthProfit && <Bar yAxisId="left" dataKey="thisMonthProfit" name="Month's Profit" shape={ProfitBar} />}
                  {graph2Visibility.totalProfit && <Line yAxisId="left" type="monotone" dataKey="totalProfit" stroke="#82ca9d" strokeWidth={2} dot={{ fill: '#82ca9d' }} activeDot={{ r: 6 }} name="Total Profit" />}
                  {graph2Visibility.growthPercent && <Line yAxisId="right" type="monotone" dataKey="growthPercent" stroke="#ffc658" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#ffc658' }} activeDot={{ r: 6 }} name="Growth %" />}
                  <Brush dataKey="month" height={30} stroke="#8884d8" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricDataModal;

