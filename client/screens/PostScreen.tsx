// // screens/PostScreen.tsx
// // Purpose: This screen allows users to create a new listing by filling out a form and uploading an image. It includes AI features to assist in auto-filling the form based on the uploaded image.
// // Description: The PostScreen component contains a form with fields for title, description, price, condition, and category. Users can upload an image using the camera or photo library. The AI feature can analyze the image and auto-fill the form. The screen also includes modals for camera permission, AI processing, and AI tips.
// import React, { useState, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TextInput, 
//   TouchableOpacity, 
//   ScrollView,
//   Alert,
//   Image,
//   ActivityIndicator,
//   Switch,
//   Modal,
//   Platform
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { tabStyles } from '../styles/tabStyles';
// import * as ImagePicker from 'expo-image-picker';
// import { Camera, CameraView } from 'expo-camera';
// import { useRouter } from 'expo-router';


// interface PostScreenProps {
//   // Define props if needed
// }

// export default function PostScreen({}: PostScreenProps): React.ReactElement {
//   const router = useRouter();
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [price, setPrice] = useState<string>('');
//   const [condition, setCondition] = useState<string>('');
//   const [category, setCategory] = useState<string>('');
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [aiProcessing, setAiProcessing] = useState<boolean>(false);
//   const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
//   const [cameraVisible, setCameraVisible] = useState<boolean>(false);
//   const [useAI, setUseAI] = useState<boolean>(true); // Default to enabled
//   const [aiTipsVisible, setAiTipsVisible] = useState<boolean>(false);
//   const cameraRef = useRef<any>(null);
  
//   // Character count for validation
//   const titleCharCount = title.length;
//   const descriptionCharCount = description.length;
  
//   // Request camera permissions
//   const requestCameraPermission = async () => {
//     const { status } = await Camera.requestCameraPermissionsAsync();
//     setCameraPermission(status === 'granted');
    
//     if (status === 'granted') {
//       setCameraVisible(true);
//     } else {
//       Alert.alert('Permission Required', 'Camera permission is required to take photos');
//     }
//   };
  
//   // Open camera
//   const handleOpenCamera = async () => {
//     await requestCameraPermission();
//   };
  
//   // Take picture with camera
//   const handleTakePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         setImageUri(photo.uri);
//         setCameraVisible(false);
        
//         // Process with AI only if user has enabled it
//         if (useAI) {
//           processImageWithAI(photo.uri);
//         }
//       } catch (error) {
//         console.error('Error taking picture:', error);
//         Alert.alert('Error', 'Failed to take picture');
//       }
//     }
//   };
  
//   // Pick image from library
//   const handlePickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });
      
//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         setImageUri(result.assets[0].uri);
        
//         // Process with AI only if user has enabled it
//         if (useAI) {
//           processImageWithAI(result.assets[0].uri);
//         }
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       Alert.alert('Error', 'Failed to select image');
//     }
//   };
  
//   // Process image with AI
//   const processImageWithAI = async (uri: string) => {
//     // Show AI processing modal/indicator
//     setAiProcessing(true);
    
//     try {
//       // Simulating API call to AI service
//       // This would be replaced with your actual AI API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Example AI-generated data (replace with actual AI response)
//       const aiGeneratedData = {
//         title: "Wireless Headphones - High Quality",
//         description: "Noise-canceling wireless headphones with great battery life. Comfortable ear cups and premium sound quality. Barely used and in excellent condition.",
//         price: "45.00",
//         condition: "used",
//         category: "Electronics"
//       };
      
//       // Fill form with AI-generated data
//       setTitle(aiGeneratedData.title);
//       setDescription(aiGeneratedData.description);
//       setPrice(aiGeneratedData.price);
//       setCondition(aiGeneratedData.condition);
//       setCategory(aiGeneratedData.category);
      
//       // Hide AI processing indicator
//       setAiProcessing(false);
      
//       // Notify user
//       Alert.alert('AI Analysis Complete', 'Your listing details have been automatically filled. Feel free to edit them before posting.');
      
//     } catch (error) {
//       setAiProcessing(false);
//       console.error('Error processing image with AI:', error);
//       Alert.alert('AI Processing Error', 'Failed to analyze image. Please fill in the details manually.');
//     }
//   };
  
//   // Toggle AI tips modal
//   const toggleAiTipsModal = () => {
//     setAiTipsVisible(!aiTipsVisible);
//   };
  
//   // Add image - asks user to choose camera or library
//   const handleAddImage = () => {
//     Alert.alert(
//       'Add Photo',
//       'Choose a method to add a photo',
//       [
//         {
//           text: 'Take Photo',
//           onPress: handleOpenCamera,
//         },
//         {
//           text: 'Choose from Library',
//           onPress: handlePickImage,
//         },
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//       ]
//     );
//   };
  
