// app/_layout.tsx
// Purpose: This file defines the root layout for the app.
// Description: It sets up the main navigation structure and theme provider for the app.
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import StackNavigator from '../components/StackNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Replace this with any initialization logic you need
    const prepare = async () => {
      // Simulate delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsReady(true);
    };

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <RootLayoutContent />
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// This component uses the theme context after it's established
function RootLayoutContent() {
  // Import useColorScheme here since it now has access to ThemeProvider
  const { useColorScheme } = require('@/hooks/useColorScheme');
  const colorScheme = useColorScheme();

  // Configure the status bar globally
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
  }
  StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content');

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StackNavigator />
    </NavigationThemeProvider>
  );
}