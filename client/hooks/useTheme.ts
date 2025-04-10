// client/hooks/useTheme.ts
// Purpose: This code defines a custom hook `useTheme` that provides theme-related functionality in a React Native application. It allows components to access the current theme, toggle between light and dark modes, and set the theme mode based on user preference or system settings.
// Description: The `useTheme` hook uses React's context API to access the theme context. It checks if the hook is used within a `ThemeProvider`. If not, it falls back to default values and logs a warning in development mode. The hook also uses the system color scheme to determine the current theme when not provided by the context. This ensures that components can adapt their styles based on the user's theme preference or system settings.
import { useContext } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

// Default theme values when outside provider
const defaultTheme = {
  theme: 'light' as const,
  themeMode: 'system' as const,
  isDarkTheme: false,
  toggleTheme: () => {}, // No-op function
  setThemeMode: () => {}, // No-op function
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    // When used outside of ThemeProvider, return default values
    // and log a warning in development
    if (__DEV__) {
      console.warn(
        'useTheme() was called outside of ThemeProvider. Using default light theme.'
      );
    }
    
    // Return a sensible default
    const systemTheme = useSystemColorScheme();
    return {
      ...defaultTheme,
      theme: systemTheme || 'light',
      isDarkTheme: systemTheme === 'dark',
    };
  }
  
  return context;
};