//   // Handle form submission
//   const handleSubmit = async () => {
//     // Show loading indicator
//     setIsLoading(true);
    
//     // Validate form
//     if (!title || !description || !price || !condition || !imageUri) {
//       setIsLoading(false);
//       Alert.alert('Error', 'Please fill all required fields and add an image');
//       return;
//     }
    
//     // Validate character lengths
//     if (title.length > 100) {
//       setIsLoading(false);
//       Alert.alert('Error', 'Title must be 100 characters or less');
//       return;
//     }
    
//     if (description.length > 500) {
//       setIsLoading(false);
//       Alert.alert('Error', 'Description must be 500 characters or less');
//       return;
//     }
    
//     try {
//       // Here you would upload the image and get a URL
//       const imageUrl = await simulateImageUpload(imageUri);
      
//       // Prepare listing data
//       const listingData = {
//         title,
//         description,
//         picture: imageUrl,
//         price: parseFloat(price),
//         condition,
//         category,
//         status: 'available',
//         // sellerID would be added on the server from the authenticated user
//       };
      
//       // Simulate API call to create listing
//       await simulateCreateListing(listingData);
      
//       // Hide loading indicator
//       setIsLoading(false);
      
//       // Success alert
//       Alert.alert(
//         'Success', 
//         'Your listing has been posted!',
//         [
//           {
//             text: 'View Listings',
//             onPress: () => router.push('/(tabs)/search')
//           },
//           {
//             text: 'Post Another',
//             onPress: () => resetForm()
//           }
//         ]
//       );
      
//     } catch (error) {
//       setIsLoading(false);
//       console.error('Error creating listing:', error);
//       Alert.alert('Error', 'Failed to post your listing. Please try again.');
//     }
//   };
  
//   // Simulate image upload
//   const simulateImageUpload = async (uri: string): Promise<string> => {
//     // This would be replaced with actual image upload logic
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return "https://example.com/images/placeholder.jpg";
//   };
  
//   // Simulate create listing API call
//   const simulateCreateListing = async (data: any): Promise<void> => {
//     // This would be replaced with actual API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     console.log('Listing data:', data);
//     return;
//   };
  
//   // Reset form
//   const resetForm = () => {
//     setTitle('');
//     setDescription('');
//     setPrice('');
//     setCondition('');
//     setCategory('');
//     setImageUri(null);
//   };

//   return (
//     <View style={tabStyles.container}>
//       <View style={tabStyles.header}>
//         <Text style={tabStyles.headerTitle}>Create Listing</Text>
//       </View>
      
//       {/* Camera Modal */}
//       <Modal visible={cameraVisible} animationType="slide">
//         <View style={styles.cameraContainer}>
//           {cameraPermission ? (
//             <>
//               <CameraView
//                 ref={cameraRef}
//                 style={styles.camera}
//                 facing="back"
//               />
//               <View style={styles.cameraControls}>
//                 <TouchableOpacity
//                   style={styles.cameraButton}
//                   onPress={() => setCameraVisible(false)}
//                 >
//                   <Ionicons name="close-circle" size={36} color="#fff" />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.cameraButton}
//                   onPress={handleTakePicture}
//                 >
//                   <Ionicons name="camera" size={50} color="#fff" />
//                 </TouchableOpacity>
//                 <View style={{ width: 50 }} />
//               </View>
//             </>
//           ) : (
//             <View style={styles.cameraPermissionContainer}>
//               <Text style={styles.cameraPermissionText}>
//                 Camera permission is required to take photos
//               </Text>
//               <TouchableOpacity
//                 style={styles.cameraPermissionButton}
//                 onPress={requestCameraPermission}
//               >
//                 <Text style={styles.cameraPermissionButtonText}>
//                   Grant Permission
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.cameraPermissionButton, { backgroundColor: '#ccc' }]}
//                 onPress={() => setCameraVisible(false)}
//               >
//                 <Text style={styles.cameraPermissionButtonText}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </Modal>
      
//       {/* AI Processing Modal */}
//       <Modal visible={aiProcessing} transparent animationType="fade">
//         <View style={styles.aiProcessingContainer}>
//           <View style={styles.aiProcessingContent}>
//             <ActivityIndicator size="large" color="#007BFF" />
//             <Text style={styles.aiProcessingText}>AI analyzing your image...</Text>
//             <Text style={styles.aiProcessingSubtext}>This might take a moment</Text>
//           </View>
//         </View>
//       </Modal>
      
