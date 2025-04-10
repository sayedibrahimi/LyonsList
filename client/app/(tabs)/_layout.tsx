// app/(tabs)/_layout.tsx
// Purpose: This file defines the layout for the tab navigation in the app, including the tab bar and its screens.
// Description: The TabLayout component uses the Expo Router's Tabs component to create a tabbed navigation interface. Each tab has an icon and label, and the layout is adjusted for safe area insets to avoid overlapping with system UI elements like the status bar.
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function TabLayout(): React.ReactElement {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Tabs 
        screenOptions={{ 
          headerShown: false,
          tabBarHideOnKeyboard: true,
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