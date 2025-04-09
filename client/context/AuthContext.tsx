// client/context/AuthContext.tsx
// Purpose: This file contains the AuthContext and AuthProvider component, which manage authentication state and provide authentication-related functions to the rest of the application.
// Description: The AuthContext is created using React's createContext API. The AuthProvider component uses the useState and useEffect hooks to manage the authentication state, including user data, loading state, and error handling. It also provides functions for logging in, registering, verifying OTPs, sending OTPs, requesting password resets, and logging out. The context is then provided to the rest of the application through the AuthContext.Provider component.
import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string, mode: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: {
    sendOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<any>;
    setNewPassword: (email: string, password1: string, password2: string, token: string) => Promise<void>;
  };
  clearError: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Add this line


  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      setLoading(true);
      try {
        const isAuthenticated = await authService.isAuthenticated();
        if (isAuthenticated) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      // After registration, user needs to verify OTP
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOTP({ email, otp });
      setUser(response.data.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (email: string, mode: string) => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await authService.resendOTP(email);
      } else if (mode === 'reset') {
        await authService.requestPasswordReset(email);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to request password reset. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = {
  sendOTP: async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to send reset code. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  
  verifyOTP: async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyResetOTP(email, otp);
      // Return the token from the response
      return response.data.token;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  
  setNewPassword: async (email: string, password1: string, password2: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email, password1, password2, token);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Password reset failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }
};

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError('Logout failed');
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      isAuthenticated,
      login, 
      register, 
      logout, 
      verifyOTP, 
      sendOTP,
      requestPasswordReset,
      resetPassword,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};