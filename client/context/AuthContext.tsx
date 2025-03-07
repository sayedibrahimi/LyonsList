// context/AuthContext.tsx
// AuthContext component that provides user data to the rest of the app
import { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthState {
  user: any; // Replace 'any' with your actual user type
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from async storage or API
    const loadUser = async () => {
      setLoading(true);
      // Fake user data or fetch from storage
      const storedUser = null; // Replace with async storage logic
      setUser(storedUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
