import React from 'react';
import { Calendar, Coins, PieChart, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import TransactionTypeBadge from './TransactionTypeBadge';

const UnitsRow = ({ unit, index, formatCurrency, formatDate, formatPercentage, onDelete }) => {
  const isSold = unit.isSold || false;
  const transactionType = unit.TransactionType || unit.transactionType || 'BUY'; // Handle case variations
  const isSellTransaction = transactionType === 'SELL';
  
  // Determine row styling
  const getRowStyles = () => {
    if (isSellTransaction) {
      return {
        container: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-l-4 border-red-500 dark:border-red-600 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/40 dark:hover:to-red-800/40',
        text: 'text-red-800 dark:text-red-200',
        accent: 'text-red-600 dark:text-red-400'
      };
    } else if (isSold) {
      return {
        container: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-l-4 border-gray-400 dark:border-gray-500 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        accent: 'text-gray-600 dark:text-gray-400'
      };
    } else {
      return {
        container: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-l-4 border-green-500 dark:border-green-600 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/40 dark:hover:to-green-800/40',
        text: 'text-green-800 dark:text-green-200',
        accent: 'text-green-600 dark:text-green-400'
      };
    }
  };

  const styles = getRowStyles();

  return (
    <tr className={`${styles.container} transition-all duration-300 hover:shadow-md group`}>
      {/* Date Column */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <div className="flex items-start space-x-2">
          <Calendar className={`h-4 w-4 ${styles.accent} mt-0.5`} />
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${styles.text}`}>
              {formatDate(unit.date) === 'Invalid Date' ? (
                <span className="text-red-500 dark:text-red-400 font-bold">Invalid Date</span>
              ) : (
                formatDate(unit.date)
              )}
            </span>
            {unit.sellDate && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Sold on: {formatDate(unit.sellDate)}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Transaction Type Column */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex justify-center">
          <TransactionTypeBadge 
            transactionType={transactionType} 
            isSold={isSold}
            className="transform group-hover:scale-110 transition-transform duration-200"
          />
        </div>
      </td>

      {/* Amount Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <Coins className={`h-4 w-4 ${styles.accent}`} />
          <span className={`text-sm font-semibold ${styles.text}`}>
            {formatCurrency(unit.amount)}
          </span>
        </div>
      </td>

      {/* Units Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <PieChart className={`h-4 w-4 ${styles.accent}`} />
          <span className={`text-sm font-semibold ${styles.text}`}>
            {unit.units != null ? unit.units.toFixed(4) : '0.0000'}
          </span>
        </div>
      </td>

      {/* Sell Date moved under main Date (no separate column) */}

      {/* Profit/Loss Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          {(unit.profitLoss || 0) >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-semibold ${
            (unit.profitLoss || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(unit.profitLoss)}
          </span>
        </div>
      </td>

      {/* Profit/Loss Percentage Column */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <span className={`text-sm font-semibold ${
            (unit.profitLossPercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatPercentage(unit.profitLossPercent)}
          </span>
          {(unit.profitLossPercent || 0) >= 0 ? (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          ) : (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </td>

      {/* Actions Column */}
      {onDelete && (
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          <button
            onClick={() => onDelete(unit)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 focus:outline-none focus:underline"
            title="Delete transaction"
            disabled={!unit.transactionId}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      )}
    </tr>
  );
};

export default UnitsRow;
