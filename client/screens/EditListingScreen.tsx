// // client/screens/EditListingScreen.tsx
// // Purpose: This screen allows users to edit their existing listings, including updating the title, description, price, condition, category, and status of the listing. It also handles image uploads and form validation.
// // Description: The EditListingScreen component fetches the existing listing details using the productId from the URL parameters. It provides a form for users to edit the listing details, including character count validation for title and description. The screen also includes a loading state while fetching data and error handling for failed requests. Upon successful submission, it navigates back to the listing details page.
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
// import { Categories } from '../constants/Categories';
// import { listingsService, Listing } from '../services/listingsService';

// export default function EditListingScreen(): React.ReactElement {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const productId = params.productId as string;
  
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [price, setPrice] = useState<string>('');
//   const [condition, setCondition] = useState<string>('');
//   const [category, setCategory] = useState<string>('');
//   const [status, setStatus] = useState<string>('');
//   const [pictures, setPictures] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [loadingError, setLoadingError] = useState<string | null>(null);
//   const [imageError, setImageError] = useState<boolean>(false);
  
//   // Character count for validation
//   const titleCharCount = title.length;
//   const descriptionCharCount = description.length;
  
//   // Fetch listing details
//   useEffect(() => {
//     fetchListingDetails();
//   }, [productId]);

//   const fetchListingDetails = async () => {
//     try {
//       setLoading(true);
//       const listing: Listing = await listingsService.getListingById(productId);
//       if (listing) {
//         setTitle(listing.title);
//         setDescription(listing.description);
//         setPrice(listing.price.toString());
//         setCondition(listing.condition);
//         setCategory(listing.category);
//         setStatus(listing.status);
//         setPictures(listing.pictures);
//         setLoadingError(null);
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.error?.message || 'Failed to fetch listing details';
//       setLoadingError(errorMessage);
//       console.error('Error fetching listing details:', err);
//     } finally {
//       setLoading(false);
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
//     if (titleCharCount > 100) {
//       Alert.alert('Error', 'Title must be 100 characters or less');
//       return;
//     }
    
//     if (descriptionCharCount > 500) {
//       Alert.alert('Error', 'Description must be 500 characters or less');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       // Create listing data for update
//       const updatedListingData = {
//         title,
//         description,
//         price: parseFloat(price),
//         condition,
//         category,
//         status,
//       };
      
//       await listingsService.updateListing(productId, updatedListingData);
      
//       Alert.alert(
//         'Success', 
//         'Your listing has been updated!',
//         [
//           {
//             text: 'View Listing',
//             onPress: () => router.push({
//               pathname: '/myProductDetails',
//               params: { productId }
//             })
//           }
//         ]
//       );
//     } catch (error) {
//       console.error('Error updating listing:', error);
//       Alert.alert('Error', 'Failed to update your listing. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     Alert.alert(
//       'Cancel Editing',
//       'Are you sure you want to cancel? Your changes will not be saved.',
//       [
//         { text: 'Continue Editing', style: 'cancel' },
//         { 
//           text: 'Discard Changes', 
//           style: 'destructive',
//           onPress: () => router.back()
//         }
//       ]
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//         <Text style={styles.loadingText}>Loading listing details...</Text>
//       </View>
//     );
//   }

//   if (loadingError) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
//         <Text style={styles.errorText}>{loadingError}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchListingDetails}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
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
//           <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Edit Listing</Text>
//           <View style={{width: 24}} />
//         </View>
        
//         <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
//           {/* Image Preview */}
//           {pictures.length > 0 && (
//             <View style={styles.imagePreviewContainer}>
//               <Image 
//                 source={
//                   imageError 
//                     ? require('../assets/images/placeholder.png') 
//                     : { uri: pictures[0] }
//                 } 
//                 style={styles.imagePreview}
//                 onError={() => setImageError(true)}
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
            
