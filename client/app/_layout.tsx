// client/app/_layout.tsx
// Purpose: This file defines the root layout for the app, including the navigation theme and authentication context.
// Description: The RootLayout component uses the Expo Router's ThemeProvider to set the navigation theme based on the user's color scheme. It also wraps the app in authentication and favorites context providers for state management. The SplashScreen is used to prevent flickering during app initialization.
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import StackNavigator from '../components/StackNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { StatusBar } from 'react-native';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  // Set status bar properties
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
  }
  StatusBar.setBarStyle('dark-content');

  return (
    <AuthProvider>
      <FavoritesProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StackNavigator />
        </ThemeProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}