//       {/* AI Tips Modal */}
//       <Modal visible={aiTipsVisible} transparent animationType="fade">
//         <View style={styles.aiProcessingContainer}>
//           <View style={styles.aiTipsContent}>
//             <Text style={styles.aiTipsTitle}>Tips for Better AI Results</Text>
            
//             <View style={styles.aiTipItem}>
//               <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
//               <Text style={styles.aiTipText}>Capture the item alone, without other objects in the background</Text>
//             </View>
            
//             <View style={styles.aiTipItem}>
//               <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
//               <Text style={styles.aiTipText}>Make sure the item's label/logo is visible in the image</Text>
//             </View>
            
//             <View style={styles.aiTipItem}>
//               <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
//               <Text style={styles.aiTipText}>Take photos in good lighting, avoid dark or blurry images</Text>
//             </View>
            
//             <View style={styles.aiTipItem}>
//               <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
//               <Text style={styles.aiTipText}>Include multiple angles if possible for better analysis</Text>
//             </View>
            
//             <TouchableOpacity
//               style={styles.aiTipsCloseButton}
//               onPress={toggleAiTipsModal}
//             >
//               <Text style={styles.aiTipsCloseButtonText}>Got it</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
      
//       <ScrollView style={tabStyles.content} keyboardShouldPersistTaps="handled">
//         {/* AI Feature Toggle */}
//         <View style={styles.aiToggleContainer}>
//           <View style={styles.aiToggleLeft}>
//             <Text style={styles.aiToggleTitle}>Use AI to auto-fill listing</Text>
//             <TouchableOpacity onPress={toggleAiTipsModal}>
//               <Text style={styles.aiTipsLink}>
//                 <Ionicons name="information-circle-outline" size={16} color="#007BFF" /> Tips for better results
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <Switch
//             value={useAI}
//             onValueChange={setUseAI}
//             trackColor={{ false: '#ccc', true: '#bfe0ff' }}
//             thumbColor={useAI ? '#007BFF' : '#f4f3f4'}
//             ios_backgroundColor="#ccc"
//           />
//         </View>
        
//         {/* Image Upload Section */}
//         <TouchableOpacity 
//           style={[styles.imageUploadBox, imageUri ? styles.imagePreviewBox : null]} 
//           onPress={handleAddImage}
//         >
//           {imageUri ? (
//             <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//           ) : (
//             <>
//               <Ionicons name="camera" size={40} color="#666" />
//               <Text style={styles.uploadText}>Add Photos</Text>
//               {useAI && (
//                 <Text style={styles.uploadSubtext}>Let AI help fill your listing!</Text>
//               )}
//             </>
//           )}
          
//           {imageUri && (
//             <TouchableOpacity 
//               style={styles.editImageButton}
//               onPress={handleAddImage}
//             >
//               <Ionicons name="create-outline" size={24} color="#fff" />
//             </TouchableOpacity>
//           )}
//         </TouchableOpacity>
        
//         {/* Form Fields */}
//         <View style={styles.formSection}>
//           <View style={styles.labelRow}>
//             <Text style={styles.labelText}>Title</Text>
//             <Text style={styles.charCount}>{titleCharCount}/100</Text>
//           </View>
//           <TextInput
//             style={[
//               tabStyles.input, 
//               titleCharCount > 100 ? styles.inputError : null
//             ]}
//             placeholder="What are you selling?"
//             value={title}
//             onChangeText={setTitle}
//             maxLength={120} // Allow slightly over to show the error
//           />
          
//           <View style={styles.labelRow}>
//             <Text style={styles.labelText}>Description</Text>
//             <Text style={styles.charCount}>{descriptionCharCount}/500</Text>
//           </View>
//           <TextInput
//             style={[
//               styles.descriptionInput,
//               descriptionCharCount > 500 ? styles.inputError : null
//             ]}
//             placeholder="Describe your item"
//             multiline
//             numberOfLines={4}
//             value={description}
//             onChangeText={setDescription}
//             maxLength={520} // Allow slightly over to show the error
//           />
          
//           <Text style={styles.labelText}>Price</Text>
//           <View style={styles.priceInputContainer}>
//             <Text style={styles.currencySymbol}>$</Text>
//             <TextInput
//               style={styles.priceInput}
//               placeholder="0.00"
//               keyboardType="numeric"
//               value={price}
//               onChangeText={setPrice}
//             />
//           </View>
          