//             <Text style={styles.labelText}>Status</Text>
//             <View style={styles.conditionContainer}>
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   status === 'available' ? styles.conditionButtonActive : null
//                 ]}
//                 onPress={() => setStatus('available')}
//               >
//                 <Ionicons 
//                   name={status === 'available' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={status === 'available' ? "#007BFF" : "#666"} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   status === 'available' ? styles.conditionTextActive : null
//                 ]}>Available</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   status === 'unavailable' ? styles.conditionButtonActive : null
//                 ]}
//                 onPress={() => setStatus('unavailable')}
//               >
//                 <Ionicons 
//                   name={status === 'unavailable' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={status === 'unavailable' ? "#007BFF" : "#666"} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   status === 'unavailable' ? styles.conditionTextActive : null
//                 ]}>Unavailable</Text>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity 
//                 style={styles.cancelButton}
//                 onPress={handleCancel}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
            
//               <TouchableOpacity 
//                 style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
//                 onPress={handleSubmit}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Save Changes</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
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
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   imagePreviewContainer: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   imagePreview: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
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
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submitButton: {
//     flex: 2,
//     backgroundColor: '#007BFF',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
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


// // screens/EditListingScreen.tsx
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
// import { Categories } from '../constants/Categories';
// import { listingsService, Listing } from '../services/listingsService';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function EditListingScreen(): React.ReactElement {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const productId = params.productId as string;
  
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
  
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [price, setPrice] = useState<string>('');
//   const [condition, setCondition] = useState<string>('');
//   const [category, setCategory] = useState<string>('');
//   const [status, setStatus] = useState<string>('');
//   const [pictures, setPictures] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [loadingError, setLoadingError] = useState<string | null>(null);
//   const [imageError, setImageError] = useState<boolean>(false);
  
//   // Character count for validation
//   const titleCharCount = title.length;
//   const descriptionCharCount = description.length;
  
//   // Fetch listing details
//   useEffect(() => {
//     fetchListingDetails();
//   }, [productId]);


//   const fetchListingDetails = async () => {
//     try {
//       setLoading(true);
//       const listing: Listing = await listingsService.getListingById(productId);
//       if (listing) {
//         setTitle(listing.title);
//         setDescription(listing.description);
//         setPrice(listing.price.toString());
//         setCondition(listing.condition);
//         setCategory(listing.category);
//         setStatus(listing.status);
//         setPictures(listing.pictures);
//         setLoadingError(null);
//       }
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.error?.message || 'Failed to fetch listing details';
//       setLoadingError(errorMessage);
//       console.error('Error fetching listing details:', err);
//     } finally {
//       setLoading(false);
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
//     if (titleCharCount > 100) {
//       Alert.alert('Error', 'Title must be 100 characters or less');
//       return;
//     }
    
//     if (descriptionCharCount > 500) {
//       Alert.alert('Error', 'Description must be 500 characters or less');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       // Create listing data for update
//       const updatedListingData = {
//         title,
//         description,
//         price: parseFloat(price),
//         condition,
//         category,
//         status,
//       };
      
//       await listingsService.updateListing(productId, updatedListingData);
      
//       Alert.alert(
//         'Success', 
//         'Your listing has been updated!',
//         [
//           {
//             text: 'View Listing',
//             onPress: () => router.push({
//               pathname: '/myProductDetails',
//               params: { productId }
//             })
//           }
//         ]
//       );
//     } catch (error) {
//       console.error('Error updating listing:', error);
//       Alert.alert('Error', 'Failed to update your listing. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     Alert.alert(
//       'Cancel Editing',
//       'Are you sure you want to cancel? Your changes will not be saved.',
//       [
//         { text: 'Continue Editing', style: 'cancel' },
//         { 
//           text: 'Discard Changes', 
//           style: 'destructive',
//           onPress: () => router.back()
//         }
//       ]
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
//         <ActivityIndicator size="large" color="#007BFF" />
//         <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
//           Loading listing details...
//         </Text>
//       </View>
//     );
//   }

//   if (loadingError) {
//     return (
//       <View style={[styles.errorContainer, isDarkMode && styles.darkErrorContainer]}>
//         <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
//         <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{loadingError}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchListingDetails}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={[styles.container, isDarkMode && styles.darkContainer]}>
//         <View style={[styles.header, isDarkMode && styles.darkHeader]}>
//           <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
//             <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Edit Listing</Text>
//           <View style={{width: 24}} />
//         </View>
        
//         <ScrollView 
//           style={[styles.content, isDarkMode && styles.darkContent]} 
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Image Preview */}
//           {pictures.length > 0 && (
//             <View style={styles.imagePreviewContainer}>
//               <Image 
//                 source={
//                   imageError 
//                     ? require('../assets/images/placeholder.png') 
//                     : { uri: pictures[0] }
//                 } 
//                 style={styles.imagePreview}
//                 onError={() => setImageError(true)}
//               />
//             </View>
//           )}
          
