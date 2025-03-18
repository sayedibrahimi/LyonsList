// src/components/StackNavigator.tsx
// StackNavigator component that uses the useAuth hook to determine which screens to show
import { useAuth } from '../hooks/useAuth';
import { Stack } from 'expo-router';

// Separate component that uses auth after the provider is in place
export default function StackNavigator() {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? ( 
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="productDetails" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}