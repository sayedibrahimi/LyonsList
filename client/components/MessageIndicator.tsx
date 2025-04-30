// client/components/MessageIndicator.tsx
// Purpose: This file contains the MessageIndicator component that displays a connection status indicator in the app.
// Description: The MessageIndicator component uses the useSocket hook to check the connection status of the WebSocket. It displays a green indicator with a Wi-Fi icon and "Connected" text when the socket is connected. The component also adapts its styles based on the current color scheme (light or dark mode).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../hooks/useSocket';
import { useColorScheme } from '../hooks/useColorScheme';

export default function MessageIndicator() {
  const { isConnected } = useSocket();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  if (!isConnected) return null;
  
  return (
    <View style={[
      styles.container, 
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <Ionicons name="wifi" size={16} color="#fff" />
      <Text style={styles.text}>Connected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  lightContainer: {
    backgroundColor: '#28a745',
  },
  darkContainer: {
    backgroundColor: '#2a9d3a',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  }
});