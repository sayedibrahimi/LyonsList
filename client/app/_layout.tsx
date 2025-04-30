// app/_layout.tsx
// Purpose: This file serves as the root layout for the React Native application, managing themes, authentication, and socket connections.
// Description: The RootLayout component initializes the application by setting up context providers for theme management, authentication, favorites, and socket connections. It also handles splash screen visibility and status bar configuration based on the current color scheme. The RootLayoutContent component is responsible for rendering the main navigation stack with the appropriate theme.
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
import { SocketProvider } from '../context/SocketContext';

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
            <SocketProvider>
            <RootLayoutContent />
            </SocketProvider>
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