//           {/* Form Fields */}
//           <View style={styles.formSection}>
//             <View style={styles.labelRow}>
//               <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Title</Text>
//               <Text style={[styles.charCount, isDarkMode && styles.darkSubText]}>
//                 {titleCharCount}/100
//               </Text>
//             </View>
//             <TextInput
//               style={[
//                 styles.input, 
//                 titleCharCount > 100 ? styles.inputError : null,
//                 isDarkMode && styles.darkInput
//               ]}
//               placeholder="What are you selling?"
//               placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
//               value={title}
//               onChangeText={setTitle}
//               maxLength={120} // Allow slightly over to show the error
//             />
            
//             <View style={styles.labelRow}>
//               <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Description</Text>
//               <Text style={[styles.charCount, isDarkMode && styles.darkSubText]}>
//                 {descriptionCharCount}/500
//               </Text>
//             </View>
//             <TextInput
//               style={[
//                 styles.textArea,
//                 descriptionCharCount > 500 ? styles.inputError : null,
//                 isDarkMode && styles.darkInput
//               ]}
//               placeholder="Describe your item"
//               placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
//               multiline
//               numberOfLines={4}
//               value={description}
//               onChangeText={setDescription}
//               maxLength={520} // Allow slightly over to show the error
//             />
            
//             <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Price</Text>
//             <View style={[styles.priceInputContainer, isDarkMode && styles.darkPriceInputContainer]}>
//               <Text style={[styles.currencySymbol, isDarkMode && styles.darkText]}>$</Text>
//               <TextInput
//                 style={[styles.priceInput, isDarkMode && styles.darkPriceInput]}
//                 placeholder="0.00"
//                 placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
//                 keyboardType="numeric"
//                 value={price}
//                 onChangeText={setPrice}
//               />
//             </View>
            
//             <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Condition</Text>
//             <View style={styles.conditionContainer}>
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   condition === 'new' ? styles.conditionButtonActive : null,
//                   isDarkMode && styles.darkConditionButton
//                 ]}
//                 onPress={() => setCondition('new')}
//               >
//                 <Ionicons 
//                   name={condition === 'new' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={condition === 'new' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   condition === 'new' ? styles.conditionTextActive : null,
//                   isDarkMode && styles.darkText
//                 ]}>New</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   condition === 'used' ? styles.conditionButtonActive : null,
//                   isDarkMode && styles.darkConditionButton
//                 ]}
//                 onPress={() => setCondition('used')}
//               >
//                 <Ionicons 
//                   name={condition === 'used' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={condition === 'used' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   condition === 'used' ? styles.conditionTextActive : null,
//                   isDarkMode && styles.darkText
//                 ]}>Used</Text>
//               </TouchableOpacity>
//             </View>
            
//             <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Category</Text>
//             <View style={styles.categoryContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {Object.values(Categories).map((cat) => (
//                   <TouchableOpacity 
//                     key={cat}
//                     style={[
//                       styles.categoryButton, 
//                       category === cat ? styles.categoryButtonActive : null,
//                       isDarkMode && styles.darkCategoryButton
//                     ]}
//                     onPress={() => setCategory(cat)}
//                   >
//                     <Text style={[
//                       styles.categoryText,
//                       category === cat ? styles.categoryTextActive : null,
//                       isDarkMode && (category === cat ? styles.darkCategoryTextActive : styles.darkText)
//                     ]}>{cat}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
            
