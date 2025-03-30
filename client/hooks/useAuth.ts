// client/hooks/useAuth.ts
// Purpose: This file contains a custom hook that provides access to the authentication context.
// Description: The useAuth hook uses the useContext hook to access the AuthContext. It returns the authentication state and functions, allowing components to easily access authentication-related data and actions. The hook also throws an error if used outside of an AuthProvider, ensuring that it is only used in the correct context.
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
    verifyOTP: (email: string, otp: string) => Promise<void>;
    setNewPassword: (email: string, password1: string, password2: string) => Promise<void>;
  };
  clearError: () => void;
}

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};