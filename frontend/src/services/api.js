import axios from 'axios';
// import { UserDashboardDTO, MutualFundDTO } from '../types/index';

// In production (Docker), use empty string so requests are relative to the same origin (nginx proxies /api/* to backend)
// In development, use localhost:8080
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const dashboardAPI = {
  // Get user dashboard data (basic metrics)
  getUserDashboard: async (userId) => {
    try {
      const response = await api.get(`/api/dashboard?userId=${userId}`);
      console.log('Dashboard API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
      throw error;
    }
  },

  // Get user dashboard extra metrics (XIRR, Long Term Gains, etc.)
  getUserDashboardExtra: async (userId) => {
    try {
      const response = await api.get(`/api/dashboard/extra?userId=${userId}`);
      console.log('Dashboard Extra API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch dashboard extra');
      }
    } catch (error) {
      console.error('Error fetching dashboard extra:', error);
      throw error;
    }
  },

  // Search for mutual funds
  searchFunds: async (searchText) => {
    try {
      const response = await api.get(`/api/dashboard/searchFund?searchText=${encodeURIComponent(searchText)}`);
      console.log('Search Funds API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to search funds');
      }
    } catch (error) {
      console.error('Error searching funds:', error);
      throw error;
    }
  },

  // Get quotes
  getQuotes: async () => {
    try {
      const response = await api.get('/api/dashboard/quotes');
      console.log('Quotes API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch quotes');
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  },

  // Get dashboard historic data
  getDashboardHistoricData: async (userId) => {
    try {
      const response = await api.get(`/api/dashboard/performanceChart?userId=${userId}`);
      console.log('Dashboard Historic Data API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch dashboard historic data');
      }
    } catch (error) {
      console.error('Error fetching dashboard historic data:', error);
      throw error;
    }
  },
};

export const userAPI = {
  // Login user
  login: async (loginData) => {
    try {
      const response = await api.post('/api/users/login', loginData);
      console.log('Login API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      console.log('Get All Users API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Get user by login ID
  getUserByLoginId: async (loginId) => {
    try {
      const response = await api.get(`/api/users/login/${loginId}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching user by login ID:', error);
      throw error;
    }
  },

  // Create user
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/users', userData);
      return response.data || null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data || null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
      console.log('Delete User API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export const transactionAPI = {
  // Add single transaction
  addTransaction: async (transactionData) => {
    try {
      const response = await api.post('/api/transaction', transactionData);
      return response.data || null;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Add bulk transactions
  addBulkTransactions: async (transactionsData) => {
    try {
      const response = await api.post('/api/transaction/bulk', transactionsData);
      return response.data || null;
    } catch (error) {
      console.error('Error adding bulk transactions:', error);
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (transactionId) => {
    try {
      const response = await api.delete(`/api/transaction?transactionId=${transactionId}`);
      console.log('Delete Transaction API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        // Create an error object that preserves the API response structure
        const error = new Error(response.data?.message || 'Failed to delete transaction');
        error.response = {
          data: response.data
        };
        throw error;
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};

export const userFundAPI = {
  // Get user fund details
  getUserFundDetails: async (userId, fundId) => {
    try {
      const response = await api.get(`/api/userFund?userId=${userId}&fundId=${fundId}`);
      console.log('User Fund Details API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch user fund details');
      }
    } catch (error) {
      console.error('Error fetching user fund details:', error);
      throw error;
    }
  },

  // Update user fund properties (emergency status, tag, etc.)
  updateUserFund: async (userId, fundId, updateData) => {
    try {
      const response = await api.put(`/api/userFund?userId=${userId}&fundId=${fundId}`, updateData);
      console.log('Update User Fund API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to update user fund');
      }
    } catch (error) {
      console.error('Error updating user fund:', error);
      throw error;
    }
  },

  // Get user fund historic data (NAV history)
  getUserFundHistoricData: async (userId, fundId) => {
    try {
      const response = await api.get(`/api/userFund/historicChart?userId=${userId}&fundId=${fundId}`);
      console.log('User Fund Historic Data API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch user fund historic data');
      }
    } catch (error) {
      console.error('Error fetching user fund historic data:', error);
      throw error;
    }
  },

  // Get benchmark enums
  getBenchmarkEnums: async () => {
    try {
      const response = await api.get(`/api/userFund/benchmarkEnums`);
      console.log('Benchmark Enums API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch benchmark enums');
      }
    } catch (error) {
      console.error('Error fetching benchmark enums:', error);
      throw error;
    }
  },

  // Get user fund performance chart data (old behavior)
  getUserFundPerformanceData: async (userId, fundId) => {
    try {
      const response = await api.get(`/api/userFund/performanceChart?userId=${userId}&fundId=${fundId}`);
      console.log('User Fund Performance Data API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch user fund performance data');
      }
    } catch (error) {
      console.error('Error fetching user fund performance data:', error);
      throw error;
    }
  },

  // Delete user fund
  deleteUserFund: async (userId, fundId) => {
    try {
      const response = await api.delete(`/api/userFund?userId=${userId}&fundId=${fundId}`);
      console.log('Delete User Fund API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to delete user fund');
      }
    } catch (error) {
      console.error('Error deleting user fund:', error);
      throw error;
    }
  },
};

export const sipAPI = {
  // Register new SIP
  registerSIP: async (sipData) => {
    try {
      const response = await api.post('/api/sip', sipData);
      console.log('Register SIP API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to register SIP');
      }
    } catch (error) {
      console.error('Error registering SIP:', error);
      throw error;
    }
  },

  // Get all SIPs for a user
  getAllSips: async (userId) => {
    try {
      const response = await api.get(`/api/sip?userId=${userId}`);
      console.log('Get All SIPs API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch SIPs');
      }
    } catch (error) {
      console.error('Error fetching SIPs:', error);
      throw error;
    }
  },

  // Update existing SIP
  updateSip: async (sipId, sipData) => {
    try {
      const response = await api.put(`/api/sip?id=${sipId}`, sipData);
      console.log('Update SIP API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to update SIP');
      }
    } catch (error) {
      console.error('Error updating SIP:', error);
      throw error;
    }
  },

  // Delete SIP
  deleteSip: async (sipId) => {
    try {
      const response = await api.delete(`/api/sip?id=${sipId}`);
      console.log('Delete SIP API Response:', response.data);
      
      // Handle BaseResponse structure
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to delete SIP');
      }
    } catch (error) {
      console.error('Error deleting SIP:', error);
      throw error;
    }
  },
};

export default api;
