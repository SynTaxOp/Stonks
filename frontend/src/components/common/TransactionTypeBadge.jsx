import React from 'react';
import { TrendingUp, TrendingDown, XCircle } from 'lucide-react';

const TransactionTypeBadge = ({ transactionType, isSold, className = '' }) => {
  const normalizedTransactionType = (transactionType || 'BUY').toUpperCase();
  const isSellTransaction = normalizedTransactionType === 'SELL';
  const isBuyTransaction = normalizedTransactionType === 'BUY';
  
  // Determine the styling based on transaction type and status
  const getBadgeStyles = () => {
    if (isSellTransaction) {
      return {
        container: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200',
        icon: 'text-red-100',
        text: 'font-bold',
        animation: 'animate-pulse'
      };
    } else if (isBuyTransaction) {
      if (isSold) {
        return {
          container: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md',
          icon: 'text-gray-200',
          text: 'font-medium',
          animation: ''
        };
      } else {
        return {
          container: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200',
          icon: 'text-green-100',
          text: 'font-bold',
          animation: 'animate-pulse'
        };
      }
    } else {
      // Default BUY styling
      return {
        container: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200',
        icon: 'text-green-100',
        text: 'font-bold',
        animation: 'animate-pulse'
      };
    }
  };

  const styles = getBadgeStyles();

  const getIcon = () => {
    if (isSellTransaction) {
      return <TrendingDown className={`h-3 w-3 ${styles.icon}`} />;
    } else if (isBuyTransaction && isSold) {
      return <XCircle className={`h-3 w-3 ${styles.icon}`} />;
    } else {
      return <TrendingUp className={`h-3 w-3 ${styles.icon}`} />;
    }
  };

  const getText = () => {
    if (isSellTransaction) {
      return 'SELL';
    } else if (isBuyTransaction && isSold) {
      return 'REDEEMED';
    } else {
      return 'BUY';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs ${styles.container} ${styles.animation} ${className} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center space-x-1">
        {getIcon()}
        <span className={`${styles.text} tracking-wide`}>
          {getText()}
        </span>
      </div>
      
      {/* Add a subtle glow effect for active transactions */}
      {!isSold && !isSellTransaction && (
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
      )}
    </div>
  );
};

export default TransactionTypeBadge;
