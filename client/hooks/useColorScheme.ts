// client/hooks/useColorScheme.ts
// Purpose: This code defines a custom hook `useColorScheme` that provides the current color scheme (light or dark) for a React Native application. It first checks if the theme context is available and uses that value; if not, it falls back to the system color scheme. This allows components to adapt their styles based on the user's theme preference or system settings.
// Description: The `useColorScheme` hook uses React's context API to access the theme context. If the context is available, it returns the theme from it; otherwise, it uses the system color scheme. This ensures that components can adapt their styles based on the user's theme preference or system settings.
import { useContext } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export function useColorScheme() {
  // First try to use the theme context
  const context = useContext(ThemeContext);
  
  // If the context is available, use the theme from it
  if (context !== undefined) {
    return context.theme as 'light' | 'dark';
  }
  
  // Fallback to system color scheme if theme context is not available
  return useSystemColorScheme() || 'light';
}