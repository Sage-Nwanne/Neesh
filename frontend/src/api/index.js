import axios from 'axios';

// For development, use localhost:5000 directly
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API = axios.create({
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export existing API functions
export const getAvailableMagazines = async () => {
  const response = await API.get('/retailer/magazines');
  return response.data;
};

export const getRetailerOrders = async () => {
  const response = await API.get('/retailer/orders');
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await API.post('/retailer/orders', orderData);
  return response.data;
};

export const getRetailerInventory = async () => {
  const response = await API.get('/retailer/inventory');
  return response.data;
};