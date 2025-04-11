// client/services/authService.ts
// Purpose: This file contains the authentication service that handles user login, registration, OTP verification, password reset, and logout functionalities. It interacts with the backend API to perform these actions and manages user tokens using AsyncStorage.
// Description: The authService object contains methods for logging in, registering, verifying OTPs, sending OTPs, requesting password resets, and logging out. Each method makes an API call using the apiService and handles the response. It also manages user tokens using AsyncStorage to persist authentication state across app sessions.
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

      // console.log('Login response:', response);
      
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

  resendOTP: async (email: string): Promise<any> => {
    try {
      // The backend should have an endpoint to resend OTP
      return await apiService.post<any>('/auth/resend-otp', { email });
    } catch (error) {
      throw error;
    }
  },
  
  requestPasswordReset: async (email: string): Promise<any> => {
    try {
      return await apiService.post<any>('/auth/reset-password', { email });
    } catch (error) {
      throw error;
    }
  },
  
  verifyResetOTP: async (email: string, otp: string): Promise<any> => {
    try {
      // This should just verify the OTP for password reset, not actually reset the password yet
      return await apiService.post<any>('/auth/verify-reset', { email, otp });
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (email: string, password1: string, password2: string): Promise<any> => {
    try {
      return await apiService.post<any>('/auth/reset-password', { 
        email, 
        password1, 
        password2
      });
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