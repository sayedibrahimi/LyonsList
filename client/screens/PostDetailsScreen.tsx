// // screens/PostDetailsScreen.tsx
// // Purpose: This screen allows users to create a new listing by providing details such as title, description, price, condition, and category. It also includes an AI feature that generates content based on an uploaded image.
// // Description: The screen includes a form with input fields for title, description, price, condition, and category. It also allows users to toggle between AI-generated content and manual input. The screen handles image uploads, AI processing, and form submission to create a new listing.
// import React, { useState, useEffect } from 'react';
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
//   Platform,
//   KeyboardAvoidingView
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { apiService } from '../services/api';
// import { Categories } from '../constants/Categories';
// import { listingsService } from '@/services/listingsService';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface AIGeneratedData {
//   title: string;
//   description: string;
//   price: number;
//   condition: string;
//   category: string;
// }

// export default function PostDetailsScreen(): React.ReactElement {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const photoUri = params.photoUri as string;
//   const initialCondition = params.condition as string;
  
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [price, setPrice] = useState<string>('');
//   const [condition, setCondition] = useState<string>(initialCondition || 'used');
//   const [category, setCategory] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [useAIContent, setUseAIContent] = useState<boolean>(true);
//   const photoBase64 = params.photoBase64 as string;
  
//   // Store original AI content
//   const [aiContent, setAiContent] = useState<AIGeneratedData | null>(null);
  
//   // Character count for validation
//   const titleCharCount = title.length;
//   const descriptionCharCount = description.length;
  
//   // Get AI-generated content
//   useEffect(() => {
//     processImageWithAI();
//   }, []);

// const processImageWithAI = async () => {
//   try {
//     setIsLoading(true);
    
//     const uriParts = photoUri.split('/');
//     const fileName = uriParts[uriParts.length - 1];
    
//     if (!photoBase64) {
//       throw new Error('No base64 image data available');
//     }
    
//     try {
//       // Use the new API service method
//       const responseData = await apiService.uploadImageForAI(
//         photoBase64,
//         fileName,
//         condition
//       );
      
//       // Check if the response has the expected format (handle different response structures)
//       let aiData: AIGeneratedData;
      
//       if (typeof responseData === 'object' && responseData !== null && 'data' in responseData) {
//         // If the response is wrapped in a 'data' property
//         aiData = responseData.data as AIGeneratedData;
//       } else if (typeof responseData === 'object' && responseData !== null && 'title' in responseData) {
//         // If the response is the direct AIGeneratedData object
//         aiData = responseData as AIGeneratedData;
//       } else {
//         console.log('Response structure:', JSON.stringify(responseData));
//         throw new Error('Unexpected response format from AI service');
//       }
      
//       console.log('Parsed AI data:', aiData);
      
//       // Store original AI content
//       setAiContent(aiData);
      
//       // Set form fields with AI data
//       if (aiData.title) setTitle(aiData.title);
//       if (aiData.description) setDescription(aiData.description);
//       if (aiData.price) setPrice(aiData.price.toString());
//       if (aiData.condition) setCondition(aiData.condition);
//       if (aiData.category) setCategory(aiData.category);
      
//       console.log('Form fields populated successfully');
//     } catch (error) {
//       console.error('API error details:', error);
//       throw new Error('Failed to process image data');
//     }
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//     const errorStack = error instanceof Error ? error.stack : undefined;
//     console.error('Error processing image with AI:', errorMessage, errorStack);
//     Alert.alert('AI Processing Error', 'Failed to analyze image. Please fill in the details manually.');
//     setUseAIContent(false);
//   } finally {
//     setIsLoading(false);
//   }
// };
  
//   // Toggle between AI and manual content
//   const toggleAIContent = (value: boolean) => {
//     setUseAIContent(value);
    
//     if (value && aiContent) {
//       // Restore AI content
//       setTitle(aiContent.title || '');
//       setDescription(aiContent.description || '');
//       setPrice(aiContent.price ? aiContent.price.toString() : '');
//       setCondition(aiContent.condition || condition);
//       setCategory(aiContent.category || '');
//     } else {
//       // Clear all fields for manual input
//       setTitle('');
//       setDescription('');
//       setPrice('');
//       setCondition(initialCondition);
//       setCategory('');
//     }
//   };
  
//   // Handle form submission
//   const handleSubmit = async () => {
//     // Validate form
//     if (!title || !description || !price || !condition || !category) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }
    
