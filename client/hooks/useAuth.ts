// hooks/useAuth.ts
// Hook to access the AuthContext
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface AuthState {
  user: any; // Replace 'any' with the appropriate type for your user object
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
