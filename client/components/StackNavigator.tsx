// client/components/StackNavigator.tsx
// Purpose: This component manages the navigation stack for the app, displaying different screens based on the user's authentication status.
// Description: The StackNavigator component uses the Expo Router and React Navigation to create a stack of screens. It checks the user's authentication status using a custom hook (useAuth) and conditionally renders different screens based on whether the user is logged in or not. While loading, it displays an ActivityIndicator.
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
          <Stack.Screen name="postImage" options={{ headerShown: false }} />
          <Stack.Screen name="postDetails" options={{ headerShown: false }} />
          <Stack.Screen name="myListings" options={{ headerShown: false }} />
          <Stack.Screen name="myProductDetails" options={{ headerShown: false }} />
          <Stack.Screen name="editListing" options={{ headerShown: false }} />
          <Stack.Screen name="conversation" options={{ headerShown: false }} />
        </>
      ) : (
        // Non-authenticated stack
        <>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/otp-verification" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="auth/new-password" options={{ headerShown: false }} />
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