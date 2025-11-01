import React, { useState, useEffect } from 'react';

const TransactionForm = ({ transaction, onSubmit, onCancel, isLoading, users = [] }) => {
  const [formData, setFormData] = useState({
    fundName: '',
    fundId: '',
    amount: '',
    date: '',
    userId: '',
    price: '',
    units: '',
    transactionType: 'BUY'
  });
  const [errors, setErrors] = useState({});

  const transactionTypes = [
    { value: 'BUY', label: 'Buy' },
    { value: 'SELL', label: 'Sell' },
    { value: 'DIVIDEND', label: 'Dividend' },
    { value: 'SWP', label: 'SWP (Systematic Withdrawal Plan)' },
    { value: 'STP', label: 'STP (Systematic Transfer Plan)' }
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        fundName: transaction.fundName || '',
        fundId: transaction.fundId?.toString() || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
        userId: transaction.userId || '',
        price: transaction.price?.toString() || '',
        units: transaction.units?.toString() || '',
        transactionType: transaction.transactionType || 'BUY'
      });
    } else {
      setFormData({
        fundName: '',
        fundId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        userId: '',
        price: '',
        units: '',
        transactionType: 'BUY'
      });
    }
    setErrors({});
  }, [transaction]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fundName.trim()) {
      newErrors.fundName = 'Fund name is required';
    }

    if (!formData.fundId.trim()) {
      newErrors.fundId = 'Fund ID is required';
    } else if (isNaN(formData.fundId) || parseInt(formData.fundId) <= 0) {
      newErrors.fundId = 'Fund ID must be a positive number';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (!formData.transactionType.trim()) {
      newErrors.transactionType = 'Transaction type is required';
    }

    // Optional fields validation
    if (formData.price.trim() && (isNaN(formData.price) || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.units.trim() && (isNaN(formData.units) || parseFloat(formData.units) <= 0)) {
      newErrors.units = 'Units must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const transactionData = {
        fundName: formData.fundName.trim(),
        fundId: parseInt(formData.fundId),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).getTime(),
        userId: formData.userId.trim(),
        transactionType: formData.transactionType,
        price: formData.price.trim() ? parseFloat(formData.price) : undefined,
        units: formData.units.trim() ? parseFloat(formData.units) : undefined
      };
      onSubmit(transactionData);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fund Name */}
            <div className="md:col-span-2">
              <label htmlFor="fundName" className="block text-sm font-medium text-gray-700 mb-1">
                Fund Name *
              </label>
              <input
                type="text"
                id="fundName"
                name="fundName"
                value={formData.fundName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fundName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter fund name"
                disabled={isLoading}
              />
              {errors.fundName && (
                <p className="mt-1 text-sm text-red-600">{errors.fundName}</p>
              )}
            </div>

            {/* Fund ID */}
            <div>
              <label htmlFor="fundId" className="block text-sm font-medium text-gray-700 mb-1">
                Fund ID *
              </label>
              <input
                type="number"
                id="fundId"
                name="fundId"
                value={formData.fundId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fundId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter fund ID"
                disabled={isLoading}
              />
              {errors.fundId && (
                <p className="mt-1 text-sm text-red-600">{errors.fundId}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                disabled={isLoading}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* User ID */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User ID *
              </label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.userId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.loginId})
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type *
              </label>
              <select
                id="transactionType"
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.transactionType ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.transactionType && (
                <p className="mt-1 text-sm text-red-600">{errors.transactionType}</p>
              )}
            </div>

            {/* Price (Optional) */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (Optional)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price per unit"
                disabled={isLoading}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Units (Optional) */}
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                Units (Optional)
              </label>
              <input
                type="number"
                id="units"
                name="units"
                value={formData.units}
                onChange={handleChange}
                step="0.0001"
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.units ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter number of units"
                disabled={isLoading}
              />
              {errors.units && (
                <p className="mt-1 text-sm text-red-600">{errors.units}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (transaction ? 'Update Transaction' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