//             <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Status</Text>
//             <View style={styles.conditionContainer}>
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   status === 'available' ? styles.conditionButtonActive : null,
//                   isDarkMode && styles.darkConditionButton
//                 ]}
//                 onPress={() => setStatus('available')}
//               >
//                 <Ionicons 
//                   name={status === 'available' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={status === 'available' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   status === 'available' ? styles.conditionTextActive : null,
//                   isDarkMode && styles.darkText
//                 ]}>Available</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[
//                   styles.conditionButton, 
//                   status === 'unavailable' ? styles.conditionButtonActive : null,
//                   isDarkMode && styles.darkConditionButton
//                 ]}
//                 onPress={() => setStatus('unavailable')}
//               >
//                 <Ionicons 
//                   name={status === 'unavailable' ? "radio-button-on" : "radio-button-off"} 
//                   size={20} 
//                   color={status === 'unavailable' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
//                 />
//                 <Text style={[
//                   styles.conditionText,
//                   status === 'unavailable' ? styles.conditionTextActive : null,
//                   isDarkMode && styles.darkText
//                 ]}>Unavailable</Text>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity 
//                 style={[styles.cancelButton, isDarkMode && styles.darkCancelButton]}
//                 onPress={handleCancel}
//               >
//                 <Text style={[styles.cancelButtonText, isDarkMode && styles.darkCancelButtonText]}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
            
