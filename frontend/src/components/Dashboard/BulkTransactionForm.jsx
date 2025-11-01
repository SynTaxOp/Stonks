import React, { useState } from 'react';
import { transactionAPI } from '../../services/api.js';

const BulkTransactionForm = ({ isOpen, fund, userId, onClose, onSuccess }) => {
  const [transactions, setTransactions] = useState([
    { date: '', transactionType: 'BUY', amount: '', units: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTransactionChange = (index, field, value) => {
    const newTransactions = [...transactions];
    newTransactions[index][field] = value;
    setTransactions(newTransactions);
  };

  const addTransactionField = () => {
    setTransactions([...transactions, { date: '', transactionType: 'BUY', amount: '', units: '' }]);
  };

  const removeTransactionField = (index) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(newTransactions);
  };

  const validateForm = () => {
    setError(null);
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      if (!tx.date) {
        setError(`Date is required for transaction ${i + 1}.`);
        return false;
      }
      if (!tx.transactionType) {
        setError(`Transaction type is required for transaction ${i + 1}.`);
        return false;
      }
      if (tx.transactionType === 'BUY') {
        if (!tx.amount || parseFloat(tx.amount) <= 0) {
          setError(`Amount must be a positive number for transaction ${i + 1}.`);
          return false;
        }
      } else if (tx.transactionType === 'SELL') {
        if (!tx.units || parseFloat(tx.units) <= 0) {
          setError(`Units must be a positive number for transaction ${i + 1}.`);
          return false;
        }
      }
    }
    return true;
  };

  const formatDateToDDMMYYYY = (dateString) => {
    // Convert YYYY-MM-DD to dd-MM-yyyy
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const transactionsToSend = transactions.map(tx => ({
      userId: userId,
      fundId: fund.schemeCode,
      fundName: fund.schemeName,
      amount: tx.transactionType === 'BUY' ? parseFloat(tx.amount) : 0,
      units: tx.transactionType === 'SELL' ? parseFloat(tx.units) : 0,
      date: formatDateToDDMMYYYY(tx.date), // Convert to "dd-MM-yyyy" format
      transactionType: tx.transactionType,
      price: 0  // Backend will calculate
    }));

    try {
      const response = await transactionAPI.addBulkTransactions(transactionsToSend);
      if (response && response.success) {
        onSuccess(response.data); // Pass the success message from backend
        setTransactions([{ date: '', transactionType: 'BUY', amount: '', units: '' }]); // Reset form
        onClose();
      } else {
        setError(response.message || 'Failed to add bulk transactions.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Add Bulk Transactions - {fund.schemeName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {transactions.map((tx, index) => (
                <div key={index} className="space-y-4 border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Transaction {index + 1}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Field - First */}
                    <div>
                      <label htmlFor={`date-${index}`} className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        id={`date-${index}`}
                        name="date"
                        value={tx.date}
                        onChange={(e) => handleTransactionChange(index, 'date', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        max={getTodayDate()}
                        required
                      />
                    </div>

                    {/* Transaction Type Field - Second */}
                    <div>
                      <label htmlFor={`type-${index}`} className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        id={`type-${index}`}
                        name="transactionType"
                        value={tx.transactionType}
                        onChange={(e) => handleTransactionChange(index, 'transactionType', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount Field - Show only for BUY */}
                    {tx.transactionType === 'BUY' && (
                      <div>
                        <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          id={`amount-${index}`}
                          name="amount"
                          value={tx.amount}
                          onChange={(e) => handleTransactionChange(index, 'amount', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., 5000"
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </div>
                    )}

                    {/* Units Field - Show only for SELL */}
                    {tx.transactionType === 'SELL' && (
                      <div>
                        <label htmlFor={`units-${index}`} className="block text-sm font-medium text-gray-700">
                          Units
                        </label>
                        <input
                          type="number"
                          id={`units-${index}`}
                          name="units"
                          value={tx.units}
                          onChange={(e) => handleTransactionChange(index, 'units', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., 10.5"
                          min="0.001"
                          step="0.001"
                          required
                        />
                      </div>
                    )}

                    {/* Remove Button */}
                    <div className="flex items-end">
                      {transactions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTransactionField(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove Transaction
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={addTransactionField}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Add Another Transaction
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Bulk Transactions'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkTransactionForm;
