import React, { useState } from 'react';
import { X, Calendar, Coins, ArrowUpDown } from 'lucide-react';
import { transactionAPI } from '../../services/api.js';

const TransactionForm = ({ isOpen, onClose, fund, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    transactionType: 'BUY',
    amount: '',
    units: '',
    inputType: 'amount' // 'amount' or 'units'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInputTypeChange = (inputType) => {
    setFormData(prev => ({
      ...prev,
      inputType,
      amount: '',
      units: ''
    }));
    
    // Clear related errors
    setErrors(prev => ({
      ...prev,
      amount: '',
      units: '',
      inputValidation: ''
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData(prev => ({
      ...prev,
      date: selectedDate
    }));
    
    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.transactionType) {
      newErrors.transactionType = 'Transaction type is required';
    }

    // Validate based on selected input type
    if (formData.inputType === 'amount') {
      if (!formData.amount || formData.amount <= 0) {
        newErrors.amount = 'Amount is required and must be greater than 0';
      }
    } else {
      if (!formData.units || formData.units <= 0) {
        newErrors.units = 'Units are required and must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForAPI = (dateString) => {
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

    try {
      setIsSubmitting(true);
      
      const transactionData = {
        fundName: fund.schemeName,
        userId: userId,
        fundId: fund.schemeCode,
        amount: formData.inputType === 'amount' && formData.amount ? parseFloat(formData.amount) : null,
        units: formData.inputType === 'units' && formData.units ? parseFloat(formData.units) : null,
        date: formatDateForAPI(formData.date),
        transactionType: formData.transactionType
      };

      const response = await transactionAPI.addTransaction(transactionData);
      
      if (response && response.success) {
        onSuccess('Transaction recorded successfully!');
        handleClose();
      } else {
        setErrors({ general: response?.message || 'Failed to record transaction' });
      }
    } catch (error) {
      console.error('Error recording transaction:', error);
      setErrors({ general: 'Failed to record transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      units: '',
      date: '',
      transactionType: 'BUY',
      inputType: 'amount'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Record Transaction</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">Fund: <span className="font-medium">{fund?.schemeName}</span></p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Date Field - First */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Transaction Type Field - Second */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ArrowUpDown className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.transactionType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              {errors.transactionType && (
                <p className="mt-1 text-sm text-red-600">{errors.transactionType}</p>
              )}
            </div>

            {/* Input Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specify by
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleInputTypeChange('amount')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    formData.inputType === 'amount'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Coins className="h-4 w-4 inline mr-2" />
                  Amount (₹)
                </button>
                <button
                  type="button"
                  onClick={() => handleInputTypeChange('units')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    formData.inputType === 'units'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowUpDown className="h-4 w-4 inline mr-2" />
                  Units
                </button>
              </div>
            </div>

            {/* Dynamic Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.inputType === 'amount' ? 'Amount (₹)' : 'Units'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.inputType === 'amount' ? (
                    <Coins className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ArrowUpDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="number"
                  name={formData.inputType === 'amount' ? 'amount' : 'units'}
                  value={formData.inputType === 'amount' ? formData.amount : formData.units}
                  onChange={handleChange}
                  step={formData.inputType === 'amount' ? '0.01' : '0.001'}
                  min="0"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    (formData.inputType === 'amount' ? errors.amount : errors.units) ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={formData.inputType === 'amount' ? 'Enter amount' : 'Enter units'}
                />
              </div>
              {(formData.inputType === 'amount' ? errors.amount : errors.units) && (
                <p className="mt-1 text-sm text-red-600">
                  {formData.inputType === 'amount' ? errors.amount : errors.units}
                </p>
              )}
            </div>

          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Recording...' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;

