import React from 'react';
import { PieChart, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import TransactionTypeBadge from '../common/TransactionTypeBadge';
import UnitsRow from '../common/UnitsRow';

const UserFundDetails = ({ fundDetails, isLoading, onDeleteUnit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading fund details...</span>
      </div>
    );
  }

  if (!fundDetails) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">No fund details found</div>
        <div className="text-gray-400">Please select a user and fund to view details</div>
      </div>
    );
  }

  const { userFundDTO, summary, units, registeredSIPs } = fundDetails;

  return (
    <div className="space-y-6">
      {/* Fund Summary Card */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{summary.name}</h3>
            <p className="text-sm text-gray-500">Fund ID: {summary.fundId}</p>
            {summary.tag && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {summary.tag}
              </span>
            )}
            {summary.isEmergency && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                Emergency Fund
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Total Invested</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.totalInvested)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Current Value</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.totalValue)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Total Units</div>
            <div className="text-lg font-semibold text-gray-900">
              {summary.totalUnits.toFixed(4)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">XIRR</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatPercentage(summary.xirr)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Profit/Loss</div>
            <div className={`text-lg font-semibold ${
              summary.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(summary.profitLoss)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Profit/Loss %</div>
            <div className={`text-lg font-semibold ${
              summary.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(summary.profitLossPercent)}
            </div>
          </div>
        </div>
      </div>

      {/* Units History */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Units History
            </h3>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active BUY</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Sold BUY</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>SELL</span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/L %
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {units && units.length > 0 ? (
                units.map((unit, index) => (
                  <UnitsRow
                    key={index}
                    unit={unit}
                    index={index}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    formatPercentage={formatPercentage}
                    onDelete={onDeleteUnit}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No units history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered SIPs */}
      {registeredSIPs && registeredSIPs.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Registered SIPs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fund Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fund ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registeredSIPs.map((sip) => (
                  <tr key={sip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sip.fundName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sip.fundId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sip.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFundDetails;
