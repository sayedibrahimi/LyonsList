// app/(tabs)/_layout.tsx
// Purpose: This file defines the layout for the tab navigation in the app.
// Description: It sets up the tab bar with different screens and their respective icons.
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Platform, StatusBar, useColorScheme as useSystemColorScheme } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout(): React.ReactElement {
  const insets = useSafeAreaInsets();
  
  // Try to use our custom hook, fall back to system if not available
  let colorScheme: string;
  try {
    colorScheme = useColorScheme();
  } catch (error) {
    // Fall back to system color scheme if our hook fails
    colorScheme = useSystemColorScheme() || 'light';
  }
  
  const isDarkMode = colorScheme === 'dark';
  
  // Set status bar properties for Android
  if (Platform.OS === 'android') {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  } else {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  }
  
  return (
    <View style={{ 
      flex: 1, 
      paddingTop: insets.top, 
      backgroundColor: isDarkMode ? '#151718' : '#ffffff',
    }}>
      <Tabs 
        screenOptions={{ 
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1e2022' : '#ffffff',
            borderTopColor: isDarkMode ? '#333' : '#eee',
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: isDarkMode ? '#9BA1A6' : '#687076',
        }}
      >
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
            tabBarStyle: { display: 'none' }, // Hide tab label
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" color={color} size={size} />,
          }}
        />
      </Tabs>
    </View>
  );
}