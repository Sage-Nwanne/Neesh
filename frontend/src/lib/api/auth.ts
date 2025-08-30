import { api } from './client';
import type { User, ApiResponse } from '@/lib/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'publisher' | 'retailer';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return api.get<User>('/auth/profile');
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put<User>('/auth/profile', data);
  },

  // Logout user
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<void>('/auth/logout');
    if (response.success) {
      localStorage.removeItem('auth_token');
    }
    return response;
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return api.post<{ token: string }>('/auth/refresh');
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/reset-password', { token, password });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/verify-email', { token });
  },
};
