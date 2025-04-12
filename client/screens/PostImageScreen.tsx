// client/screens/PostImageScreen.tsx
// Purpose: This file contains the PostImageScreen component that allows users to take or select photos for creating a listing. It includes camera functionality, image processing, and navigation to the post details screen. The component uses Expo's Camera and ImagePicker libraries for handling images and provides a user-friendly interface for selecting conditions (new or used) for the items being listed.
// Description: The PostImageScreen component manages camera permissions, handles image selection and processing, and navigates to the post details screen with the selected image and condition. It also includes a modal for the camera view and applies styles based on the current color scheme (light or dark mode). The component uses hooks for state management and Expo's libraries for camera and image handling.
import React, { useState, useRef } from 'react';
import type { CameraView as CameraViewType } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function PostImageScreen(): React.ReactElement {
  const router = useRouter();
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef<CameraViewType>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
    
    if (status === 'granted') {
      setCameraVisible(true);
    } else {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
    }
  };
  
  const handleConditionSelect = (condition: string) => {
    setSelectedCondition(condition);
    Alert.alert(
      'Add Photo',
      'Choose a method to add a photo',
      [
        {
          text: 'Take Photo',
          onPress: () => handleOpenCamera(),
        },
        {
          text: 'Choose from Library',
          onPress: () => handlePickImage(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  // Open camera
  const handleOpenCamera = async () => {
    await requestCameraPermission();
  };

  // Modify the processImage function in PostImageScreen.tsx
  const processImage = async (uri: string): Promise<{ uri: string, base64: string }> => {
    // Higher compression for iOS devices due to their typically larger image files
    const compressionValue = Platform.OS === 'ios' ? 0.3 : 0.5;
    
    // Resize to a more moderate size - 800px wide instead of 600px
    const maxWidth = 800;
    
    try {
      // Compress and resize the image to a much smaller size
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }], // Wider width = better quality but still manageable size
        {
          compress: compressionValue, // Higher compression = smaller file
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        }
      );
    
      // Verify the base64 string is present
      if (!processedImage.base64) {
        throw new Error('Base64 encoding failed');
      }
      
      console.log(`Processed image: width=${processedImage.width}, height=${processedImage.height}, base64 length=${processedImage.base64.length}`);
      
      return {
        uri: processedImage.uri,
        base64: processedImage.base64
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) {
          throw new Error('Failed to take picture');
        }
        
        // Process and compress the image
        const processedImage = await processImage(photo.uri);
        
        setCameraVisible(false);
        
        // Navigate to post details screen with photo, base64, and condition
        router.push({
          pathname: '/postDetails',
          params: { 
            photoUri: processedImage.uri, 
            photoBase64: processedImage.base64,
            condition: selectedCondition 
          }
        });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Lower quality
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Process and compress the image
        const processedImage = await processImage(result.assets[0].uri);
        
        // Navigate to post details screen
        router.push({
          pathname: '/postDetails',
          params: { 
            photoUri: processedImage.uri, 
            photoBase64: processedImage.base64,
            condition: selectedCondition 
          }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, isDarkMode && styles.darkContainer]}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // Increase touch area
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Create Listing</Text>
          <View style={{width: 24}} />
        </View>
      
      <View style={[styles.content, isDarkMode && styles.darkContent]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>What are you selling?</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubText]}>
          Add a photo and let us help you create your listing
        </Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.optionCard, isDarkMode && styles.darkOptionCard]}
            onPress={() => handleConditionSelect('used')}
          >
            <View style={[styles.imageUploadBox, isDarkMode && styles.darkImageUploadBox]}>
              <Ionicons name="camera" size={40} color={isDarkMode ? "#9BA1A6" : "#666"} />
              <Text style={[styles.uploadText, isDarkMode && styles.darkSubText]}>Add Photos</Text>
            </View>
            <Text style={[styles.conditionText, isDarkMode && styles.darkText]}>Condition: Used</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionCard, isDarkMode && styles.darkOptionCard]}
            onPress={() => handleConditionSelect('new')}
          >
            <View style={[styles.imageUploadBox, isDarkMode && styles.darkImageUploadBox]}>
              <Ionicons name="camera" size={40} color={isDarkMode ? "#9BA1A6" : "#666"} />
              <Text style={[styles.uploadText, isDarkMode && styles.darkSubText]}>Add Photos</Text>
            </View>
            <Text style={[styles.conditionText, isDarkMode && styles.darkText]}>Condition: New</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
          <Ionicons name="information-circle-outline" size={24} color={isDarkMode ? "#4a9eff" : "#007BFF"} />
          <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
            Our AI will analyze your photo and help you create a perfect listing with suggested title, description, and price
          </Text>
        </View>
      </View>
      
      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide">
        <View style={styles.cameraContainer}>
          {cameraPermission ? (
            <>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
              />
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => setCameraVisible(false)}
                >
                  <Ionicons name="close-circle" size={36} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handleTakePicture}
                >
                  <Ionicons name="camera" size={50} color="#fff" />
                </TouchableOpacity>
                <View style={{ width: 50 }} />
              </View>
            </>
          ) : (
            <View style={styles.cameraPermissionContainer}>
              <Text style={styles.cameraPermissionText}>
                Camera permission is required to take photos
              </Text>
              <TouchableOpacity
                style={styles.cameraPermissionButton}
                onPress={requestCameraPermission}
              >
                <Text style={styles.cameraPermissionButtonText}>
                  Grant Permission
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cameraPermissionButton, { backgroundColor: '#ccc' }]}
                onPress={() => setCameraVisible(false)}
              >
                <Text style={styles.cameraPermissionButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  backButton: {
    padding: 12, // Increase padding for easier tapping
    zIndex: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  darkHeader: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  darkContent: {
    backgroundColor: '#151718',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  optionCard: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkOptionCard: {
    backgroundColor: '#1E2022',
    shadowOpacity: 0.2,
  },
  imageUploadBox: {
    height: 140,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  darkImageUploadBox: {
    backgroundColor: '#2A2F33',
    borderColor: '#444',
  },
  uploadText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  conditionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  darkInfoBox: {
    backgroundColor: '#1E2022',
    borderLeftColor: '#4a9eff',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraPermissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  cameraPermissionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  cameraPermissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
