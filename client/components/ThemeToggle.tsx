// client/components/ThemeToggle.tsx
// Purpose: This file defines a ThemeToggle component that allows users to switch between light and dark themes in a React Native application. It uses the Ionicons library for icons and the useTheme hook to manage theme state.
// Description: The ThemeToggle component provides a UI for toggling between light and dark themes. It includes a switch for manual theme selection and an option to use the device's settings. The component uses the useTheme hook to access the current theme state and update it accordingly. The styles are defined using StyleSheet from React Native, ensuring a consistent look and feel across different devices.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  style?: object;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { isDarkTheme, themeMode, setThemeMode } = useTheme();
  
  const toggleThemeMode = (value: boolean) => {
    if (value) {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
  };
  
  const toggleSystemTheme = () => {
    setThemeMode(themeMode === 'system' ? (isDarkTheme ? 'dark' : 'light') : 'system');
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.toggleRow}>
        <View style={styles.leftSection}>
          <Ionicons 
            name={isDarkTheme ? "moon" : "sunny"} 
            size={24} 
            color={isDarkTheme ? "#fff" : "#ff9800"} 
          />
          <Text style={[styles.toggleText, isDarkTheme && styles.darkText]}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleThemeMode}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
          thumbColor={isDarkTheme ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#ccc"
        />
      </View>
      
      <TouchableOpacity style={styles.systemRow} onPress={toggleSystemTheme}>
        <View style={styles.leftSection}>
          <Ionicons 
            name="phone-portrait-outline" 
            size={24} 
            color={isDarkTheme ? "#fff" : "#333"} 
          />
          <Text style={[styles.toggleText, isDarkTheme && styles.darkText]}>
            Use Device Settings
          </Text>
        </View>
        <View style={[
          styles.checkmark, 
          themeMode === 'system' && styles.checkmarkActive,
          isDarkTheme && styles.darkCheckmark
        ]}>
          {themeMode === 'system' && (
            <Ionicons name="checkmark" size={18} color={isDarkTheme ? "#000" : "#fff"} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginVertical: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  checkmarkActive: {
    backgroundColor: '#007BFF',
  },
  darkCheckmark: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  }
});

export default ThemeToggle;