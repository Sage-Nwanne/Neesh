import { API } from './index.js';

export const createCheckoutSession = async (data) => {
  try {
    const response = await API.post('/payments/create-checkout-session', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create checkout session');
  }
};

export const getPaymentStatus = async (sessionId) => {
  try {
    const response = await API.get(`/payments/status/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get payment status');
  }
};
