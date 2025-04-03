// client/services/api.ts
// Purpose: Create a reusable Axios instance with interceptors for handling common HTTP methods
// Description: This file contains a reusable Axios instance with interceptors for handling common HTTP methods. It also includes a helper method for making HTTP requests with different methods (GET, POST, PUT, PATCH, DELETE).
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
console.log('BASE_URL:', BASE_URL);

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');

    // Logs for debugging purposes
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    console.log('Request Headers:', config.headers);
    console.log('Request Data:', config.data);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Logs for debugging purposes
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    return response},
  async (error) => {
    // Handle unauthorized errors (401)
    console.log('Response Error:', error);
    // Logs for debugging purposes
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', error.response.data);
    }

    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem('userToken');
      // You might want to add navigation to login screen here
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common HTTP methods
export const apiService = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // POST request
  post: async <T>(url: string, data: any): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PUT request
  put: async <T>(url: string, data: any): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PATCH request
  patch: async <T>(url: string, data: any): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.patch(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file (multipart/form-data)
  upload: async <T>(url: string, formData: FormData): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;