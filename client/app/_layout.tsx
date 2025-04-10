// app/_layout.tsx
// Purpose: This file serves as the root layout for the application, providing a consistent structure and theme across all screens.
// Description: The RootLayout component wraps the entire application in a theme provider and includes authentication and favorites context providers. It also handles splash screen visibility and status bar configuration.
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import StackNavigator from '../components/StackNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { StatusBar } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

  // Configure the status bar globally
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
  }
  StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content');

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StackNavigator />
          </ThemeProvider>
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}