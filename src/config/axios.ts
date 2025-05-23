import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { authService } from '../services/authService';

// Set base URL for all API requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Add request interceptor to include auth headers
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = authService.getAuthHeader();
    config.headers.set(headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('authCredentials');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default axios; 