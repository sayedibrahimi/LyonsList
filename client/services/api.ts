// client/services/api.ts
// Purpose: This file contains the API service for making HTTP requests using Axios.
// Description: It includes a base URL, request and response interceptors, and helper methods for common HTTP methods (GET, POST, PUT, PATCH, DELETE). It also includes a method for uploading images for AI processing.
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
console.log('BASE_URL:', BASE_URL);

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
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
  
  // Upload image for AI processing
  uploadImageForAI: async <T>(
    imageBase64: string, 
    fileName: string, 
    condition: string, 
    mimeType: string = 'image/jpeg'
  ): Promise<T> => {
    try {
      console.log("Using image, base64 length:", imageBase64 ? imageBase64.length : 0);
      
      if (!imageBase64) {
        throw new Error('No base64 image data available');
      }
      
      // Create JSON payload with explicit mime type
      const jsonPayload = {
        condition,
        imageData: imageBase64,
        fileName,
        mimeType
      };
      
      // Your server IP address - consider using BASE_URL instead of hardcoding
      const apiUrl = '/upload/';
      console.log("Attempting to connect to:", BASE_URL + apiUrl);
      
      const response: AxiosResponse<T> = await api.post(apiUrl, jsonPayload);
      console.log('Upload response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('API error details:', error);
      throw new Error('Failed to process image data');
    }
  }
};

export default api;