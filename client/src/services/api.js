import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, loading states, etc.
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle different error types
    if (response) {
      switch (response.status) {
        case 400:
          toast.error(response.data.error || 'Bad request');
          break;
        case 401:
          toast.error('Unauthorized access');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access forbidden');
          break;
        case 404:
          toast.error(response.data.error || 'Resource not found');
          break;
        case 409:
          toast.error(response.data.error || 'Conflict occurred');
          break;
        case 422:
          toast.error(response.data.error || 'Validation error');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error('An unexpected error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  // Get all products with optional filters
  getAll: (params = {}) => 
    api.get('/products', { params }),
  
  // Get a specific product by ID
  getById: (id) => 
    api.get(`/products/${id}`),
  
  // Create a new product
  create: (productData) => 
    api.post('/products', productData),
  
  // Update a product
  update: (id, productData) => 
    api.put(`/products/${id}`, productData),
  
  // Partially update a product
  patch: (id, updates) => 
    api.patch(`/products/${id}`, updates),
  
  // Delete a product
  delete: (id) => 
    api.delete(`/products/${id}`),
  
  // Get product data completeness analysis
  getCompleteness: (id) => 
    api.get(`/products/${id}/completeness`),
  
  // Advanced search
  search: (searchData) => 
    api.post('/products/search', searchData),
};

// Questions API
export const questionsAPI = {
  // Generate initial questions for a product
  generateInitial: (productId) => 
    api.post('/questions/generate', { productId }),
  
  // Generate follow-up questions
  generateFollowUp: (productId, previousAnswers) => 
    api.post('/questions/follow-up', { productId, previousAnswers }),
  
  // Submit an answer to a question
  submitAnswer: (productId, answerData) => 
    api.post(`/questions/answer?productId=${productId}`, answerData),
  
  // Submit multiple answers at once
  submitBatchAnswers: (productId, answers) => 
    api.post('/questions/batch-answer', { productId, answers }),
  
  // Get answering progress for a product
  getProgress: (productId) => 
    api.get(`/questions/progress/${productId}`),
  
  // Get question suggestions
  getSuggestions: (productId, params = {}) => 
    api.get(`/questions/suggestions/${productId}`, { params }),
  
  // Get question categories
  getCategories: () => 
    api.get('/questions/categories'),
};

// Reports API
export const reportsAPI = {
  // Generate a new report
  generate: (reportData) => 
    api.post('/reports/generate', reportData),
  
  // Get all reports with optional filters
  getAll: (params = {}) => 
    api.get('/reports', { params }),
  
  // Get a specific report by ID
  getById: (id) => 
    api.get(`/reports/${id}`),
  
  // Get report by report number
  getByNumber: (reportNumber) => 
    api.get(`/reports/number/${reportNumber}`),
  
  // Get report for a specific product
  getByProduct: (productId) => 
    api.get(`/reports/product/${productId}`),
  
  // Regenerate an existing report
  regenerate: (id, answers = {}) => 
    api.post(`/reports/${id}/regenerate`, { answers }),
  
  // Update report with additional information
  update: (id, updates) => 
    api.patch(`/reports/${id}`, updates),
  
  // Get report summary
  getSummary: (id) => 
    api.get(`/reports/${id}/summary`),
  
  // Export report in various formats
  export: (id, format = 'json') => 
    api.get(`/reports/${id}/export`, { params: { format } }),
  
  // Get analytics overview
  getAnalytics: (timeframe = '30d') => 
    api.get('/reports/analytics/overview', { params: { timeframe } }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

// Utility functions
export const apiUtils = {
  // Check if the API is healthy
  isHealthy: async () => {
    try {
      const response = await healthAPI.check();
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  // Upload file (if file upload is needed in the future)
  uploadFile: async (file, endpoint) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Download file
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      return true;
    } catch (error) {
      toast.error('Failed to download file');
      return false;
    }
  },
};

// Error handling utilities
export const errorUtils = {
  // Extract error message from various error formats
  getErrorMessage: (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  // Check if error is a network error
  isNetworkError: (error) => {
    return !error.response && error.request;
  },
  
  // Check if error is a server error
  isServerError: (error) => {
    return error.response?.status >= 500;
  },
  
  // Check if error is a client error
  isClientError: (error) => {
    return error.response?.status >= 400 && error.response?.status < 500;
  },
};

export default api;