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

// Add response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {  
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (userData) => API.post('/auth/signup', userData);
export const logout = () => API.post('/auth/logout');
export const getCurrentUser = () => API.get('/auth/me');

// Publisher endpoints
export const getPublisherMagazines = () => API.get('/publisher/magazines');
export const addPublisherMagazine = (magazineData) => API.post('/publisher/magazines', magazineData);
export const updatePublisherMagazine = (magazineId, magazineData) => 
  API.put(`/publisher/magazines/${magazineId}`, magazineData);
export const deletePublisherMagazine = (magazineId) => 
  API.delete(`/publisher/magazines/${magazineId}`);

// Retailer endpoints
export const getRetailerInventory = () => API.get('/retailer/inventory');
export const addRetailerInventory = (inventoryData) => API.post('/retailer/inventory', inventoryData);
export const updateRetailerInventory = (inventoryId, inventoryData) => 
  API.put(`/retailer/inventory/${inventoryId}`, inventoryData);
export const deleteRetailerInventory = (inventoryId) => 
  API.delete(`/retailer/inventory/${inventoryId}`);

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return {
      status: 'connected',
      data: response.data
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      response: error.response?.data
    };
  }
};

console.log('API:', import.meta.env.VITE_API_URL);
export default API;
