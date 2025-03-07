// app/_layout.tsx (for Expo Router)
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout(): React.ReactElement {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
  );
}