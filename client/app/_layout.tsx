import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import StackNavigator from '../components/StackNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/AuthContext';

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

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StackNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}