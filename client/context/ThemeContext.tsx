// client/context/ThemeContext.tsx
// Purpose: This code defines a context provider for managing theme settings in a React Native application. It allows components to access and modify the current theme (light or dark) and its mode (system, light, or dark). The theme preference is persisted using AsyncStorage, ensuring that user settings are retained across app sessions.
// Description: The `ThemeProvider` component uses React's context API to provide theme-related values and functions to its children. It initializes the theme based on the system color scheme or user preference, allows toggling between light and dark modes, and saves the user's choice in AsyncStorage. The `useTheme` hook provides a convenient way for components to access the current theme and its properties.
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: string;
  themeMode: ThemeMode;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Compute the actual theme based on the mode
  const computeTheme = (mode: ThemeMode): string => {
    if (mode === 'system') {
      return systemColorScheme || 'light';
    }
    return mode;
  };

  const [theme, setTheme] = useState<string>(computeTheme(themeMode));
  
  // Load saved theme preference from storage on initial mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setIsInitialized(true);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Update the actual theme whenever themeMode or system preference changes
  useEffect(() => {
    setTheme(computeTheme(themeMode));
  }, [themeMode, systemColorScheme]);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeMode, isInitialized]);

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setThemeMode(prevMode => {
      if (prevMode === 'light') return 'dark';
      if (prevMode === 'dark') return 'light';
      // If it was 'system', default to 'light'
      return systemColorScheme === 'dark' ? 'light' : 'dark';
    });
  };

  // Check if the current theme is dark
  const isDarkTheme = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode, 
      isDarkTheme, 
      toggleTheme, 
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};