// client/components/StackNavigator.tsx
// Purpose: StackNavigator component that uses the useAuth hook to determine which screens to show
// Description: This file contains the StackNavigator component that uses the useAuth hook to determine which screens to show based on whether the user is authenticated or not. If the user is authenticated, it shows the main app screens, otherwise it shows the authentication screens.
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function StackNavigator() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? ( 
        // Authenticated stack
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="productDetails" options={{ headerShown: false }} />
        </>
      ) : (
        // Non-authenticated stack
        <>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});