//     // Validate character lengths
//     if (title.length > 100) {
//       Alert.alert('Error', 'Title must be 100 characters or less');
//       return;
//     }
    
//     if (description.length > 500) {
//       Alert.alert('Error', 'Description must be 500 characters or less');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       const formattedBase64 = `data:image/jpeg;base64,${photoBase64}`;
      
//       // Create listing with the uploaded image URL
//       const listingData = {
//         title,
//         description,
//         pictures: [formattedBase64], // use the URL returned from server here But for now placeholder
//         price: parseFloat(price),
//         condition,
//         category,
//         status: 'available',
//       };
      
//       const createResponse = await listingsService.createListing(listingData);
      
//       if (createResponse) {
//         Alert.alert(
//           'Success', 
//           'Your listing has been posted!',
//           [
//             {
//               text: 'View Listings',
//               onPress: () => router.replace('/(tabs)/search')
//             }
//           ]
//         );
//       } else {
//         throw new Error('Failed to create listing');
//       }
//     } catch (error) {
//       console.error('Error creating listing:', error);
//       Alert.alert('Error', 'Failed to post your listing. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//         <Text style={styles.loadingText}>AI analyzing your image...</Text>
//         <Text style={styles.loadingSubtext}>This might take a moment</Text>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Create Listing</Text>
//           <View style={{width: 24}} />
//         </View>
        
//         <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
//           {/* Image Preview */}
//           <View style={styles.imagePreviewContainer}>
//             <Image source={{ uri: photoUri }} style={styles.imagePreview} />
//             <TouchableOpacity 
//               style={styles.changeImageButton}
//               onPress={() => router.back()}
//             >
//               <Ionicons name="camera" size={20} color="#fff" />
//               <Text style={styles.changeImageText}>Change Image</Text>
//             </TouchableOpacity>
//           </View>
          
//           {/* AI Toggle */}
//           {aiContent && (
//             <View style={styles.aiToggleContainer}>
//               <View style={styles.aiToggleLeft}>
//                 <Text style={styles.aiToggleTitle}>Use AI-Generated Content</Text>
//                 <Text style={styles.aiToggleSubtitle}>
//                   Toggle to switch between AI and manual input
//                 </Text>
//               </View>
//               <Switch
//                 value={useAIContent}
//                 onValueChange={toggleAIContent}
//                 trackColor={{ false: '#ccc', true: '#bfe0ff' }}
//                 thumbColor={useAIContent ? '#007BFF' : '#f4f3f4'}
//                 ios_backgroundColor="#ccc"
//               />
//             </View>
//           )}
          
//           {/* Form Fields */}
//           <View style={styles.formSection}>
//             <View style={styles.labelRow}>
//               <Text style={styles.labelText}>Title</Text>
//               <Text style={styles.charCount}>{titleCharCount}/100</Text>
//             </View>
//             <TextInput
//               style={[
//                 styles.input, 
//                 titleCharCount > 100 ? styles.inputError : null
//               ]}
//               placeholder="What are you selling?"
//               value={title}
//               onChangeText={setTitle}
//               maxLength={120} // Allow slightly over to show the error
//             />
            
//             <View style={styles.labelRow}>
//               <Text style={styles.labelText}>Description</Text>
//               <Text style={styles.charCount}>{descriptionCharCount}/500</Text>
//             </View>
//             <TextInput
//               style={[
//                 styles.textArea,
//                 descriptionCharCount > 500 ? styles.inputError : null
//               ]}
//               placeholder="Describe your item"
//               multiline
//               numberOfLines={4}
//               value={description}
//               onChangeText={setDescription}
//               maxLength={520} // Allow slightly over to show the error
//             />
            
//             <Text style={styles.labelText}>Price</Text>
//             <View style={styles.priceInputContainer}>
//               <Text style={styles.currencySymbol}>$</Text>
//               <TextInput
//                 style={styles.priceInput}
//                 placeholder="0.00"
//                 keyboardType="numeric"
//                 value={price}
//                 onChangeText={setPrice}
//               />
//             </View>
            
