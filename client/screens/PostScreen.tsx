// screens/PostScreen.tsx
// Purpose: This file contains the PostScreen component that allows users to create a new listing by taking a photo of an item. It includes a header, a button to navigate to the image upload screen, and a list of benefits for using the feature. The component uses React Native's built-in components and hooks for state management and navigation.
// Description: The PostScreen component provides a user interface for creating a new listing. It includes a header with a back button, an icon indicating the action, and a button to navigate to the image upload screen. The component also lists the benefits of using the feature, such as taking a photo, AI assistance, and quick posting. The component handles dark mode styling using a custom hook for color scheme detection.
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createTabStyles } from '../styles/tabStyles';
import { useColorScheme } from '../hooks/useColorScheme';

export default function PostScreen(): React.ReactElement {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tabStyles = createTabStyles(colorScheme);
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={tabStyles.container}>
      <View style={[tabStyles.header, { flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? '#ECEDEE' : '#333'} 
          />
        </TouchableOpacity>
        <Text style={[tabStyles.headerTitle, { flex: 1, textAlign: 'center' }]}>Create Listing</Text>
        {/* Empty view for balance */}
        <View style={{ width: 24 }} /> 
      </View>
      
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="add-circle" 
            size={80} 
            color={isDarkMode ? '#4a9eff' : '#007BFF'} 
          />
        </View>
        
        <Text style={[
          styles.title,
          isDarkMode && styles.darkText
        ]}>Sell Something?</Text>
        <Text style={[
          styles.subtitle,
          isDarkMode && styles.darkSubText
        ]}>
          Take a photo of your item and our AI will help you create a perfect listing
        </Text>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/postImage')}
        >
          <Text style={styles.createButtonText}>Create Listing</Text>
        </TouchableOpacity>
        
        <View style={styles.benefitsContainer}>
          <View style={[
            styles.benefitItem,
            isDarkMode && styles.darkBenefitItem
          ]}>
            <Ionicons name="camera" size={24} color={isDarkMode ? "#4a9eff" : "#007BFF"} />
            <Text style={[
              styles.benefitText,
              isDarkMode && styles.darkText
            ]}>Take a photo</Text>
          </View>
          
          <View style={[
            styles.benefitItem,
            isDarkMode && styles.darkBenefitItem
          ]}>
            <Ionicons name="flash" size={24} color={isDarkMode ? "#4a9eff" : "#007BFF"} />
            <Text style={[
              styles.benefitText,
              isDarkMode && styles.darkText
            ]}>AI fills details</Text>
          </View>
          
          <View style={[
            styles.benefitItem,
            isDarkMode && styles.darkBenefitItem
          ]}>
            <Ionicons name="checkmark-circle" size={24} color={isDarkMode ? "#4a9eff" : "#007BFF"} />
            <Text style={[
              styles.benefitText,
              isDarkMode && styles.darkText
            ]}>Post in seconds</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
   backButton: {
    padding: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  createButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 40,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  benefitsContainer: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
  },
  darkBenefitItem: {
    backgroundColor: '#2A2F33',
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});