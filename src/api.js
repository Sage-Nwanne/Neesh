// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // matches your Express base path
  withCredentials: true // optional if you’re using cookies/sessions
});

export default API;

// Add a request interceptor to include auth token
API.interceptors.request.use(
(config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
},
(error) => {
  return Promise.reject(error);
}
);

// Auth endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (userData) => API.post('/auth/signup', userData);
export const logout = () => API.post('/auth/logout');

// Publisher endpoints
export const getPublisherMagazines = () => API.get('/publisher/magazines');
export const addPublisherMagazine = (magazineData) => API.post('/publisher/magazines', magazineData);
export const updatePublisherMagazine = (magazineId, magazineData) => API.put(`/publisher/magazines/${magazineId}`, magazineData);
export const deletePublisherMagazine = (magazineId) => API.delete(`/publisher/magazines/${magazineId}`);

// Retailer endpoints
export const getRetailerInventory = () => API.get('/retailer/inventory');
export const addRetailerInventory = (inventoryData) => API.post('/retailer/inventory', inventoryData);
export const updateRetailerInventory = (inventoryId, inventoryData) => API.put(`/retailer/inventory/${inventoryId}`, inventoryData);
export const deleteRetailerInventory = (inventoryId) => API.delete(`/retailer/inventory/${inventoryId}`);
