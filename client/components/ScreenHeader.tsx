// components/ScreenHeader.tsx
// Purpose: This file defines a reusable screen header component for the application.
// Description: The ScreenHeader component includes a title, optional back button, and optional right component. It uses the SafeAreaContext for proper padding on devices with notches or rounded corners.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ScreenHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export default function ScreenHeader({ 
  title, 
  rightComponent,
  onBackPress,
  showBackButton = true
}: ScreenHeaderProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[
      styles.header, 
      { 
        paddingTop: insets.top > 0 ? insets.top : Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
        backgroundColor: colorScheme === 'dark' ? '#151718' : '#ffffff'
      }
    ]}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#ECEDEE' : '#333'} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerLeftPlaceholder} />
      )}
      
      <Text style={[
        styles.headerTitle,
        { color: colorScheme === 'dark' ? '#ECEDEE' : '#333' }
      ]} numberOfLines={1}>{title}</Text>
      
      {rightComponent ? (
        rightComponent
      ) : (
        <View style={styles.headerRightPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 6,
  },
  headerRightPlaceholder: {
    width: 30, // To keep the title centered
  },
  headerLeftPlaceholder: {
    width: 30, // To keep the title centered
  },
});