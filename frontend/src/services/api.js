import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Forbidden: You do not have permission to access this resource');
      } else if (status === 404) {
        console.error('Resource not found');
      } else if (status >= 500) {
        console.error('Server error occurred');
      }
      
      return Promise.reject(data || error.message);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
      return Promise.reject('Network error: Please check your connection');
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      return Promise.reject(error.message);
    }
  }
);

// API utility functions
export const apiUtils = {
  // Handle file uploads with progress tracking
  uploadFile: async (endpoint, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };

    return api.post(endpoint, formData, config);
  },

  // Handle polling for long-running operations
  pollStatus: async (endpoint, interval = 2000, maxAttempts = 30) => {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        attempts++;
        
        try {
          const response = await api.get(endpoint);
          const { status, data } = response.data;
          
          if (status === 'completed') {
            clearInterval(poll);
            resolve(data);
          } else if (status === 'failed') {
            clearInterval(poll);
            reject(new Error('Operation failed'));
          } else if (attempts >= maxAttempts) {
            clearInterval(poll);
            reject(new Error('Timeout: Operation took too long'));
          }
        } catch (error) {
          clearInterval(poll);
          reject(error);
        }
      }, interval);
    });
  },
};

export default api;