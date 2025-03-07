// src/screens/AccountScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tabStyles } from '../styles/tabStyles';

interface AccountScreenProps {
  // Define props if needed
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function AccountScreen({}: AccountScreenProps): React.ReactElement {
  // Mock user data - replace with actual auth state
  const user = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    profileImage: null
  };
  
  const menuItems: MenuItem[] = [
    { 
      id: 'listings', 
      title: 'My Listings', 
      icon: 'list',
      onPress: () => Alert.alert('My Listings', 'Navigate to listings') 
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
          onPress: () => console.log('Logout pressed')
        }
      ]
    );
  };

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>My Account</Text>
      </View>
      
      <ScrollView style={tabStyles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImagePlaceholder}>
            {user.profileImage ? (
              <Text>Profile Image</Text>
            ) : (
              <Ionicons name="person" size={50} color="#666" />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={24} color="#007BFF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    marginTop: 8,
  },
  editButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  }
});