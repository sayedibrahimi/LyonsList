// hooks/useAuth.ts
// Purpose: Custom hook to use the AuthContext
// Description: This file contains the custom hook useAuth which is used to access the AuthContext. It throws an error if the hook is used outside the AuthProvider.
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
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