//             <Text style={styles.labelText}>Condition</Text>
//             <View style={styles.conditionContainer}>
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   condition === 'new' ? styles.conditionButtonActive : null
//                 ]}
//                 onPress={() => setCondition('new')}
//               >
//                 <Ionicons 
//                   name={condition === 'new' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={condition === 'new' ? "#007BFF" : "#666"} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   condition === 'new' ? styles.conditionTextActive : null
//                 ]}>New</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   condition === 'used' ? styles.conditionButtonActive : null
//                 ]}
//                 onPress={() => setCondition('used')}
//               >
//                 <Ionicons 
//                   name={condition === 'used' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={condition === 'used' ? "#007BFF" : "#666"} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   condition === 'used' ? styles.conditionTextActive : null
//                 ]}>Used</Text>
//               </TouchableOpacity>
//             </View>
            
//             <Text style={styles.labelText}>Category</Text>
//             <View style={styles.categoryContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {Object.values(Categories).map((cat) => (
//                   <TouchableOpacity 
//                     key={cat}
//                     style={[
//                       styles.categoryButton, 
//                       category === cat ? styles.categoryButtonActive : null
//                     ]}
//                     onPress={() => setCategory(cat)}
//                   >
//                     <Text style={[
//                       styles.categoryText,
//                       category === cat ? styles.categoryTextActive : null
//                     ]}>{cat}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
            
//             <TouchableOpacity 
//               style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Post Listing</Text>
//               )}
//             </TouchableOpacity>
//           </View>
          
//           <View style={{ height: 30 }} />
//         </ScrollView>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: '#fff',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   backButton: {
//     padding: 8,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     color: '#333',
//   },
//   loadingSubtext: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 8,
//   },
//   imagePreviewContainer: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 20,
//     position: 'relative',
//   },
//   imagePreview: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   changeImageButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   changeImageText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontSize: 14,
//   },
//   aiToggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   aiToggleLeft: {
//     flex: 1,
//   },
//   aiToggleTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   aiToggleSubtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   formSection: {
//     marginBottom: 20,
//   },
//   labelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   labelText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   charCount: {
//     fontSize: 14,
//     color: '#999',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   textArea: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 16,
//     minHeight: 120,
//     textAlignVertical: 'top',
//   },
//   inputError: {
//     borderColor: '#dc3545',
//   },
//   priceInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 12,
//   },
//   currencySymbol: {
//     fontSize: 18,
//     color: '#333',
//     marginRight: 8,
//   },
//   priceInput: {
//     flex: 1,
//     padding: 12,
//     fontSize: 16,
//   },
//   conditionContainer: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   conditionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     marginRight: 12,
//   },
//   conditionButtonActive: {
//     borderColor: '#007BFF',
//     backgroundColor: '#f0f8ff',
//   },
//   conditionText: {
//     fontSize: 16,
//     marginLeft: 8,
//     color: '#333',
//   },
//   conditionTextActive: {
//     color: '#007BFF',
//   },
//   categoryContainer: {
//     marginBottom: 24,
//   },
//   categoryButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     marginRight: 10,
//   },
//   categoryButtonActive: {
//     borderColor: '#007BFF',
//     backgroundColor: '#f0f8ff',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   categoryTextActive: {
//     color: '#007BFF',
//     fontWeight: '500',
//   },
//   submitButton: {
//     backgroundColor: '#007BFF',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#80bdff',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });


// screens/PostDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Switch,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Categories } from '../constants/Categories';
import { listingsService } from '@/services/listingsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiService } from '@/services/api';

interface AIGeneratedData {
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
}

