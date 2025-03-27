// client/context/AuthContext.tsx
// Purpose: Context to provide user data to the rest of the app
// Description: This file contains the AuthContext component which provides user data to the rest of the app. It also contains the AuthProvider component which manages the user data and provides functions to log in, log out, and register users.
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
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      await authService.register(data);
      // After registration, user needs to verify OTP
      // so we don't log them in automatically
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

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
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
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, verifyOTP, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};