//           <Text style={styles.labelText}>Condition</Text>
//           <View style={styles.conditionContainer}>
//             <TouchableOpacity 
//               style={[
//                 styles.conditionButton, 
//                 condition === 'new' ? styles.conditionButtonActive : null
//               ]}
//               onPress={() => setCondition('new')}
//             >
//               <Ionicons 
//                 name={condition === 'new' ? "radio-button-on" : "radio-button-off"} 
//                 size={20} 
//                 color={condition === 'new' ? "#007BFF" : "#666"} 
//               />
//               <Text style={[
//                 styles.conditionText,
//                 condition === 'new' ? styles.conditionTextActive : null
//               ]}>New</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[
//                 styles.conditionButton, 
//                 condition === 'used' ? styles.conditionButtonActive : null
//               ]}
//               onPress={() => setCondition('used')}
//             >
//               <Ionicons 
//                 name={condition === 'used' ? "radio-button-on" : "radio-button-off"} 
//                 size={20} 
//                 color={condition === 'used' ? "#007BFF" : "#666"} 
//               />
//               <Text style={[
//                 styles.conditionText,
//                 condition === 'used' ? styles.conditionTextActive : null
//               ]}>Used</Text>
//             </TouchableOpacity>
//           </View>
          
//           <Text style={styles.labelText}>Category</Text>
//           <TextInput
//             style={tabStyles.input}
//             placeholder="Select a category"
//             value={category}
//             onChangeText={setCategory}
//           />
          
//           <TouchableOpacity 
//             style={[tabStyles.button, isLoading ? styles.buttonDisabled : null]}
//             onPress={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={tabStyles.buttonText}>Post Listing</Text>
//             )}
//           </TouchableOpacity>
//         </View>
        
//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   formSection: {
//     marginTop: 10,
//   },
//   imageUploadBox: {
//     height: 180,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderStyle: 'dashed',
//   },
//   imagePreviewBox: {
//     borderStyle: 'solid',
//     borderColor: '#ccc',
//     overflow: 'hidden',
//     padding: 0,
//   },
//   imagePreview: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   editImageButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   uploadText: {
//     marginTop: 10,
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   uploadSubtext: {
//     marginTop: 5,
//     color: '#999',
//     fontSize: 14,
//   },
//   labelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   charCount: {
//     fontSize: 12,
//     color: '#999',
//   },
//   descriptionInput: {
//     width: '100%',
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   labelText: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#333',
//   },
//   priceInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   currencySymbol: {
//     fontSize: 18,
//     color: '#333',
//     marginRight: 5,
//   },
//   priceInput: {
//     flex: 1,
//     padding: 10,
//     fontSize: 16,
//   },
//   conditionContainer: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   conditionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   conditionButtonActive: {
//     borderColor: '#007BFF',
//     backgroundColor: '#f0f8ff',
//   },
//   conditionText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: '#666',
//   },
//   conditionTextActive: {
//     color: '#007BFF',
//     fontWeight: '500',
//   },
//   inputError: {
//     borderColor: '#ff3b30',
//   },
//   buttonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   cameraContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   camera: {
//     flex: 1,
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 30,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   cameraButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   cameraPermissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   cameraPermissionText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#fff',
//   },
//   cameraPermissionButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginVertical: 10,
//     width: 200,
//     alignItems: 'center',
//   },
//   cameraPermissionButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   aiProcessingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   aiProcessingContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '80%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   aiProcessingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 15,
//     color: '#333',
//   },
//   aiProcessingSubtext: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 5,
//   },
//   // New styles for AI toggle and tips
//   aiToggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },
//   aiToggleLeft: {
//     flex: 1,
//     marginRight: 10,
//   },
//   aiToggleTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 4,
//   },
//   aiTipsLink: {
//     fontSize: 14,
//     color: '#007BFF',
//     marginTop: 2,
//   },
//   aiTipsContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: '85%',
//     maxWidth: 400,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   aiTipsTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   aiTipItem: {
//     flexDirection: 'row',
//     marginBottom: 12,
//     alignItems: 'flex-start',
//   },
//   aiTipText: {
//     fontSize: 15,
//     color: '#333',
//     marginLeft: 10,
//     flex: 1,
//     lineHeight: 22,
//   },
//   aiTipsCloseButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   aiTipsCloseButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });


// Update screens/PostScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { tabStyles } from '../styles/tabStyles';

export default function PostScreen(): React.ReactElement {
  const router = useRouter();

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>Create Listing</Text>
      </View>
      
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="add-circle" size={80} color="#007BFF" />
        </View>
        
        <Text style={styles.title}>Sell Something?</Text>
        <Text style={styles.subtitle}>
          Take a photo of your item and our AI will help you create a perfect listing
        </Text>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/postImage')}
        >
          <Text style={styles.createButtonText}>Create Listing</Text>
        </TouchableOpacity>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="camera" size={24} color="#007BFF" />
            <Text style={styles.benefitText}>Take a photo</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="flash" size={24} color="#007BFF" />
            <Text style={styles.benefitText}>AI fills details</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
            <Text style={styles.benefitText}>Post in seconds</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
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
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});