//               <TouchableOpacity 
//                 style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
//                 onPress={handleSubmit}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Save Changes</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
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
//   darkContainer: {
//     backgroundColor: '#151718',
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
//   darkHeader: {
//     backgroundColor: '#1E2022',
//     borderBottomColor: '#333',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   darkText: {
//     color: '#ECEDEE',
//   },
//   darkSubText: {
//     color: '#9BA1A6',
//   },
//   backButton: {
//     padding: 8,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   darkContent: {
//     backgroundColor: '#151718',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   darkLoadingContainer: {
//     backgroundColor: '#151718',
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     color: '#333',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   darkErrorContainer: {
//     backgroundColor: '#151718',
//   },
//   errorText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   imagePreviewContainer: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   imagePreview: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
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
//     color: '#333',
//   },
//   darkInput: {
//     backgroundColor: '#2A2F33',
//     borderColor: '#444',
//     color: '#ECEDEE',
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
//   darkPriceInputContainer: {
//     backgroundColor: '#2A2F33',
//     borderColor: '#444',
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
//     color: '#333',
//   },
//   darkPriceInput: {
//     color: '#ECEDEE',
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
//   darkConditionButton: {
//     backgroundColor: '#2A2F33',
//     borderColor: '#444',
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
//   darkCategoryButton: {
//     backgroundColor: '#2A2F33',
//     borderColor: '#444',
//   },
//   categoryButtonActive: {
//     borderColor: '#007BFF',
//     backgroundColor: '#f0f8ff',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   darkCategoryTextActive: {
//     color: '#4a9eff',
//   },
//   categoryTextActive: {
//     color: '#007BFF',
//     fontWeight: '500',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   darkCancelButton: {
//     backgroundColor: '#2A2F33',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   darkCancelButtonText: {
//     color: '#9BA1A6',
//   },
//   submitButton: {
//     flex: 2,
//     backgroundColor: '#007BFF',
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: 'center',
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

// screens/EditListingScreen.tsx
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
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Categories } from '../constants/Categories';
import { listingsService, Listing } from '../services/listingsService';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function EditListingScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId as string;
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [pictures, setPictures] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  
  // Character count for validation
  const titleCharCount = title.length;
  const descriptionCharCount = description.length;
  
  // Fetch listing details
  useEffect(() => {
    fetchListingDetails();
  }, [productId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const listing: Listing = await listingsService.getListingById(productId);
      if (listing) {
        setTitle(listing.title);
        setDescription(listing.description);
        setPrice(listing.price.toString());
        setCondition(listing.condition);
        setCategory(listing.category);
        setStatus(listing.status);
        setPictures(listing.pictures);
        setLoadingError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch listing details';
      setLoadingError(errorMessage);
      console.error('Error fetching listing details:', err);
    } finally {
      setLoading(false);
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
    if (titleCharCount > 100) {
      Alert.alert('Error', 'Title must be 100 characters or less');
      return;
    }
    
    if (descriptionCharCount > 500) {
      Alert.alert('Error', 'Description must be 500 characters or less');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create listing data for update
      const updatedListingData = {
        title,
        description,
        price: parseFloat(price),
        condition,
        category,
        status,
      };
      
      await listingsService.updateListing(productId, updatedListingData);
      
      Alert.alert(
        'Success', 
        'Your listing has been updated!',
        [
          {
            text: 'View Listing',
            onPress: () => router.push({
              pathname: '/myProductDetails',
              params: { productId }
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error updating listing:', error);
      Alert.alert('Error', 'Failed to update your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Editing',
      'Are you sure you want to cancel? Your changes will not be saved.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { 
          text: 'Discard Changes', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
        <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading listing details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingError) {
    return (
      <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
        <View style={[styles.errorContainer, isDarkMode && styles.darkErrorContainer]}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{loadingError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchListingDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
          <View style={[styles.header, isDarkMode && styles.darkHeader]}>
            <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Edit Listing</Text>
            <View style={{width: 24}} />
          </View>
          
          <ScrollView 
            style={[styles.content, isDarkMode && styles.darkContent]} 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContentContainer}
          >
            {/* Image Preview */}
            {pictures.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={
                    imageError 
                      ? require('../assets/images/placeholder.png') 
                      : { uri: pictures[0] }
                  } 
                  style={styles.imagePreview}
                  onError={() => setImageError(true)}
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
                  {descriptionCharCount}/500
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textArea,
                  descriptionCharCount > 500 ? styles.inputError : null,
                  isDarkMode && styles.darkInput
                ]}
                placeholder="Describe your item"
                placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                maxLength={520} // Allow slightly over to show the error
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
              
              <Text style={[styles.labelText, isDarkMode && styles.darkText]}>Status</Text>
              <View style={styles.conditionContainer}>
                <TouchableOpacity 
                  style={[
                    styles.conditionButton, 
                    status === 'available' ? styles.conditionButtonActive : null,
                    isDarkMode && styles.darkConditionButton
                  ]}
                  onPress={() => setStatus('available')}
                >
                  <Ionicons 
                    name={status === 'available' ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={status === 'available' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
                  />
                  <Text style={[
                    styles.conditionText,
                    status === 'available' ? styles.conditionTextActive : null,
                    isDarkMode && styles.darkText
                  ]}>Available</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.conditionButton, 
                    status === 'unavailable' ? styles.conditionButtonActive : null,
                    isDarkMode && styles.darkConditionButton
                  ]}
                  onPress={() => setStatus('unavailable')}
                >
                  <Ionicons 
                    name={status === 'unavailable' ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={status === 'unavailable' ? "#007BFF" : (isDarkMode ? "#9BA1A6" : "#666")} 
                  />
                  <Text style={[
                    styles.conditionText,
                    status === 'unavailable' ? styles.conditionTextActive : null,
                    isDarkMode && styles.darkText
                  ]}>Unavailable</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.cancelButton, isDarkMode && styles.darkCancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.cancelButtonText, isDarkMode && styles.darkCancelButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              
                <TouchableOpacity 
                  style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkSafeArea: {
    backgroundColor: '#151718',
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
    // Ensure header stays at the top
    zIndex: 1,
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
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContentContainer: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  darkErrorContainer: {
    backgroundColor: '#151718',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    minHeight: 120,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  darkCancelButton: {
    backgroundColor: '#2A2F33',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  darkCancelButtonText: {
    color: '#9BA1A6',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
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