export default function PostDetailsScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const photoUri = params.photoUri as string;
  const initialCondition = params.condition as string;
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [condition, setCondition] = useState<string>(initialCondition || 'used');
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [useAIContent, setUseAIContent] = useState<boolean>(true);
  const photoBase64 = params.photoBase64 as string;
  
  // Store original AI content
  const [aiContent, setAiContent] = useState<AIGeneratedData | null>(null);
  
  // Character count for validation
  const titleCharCount = title.length;
  const descriptionCharCount = description.length;
  
  // Get AI-generated content
  useEffect(() => {
    processImageWithAI();
  }, []);

  const processImageWithAI = async () => {
    try {
      setIsLoading(true);
      
      const uriParts = photoUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      if (!photoBase64) {
        throw new Error('No base64 image data available');
      }
      
      try {
        // Use the new API service method
        const responseData = await apiService.uploadImageForAI(
          photoBase64,
          fileName,
          condition
        );
        
        // Check if the response has the expected format (handle different response structures)
        let aiData: AIGeneratedData;
        
        if (typeof responseData === 'object' && responseData !== null && 'data' in responseData) {
          // If the response is wrapped in a 'data' property
          aiData = responseData.data as AIGeneratedData;
        } else if (typeof responseData === 'object' && responseData !== null && 'title' in responseData) {
          // If the response is the direct AIGeneratedData object
          aiData = responseData as AIGeneratedData;
        } else {
          console.log('Response structure:', JSON.stringify(responseData));
          throw new Error('Unexpected response format from AI service');
        }
        
        console.log('Parsed AI data:', aiData);
        
        // Store original AI content
        setAiContent(aiData);
        
        // Set form fields with AI data
        if (aiData.title) setTitle(aiData.title);
        if (aiData.description) setDescription(aiData.description);
        if (aiData.price) setPrice(aiData.price.toString());
        if (aiData.condition) setCondition(aiData.condition);
        if (aiData.category) setCategory(aiData.category);
        
        console.log('Form fields populated successfully');
      } catch (error) {
        console.error('API error details:', error);
        throw new Error('Failed to process image data');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('Error processing image with AI:', errorMessage, errorStack);
      Alert.alert('AI Processing Error', 'Failed to analyze image. Please fill in the details manually.');
      setUseAIContent(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle between AI and manual content
  const toggleAIContent = (value: boolean) => {
    setUseAIContent(value);
    
    if (value && aiContent) {
      // Restore AI content
      setTitle(aiContent.title || '');
      setDescription(aiContent.description || '');
      setPrice(aiContent.price ? aiContent.price.toString() : '');
      setCondition(aiContent.condition || condition);
      setCategory(aiContent.category || '');
    } else {
      // Clear all fields for manual input
      setTitle('');
      setDescription('');
      setPrice('');
      setCondition(initialCondition);
      setCategory('');
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!title || !description || !price || !condition || !category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    // Validate character lengths
    if (title.length > 100) {
      Alert.alert('Error', 'Title must be 100 characters or less');
      return;
    }
    
    if (description.length > 1000) {
      Alert.alert('Error', 'Description must be 1000 characters or less');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formattedBase64 = `data:image/jpeg;base64,${photoBase64}`;
      
      // Create listing with the uploaded image URL
      const listingData = {
        title,
        description,
        pictures: [formattedBase64], // use the URL returned from server here But for now placeholder
        price: parseFloat(price),
        condition,
        category,
        status: 'available',
      };
      
      const createResponse = await listingsService.createListing(listingData);
      
      if (createResponse) {
        Alert.alert(
          'Success', 
          'Your listing has been posted!',
          [
            {
              text: 'View Listings',
              onPress: () => router.replace('/(tabs)/search')
            }
          ]
        );
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'Failed to post your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          AI analyzing your image...
        </Text>
        <Text style={[styles.loadingSubtext, isDarkMode && styles.darkSubText]}>
          This might take a moment
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // Increase touch area
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Create Listing</Text>
          <View style={{width: 24}} />
        </View>
        
        <ScrollView 
          style={[styles.content, isDarkMode && styles.darkContent]} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Preview */}
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: photoUri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={() => router.back()}
            >
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
          
          {/* AI Toggle */}
          {aiContent && (
            <View style={[styles.aiToggleContainer, isDarkMode && styles.darkAiToggleContainer]}>
              <View style={styles.aiToggleLeft}>
                <Text style={[styles.aiToggleTitle, isDarkMode && styles.darkText]}>
                  Use AI-Generated Content
                </Text>
                <Text style={[styles.aiToggleSubtitle, isDarkMode && styles.darkSubText]}>
                  Toggle to switch between AI and manual input
                </Text>
              </View>
              <Switch
                value={useAIContent}
                onValueChange={toggleAIContent}
                trackColor={{ false: '#ccc', true: '#bfe0ff' }}
                thumbColor={useAIContent ? '#007BFF' : '#f4f3f4'}
                ios_backgroundColor="#ccc"
              />
            </View>
          )}
          
          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.labelRow}>
              <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Title</Text>
              <Text style={[styles.charCount, isDarkMode && styles.darkSubText]}>
                {titleCharCount}/100
              </Text>
            </View>
            <TextInput
              style={[
                styles.input, 
                titleCharCount > 100 ? styles.inputError : null,
                isDarkMode && styles.darkInput
              ]}
              placeholder="What are you selling?"
              placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
              value={title}
              onChangeText={setTitle}
              maxLength={120} // Allow slightly over to show the error
            />
            
            <View style={styles.labelRow}>
              <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Description</Text>
              <Text style={[styles.charCount, isDarkMode && styles.darkSubText]}>
                {descriptionCharCount}/1000
              </Text>
            </View>
            <TextInput
  style={[
    styles.textArea,
    descriptionCharCount > 1000 ? styles.inputError : null,
    isDarkMode && styles.darkInput
  ]}
  placeholder="Describe your item"
  placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
  multiline
  numberOfLines={6} // Changed from 4 to 6
  value={description}
  onChangeText={setDescription}
  maxLength={1000} // Increased from 520 to 1020
/>
            
            <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Price</Text>
            <View style={[styles.priceInputContainer, isDarkMode && styles.darkPriceInputContainer]}>
              <Text style={[styles.currencySymbol, isDarkMode && styles.darkText]}>$</Text>
              <TextInput
                style={[styles.priceInput, isDarkMode && styles.darkPriceInput]}
                placeholder="0.00"
                placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
            
            <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Condition</Text>
            <View style={styles.conditionContainer}>
              <TouchableOpacity 
                style={[
                  styles.conditionButton, 
                  condition === 'new' ? styles.conditionButtonActive : null,
                  isDarkMode && styles.darkConditionButton
                ]}
                onPress={() => setCondition('new')}
              >
                <Ionicons 
                  name={condition === 'new' ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={condition === 'new' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
                />
                <Text style={[
                  styles.conditionText,
                  condition === 'new' ? styles.conditionTextActive : null,
                  isDarkMode && styles.darkText
                ]}>New</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.conditionButton, 
                  condition === 'used' ? styles.conditionButtonActive : null,
                  isDarkMode && styles.darkConditionButton
                ]}
                onPress={() => setCondition('used')}
              >
                <Ionicons 
                  name={condition === 'used' ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={condition === 'used' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
                />
                <Text style={[
                  styles.conditionText,
                  condition === 'used' ? styles.conditionTextActive : null,
                  isDarkMode && styles.darkText
                ]}>Used</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Category</Text>
            <View style={styles.categoryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.values(Categories).map((cat) => (
                  <TouchableOpacity 
                    key={cat}
                    style={[
                      styles.categoryButton, 
                      category === cat ? styles.categoryButtonActive : null,
                      isDarkMode && styles.darkCategoryButton
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryText,
                      category === cat ? styles.categoryTextActive : null,
                      isDarkMode && (category === cat ? styles.darkCategoryTextActive : styles.darkText)
                    ]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Post Listing</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
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
  backButton: {
    padding: 12, // Increase padding for easier tapping
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  darkContent: {
    backgroundColor: '#151718',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  darkLoadingContainer: {
    backgroundColor: '#151718',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#333',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  aiToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkAiToggleContainer: {
    backgroundColor: '#2A2F33',
    shadowOpacity: 0.2,
  },
  aiToggleLeft: {
    flex: 1,
  },
  aiToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  aiToggleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 14,
    color: '#999',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#2A2F33',
    borderColor: '#444',
    color: '#ECEDEE',
  },
  textArea: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#e1e1e1',
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  marginBottom: 16,
  minHeight: 160, // Changed from 120 to 160
  textAlignVertical: 'top',
},
  inputError: {
    borderColor: '#dc3545',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  darkPriceInputContainer: {
    backgroundColor: '#2A2F33',
    borderColor: '#444',
  },
  currencySymbol: {
    fontSize: 18,
    color: '#333',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  darkPriceInput: {
    color: '#ECEDEE',
  },
  conditionContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  darkConditionButton: {
    backgroundColor: '#2A2F33',
    borderColor: '#444',
  },
  conditionButtonActive: {
    borderColor: '#007BFF',
    backgroundColor: '#f0f8ff',
  },
  conditionText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  conditionTextActive: {
    color: '#007BFF',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  darkCategoryButton: {
    backgroundColor: '#2A2F33',
    borderColor: '#444',
  },
  categoryButtonActive: {
    borderColor: '#007BFF',
    backgroundColor: '#f0f8ff',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  darkCategoryTextActive: {
    color: '#4a9eff',
  },
  categoryTextActive: {
    color: '#007BFF',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#80bdff',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});