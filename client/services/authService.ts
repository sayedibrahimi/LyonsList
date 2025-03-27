// client/services/authService.ts
// Purpose: Handle authentication related API requests
// Description: This file contains methods for handling authentication related API requests such as login, register, verify OTP, logout, reset password, verify reset, get current user, and check if user is authenticated.
import { apiService } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    token: string;
  };
}

interface OTPVerificationData {
  email: string;
  otp: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);

      console.log('Login response:', response);
      
      // Store the token
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        // Store user data if needed
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: RegisterData): Promise<any> => {
    try {
      return await apiService.post<any>('/auth/register', userData);
    } catch (error) {
      throw error;
    }
  },
  
  verifyOTP: async (verificationData: OTPVerificationData): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/verify-otp', verificationData);
      
      // Store the token after successful verification
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      // Remove token from storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (email: string, password1: string, password2: string): Promise<any> => {
    try {
      return await apiService.post<any>('/auth/reset-password', { email, password1, password2 });
    } catch (error) {
      throw error;
    }
  },
  
  verifyReset: async (email: string, otp: string): Promise<any> => {
    try {
      return await apiService.post<any>('/auth/verify-reset', { email, otp });
    } catch (error) {
      throw error;
    }
  },
  
  // Get the current authenticated user
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
};