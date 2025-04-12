// client/screens/AccountScreen.tsx
// Purpose: This code defines an AccountScreen component that displays user account information, including profile details, a list of menu items, and a logout button. It also includes a theme toggle for light and dark modes. The screen adapts its appearance based on the user's authentication status and theme preference.
// Description: The AccountScreen component uses React Native components to create a user interface that displays the user's profile information and a list of menu items. It utilizes hooks for managing authentication state and theme preferences. The screen also includes styles for both light and dark modes, ensuring a consistent user experience across different themes.
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import ThemeToggle from '../components/ThemeToggle';
import { useColorScheme } from '@/hooks/useColorScheme';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function AccountScreen(): React.ReactElement {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const menuItems: MenuItem[] = [
    { 
      id: 'listings', 
      title: 'My Listings', 
      icon: 'list',
      onPress: () => router.push({
        pathname: '/myListings',
      })
    },
    { 
      id: 'purchases', 
      title: 'Purchase History', 
      icon: 'cart',
      onPress: () => Alert.alert('Purchases', 'Navigate to purchases') 
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: 'settings',
      onPress: () => Alert.alert('Settings', 'Navigate to settings') 
    },
    { 
      id: 'help', 
      title: 'Help & Support', 
      icon: 'help-circle',
      onPress: () => Alert.alert('Help', 'Navigate to help') 
    }
  ];
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              setTimeout(() => {
                router.replace('/auth/login');
              }, 100);
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
        styles.loadingContainer
      ]}>
        <ActivityIndicator size="large" color={isDarkMode ? "#4a9eff" : "#007BFF"} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer
      ]}>
        <View style={[
          styles.header,
          isDarkMode ? styles.darkHeader : styles.lightHeader
        ]}>
          <Text style={[
            styles.headerTitle,
            isDarkMode ? styles.darkText : styles.lightText
          ]}>My Account</Text>
        </View>
        <View style={styles.notLoggedInContainer}>
          <Ionicons 
            name="lock-closed-outline" 
            size={50} 
            color={isDarkMode ? "#9BA1A6" : "#999"} 
          />
          <Text style={[
            styles.notLoggedInText,
            isDarkMode ? styles.darkText : styles.lightText
          ]}>Please log in to view your account</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <View style={[
        styles.header,
        isDarkMode ? styles.darkHeader : styles.lightHeader
      ]}>
        <Text style={[
          styles.headerTitle,
          isDarkMode ? styles.darkText : styles.lightText
        ]}>My Account</Text>
      </View>
      
      <ScrollView 
        style={[
          styles.content,
          isDarkMode ? styles.darkContent : styles.lightContent
        ]}
      >
        <View style={[
          styles.profileSection,
          isDarkMode ? styles.darkProfileSection : styles.lightProfileSection
        ]}>
          <View style={[
            styles.profileImagePlaceholder,
            isDarkMode ? styles.darkProfileImagePlaceholder : styles.lightProfileImagePlaceholder
          ]}>
            <Ionicons 
              name="person" 
              size={50} 
              color={isDarkMode ? "#ECEDEE" : "#666"} 
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[
              styles.userName,
              isDarkMode ? styles.darkText : styles.lightText
            ]}>{user.firstName} {user.lastName}</Text>
            <Text style={[
              styles.userEmail,
              isDarkMode ? styles.darkSubText : styles.lightSubText
            ]}>{user.email}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={[
                styles.editButtonText,
                isDarkMode ? { color: '#4a9eff' } : { color: '#007BFF' }
              ]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[
          styles.menuSection,
          isDarkMode ? styles.darkMenuSection : styles.lightMenuSection
        ]}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                isDarkMode ? styles.darkMenuItem : styles.lightMenuItem
              ]}
              onPress={item.onPress}
            >
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={isDarkMode ? "#4a9eff" : "#007BFF"} 
              />
              <Text style={[
                styles.menuItemText,
                isDarkMode ? styles.darkText : styles.lightText
              ]}>{item.title}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={isDarkMode ? "#9BA1A6" : "#ccc"} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Theme Toggle Section */}
        <View style={[
          styles.menuSection,
          isDarkMode ? styles.darkMenuSection : styles.lightMenuSection
        ]}>
          <ThemeToggle />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.logoutButton,
            isDarkMode ? styles.darkLogoutButton : styles.lightLogoutButton
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#151718',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lightContent: {
    backgroundColor: '#f8f9fa',
  },
  darkContent: {
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lightHeader: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
  },
  darkHeader: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  lightSubText: {
    color: '#666',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
  },
  lightProfileSection: {
    backgroundColor: '#fff',
  },
  darkProfileSection: {
    backgroundColor: '#1E2022',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightProfileImagePlaceholder: {
    backgroundColor: '#f0f0f0',
  },
  darkProfileImagePlaceholder: {
    backgroundColor: '#2A2F33',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    marginTop: 5,
  },
  editButton: {
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  lightMenuSection: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkMenuSection: {
    backgroundColor: '#1E2022',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  lightMenuItem: {
    borderBottomColor: '#eee',
  },
  darkMenuItem: {
    borderBottomColor: '#333',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  lightLogoutButton: {
    backgroundColor: '#f0f0f0',
  },
  darkLogoutButton: {
    backgroundColor: '#2A2F33',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});