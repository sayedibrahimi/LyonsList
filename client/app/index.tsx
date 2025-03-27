// client/app/index.tsx
// Purpose: Index component to redirect to the appropriate screen based on user authentication
// Description: This file contains the Index component which uses the useAuth hook to determine whether the user is authenticated or not. If the user is authenticated, it redirects to the search screen, otherwise it redirects to the login screen.
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)/search' : '/auth/login'} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});