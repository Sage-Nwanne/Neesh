import { api } from './client';
import type { ApplicationData, Magazine, Order, ApiResponse } from '@/lib/types';

export const publisherApi = {
  // Submit publisher application
  submitApplication: async (data: ApplicationData): Promise<ApiResponse<{ applicationId: string }>> => {
    return api.post<{ applicationId: string }>('/publisher/application', data);
  },

  // Get application status
  getApplicationStatus: async (): Promise<ApiResponse<{ status: string; applicationId: string }>> => {
    return api.get<{ status: string; applicationId: string }>('/publisher/application/status');
  },

  // Get publisher dashboard data
  getDashboardData: async (): Promise<ApiResponse<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }>> => {
    return api.get('/publisher/dashboard');
  },

  // Magazine/Product management
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<{
    products: Magazine[];
    total: number;
    page: number;
    totalPages: number;
  }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    return api.get(`/publisher/products?${queryParams.toString()}`);
  },

  createProduct: async (data: Omit<Magazine, 'id' | 'publisherId' | 'publisher' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Magazine>> => {
    return api.post<Magazine>('/publisher/products', data);
  },

  updateProduct: async (id: string, data: Partial<Magazine>): Promise<ApiResponse<Magazine>> => {
    return api.put<Magazine>(`/publisher/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/publisher/products/${id}`);
  },

  // Order management
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    return api.get(`/publisher/orders?${queryParams.toString()}`);
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return api.patch<Order>(`/publisher/orders/${orderId}/status`, { status });
  },

  // Analytics
  getAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
    period?: 'day' | 'week' | 'month' | 'year';
  }): Promise<ApiResponse<{
    revenue: { date: string; amount: number }[];
    orders: { date: string; count: number }[];
    topProducts: { product: Magazine; sales: number }[];
  }>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.period) queryParams.append('period', params.period);
    
    return api.get(`/publisher/analytics?${queryParams.toString()}`);
  },
};
