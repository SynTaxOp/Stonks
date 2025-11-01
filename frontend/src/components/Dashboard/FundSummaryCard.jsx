import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Tag, 
  Coins,
  PieChart,
  Award,
  Calendar,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';

const FundSummaryCard = ({ fund }) => {
  const isProfit = fund.profitLoss >= 0;
  const profitLossColor = isProfit ? 'text-green-600' : 'text-red-600';
  const profitLossBgColor = isProfit ? 'bg-green-50' : 'bg-red-50';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (percentage) => {
    if (percentage == null || isNaN(percentage)) {
      return 'N/A';
    }
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const formatXIRR = (xirr) => {
    if (xirr == null || isNaN(xirr)) {
      return 'N/A';
    }
    return `${xirr.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden">
      {/* Header with Gradient */}
      <div className={`px-6 py-4 ${fund.isEmergency ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-100 transition-colors">
              {fund.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-blue-100 text-sm">ID: {fund.fundId}</span>
              {fund.isEmergency && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Emergency
                </span>
              )}
            </div>
          </div>
          {fund.tag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
              <Tag className="w-3 h-3 mr-1" />
              {fund.tag}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Investment Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Invested</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(fund.totalInvested)}</p>
                </div>
                <Coins className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Value</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(fund.totalValue)}</p>
                </div>
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Units</p>
                <p className="text-lg font-bold text-gray-700">
                  {fund.totalUnits != null ? fund.totalUnits.toFixed(4) : '0.0000'}
                </p>
              </div>
              <PieChart className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Profit/Loss Section */}
        <div className={`p-4 rounded-xl ${profitLossBgColor} mb-6`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className="text-sm font-semibold text-gray-700">Unrealized P&L</span>
            </div>
            <div className="text-right">
              <div className={`font-bold text-lg ${profitLossColor}`}>
                {formatCurrency(Math.abs(fund.profitLoss))}
              </div>
              <div className={`text-sm font-medium ${profitLossColor}`}>
                {formatPercentage(fund.profitLossPercent)}
              </div>
            </div>
          </div>
        </div>

        {/* Realized Profits Section */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <Award className="w-4 h-4 mr-2 text-emerald-600" />
            Realized Profits
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total</p>
                  <p className="text-sm font-bold text-emerald-600">
                    {formatCurrency(fund.totalRealizedProfit)}
                  </p>
                </div>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">This Year</p>
                  <p className="text-sm font-bold text-orange-600">
                    {formatCurrency(fund.currentYearTotalRealizedProfit)}
                  </p>
                </div>
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* XIRR */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-sm font-semibold text-gray-700">XIRR</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">
              {formatXIRR(fund.xirr)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer with Performance Indicator */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center">
            <Zap className="w-3 h-3 mr-1 text-gray-400" />
            Performance
          </span>
          <span className={`font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? 'Profitable' : 'Loss'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundSummaryCard;
