import axios from 'axios';

// For development, use localhost:5000 directly
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000 // 10 second timeout
});

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (userData) => API.post('/auth/signup', userData);
export const logout = () => {
  localStorage.removeItem('token');
  return API.post('/auth/logout');
};
export const getCurrentUser = () => API.get('/auth/me');

// Publisher API calls
export const getPublisherMagazines = () => API.get('/publisher/magazines');
export const createMagazine = (magazineData) => API.post('/publisher/magazines', magazineData);
export const updateMagazine = (id, magazineData) => API.put(`/publisher/magazines/${id}`, magazineData);
export const deleteMagazine = (id) => API.delete(`/publisher/magazines/${id}`);
export const getPublisherOrders = () => API.get('/publisher/orders');

// Retailer API calls
export const getAvailableMagazines = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return API.get(`/retailer/magazines${queryString ? `?${queryString}` : ''}`);
};
export const getRetailerOrders = () => API.get('/retailer/orders');
export const createOrder = (orderData) => API.post('/retailer/orders', orderData);
export const cancelOrder = (id) => API.put(`/retailer/orders/${id}`, { status: 'cancelled' });
export const getRetailerInventory = () => API.get('/retailer/inventory');

// Health check
export const healthCheck = () => API.get('/health');

export default API;
