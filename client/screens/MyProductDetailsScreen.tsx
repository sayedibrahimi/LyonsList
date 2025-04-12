// client/screens/MyProductDetailsScreen.tsx
// Purpose: This file contains the MyProductDetailsScreen component that displays the details of a specific product listing. It allows users to view product information, edit or delete the listing, and navigate back to the previous screen. The component handles loading states, error handling, and dark mode styling.
// Description: The MyProductDetailsScreen component fetches product details from the server using the product ID passed as a parameter. It displays the product image, title, price, condition, and description. Users can edit or delete the listing using buttons at the bottom of the screen. The component also includes error handling for network requests and image loading errors.
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { listingsService, Listing } from '../services/listingsService';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function MyProductDetailsScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId as string;
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [product, setProduct] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await listingsService.getListingById(productId);
      setProduct(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch product details';
      setError(errorMessage);
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getTimeAgo = (timestamp: string) => {
    const postTime = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - postTime.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };

  const handleDeleteListing = () => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDeleteListing 
        }
      ]
    );
  };

  const confirmDeleteListing = async () => {
    try {
      setIsDeleting(true);
      await listingsService.deleteListing(productId);
      Alert.alert(
        'Success',
        'Your listing has been deleted',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/myListings') 
          }
        ]
      );
    } catch (err) {
      console.error('Error deleting listing:', err);
      Alert.alert('Error', 'Failed to delete listing. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleEditListing = () => {
    router.push({
      pathname: '/editListing',
      params: { productId }
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          Loading product details...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.errorContainer, isDarkMode && styles.darkErrorContainer]}>
        <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProductDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]} numberOfLines={1}>
          My Listing
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageError ? require('../assets/images/placeholder.png') : { uri: product.pictures[0] }} 
            style={styles.productImage}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
          {product.condition === 'new' && (
            <View style={styles.badgeNew}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>

        <View style={[styles.detailsContainer, isDarkMode && styles.darkDetailsContainer]}>
          <Text style={[styles.productTitle, isDarkMode && styles.darkText]}>
            {product.title}
          </Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          
          <View style={[styles.infoRow, isDarkMode && styles.darkBorder]}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={isDarkMode ? "#9BA1A6" : "#666"} />
              <Text style={[styles.infoText, isDarkMode && styles.darkSubText]}>
                Posted {getTimeAgo(product.createdAt)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="pricetag-outline" size={16} color={isDarkMode ? "#9BA1A6" : "#666"} />
              <Text style={[styles.infoText, isDarkMode && styles.darkSubText]}>
                Condition: {product.condition}
              </Text>
            </View>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionTitle, isDarkMode && styles.darkText]}>
              Description
            </Text>
            <Text style={[styles.descriptionText, isDarkMode && styles.darkText]}>
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditListing}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit Listing</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteListing}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkHeader: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  backButton: {
    padding: 6,
  },
  headerRightPlaceholder: {
    width: 30, // To keep the title centered
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#e9ecef',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeNew: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  darkDetailsContainer: {
    backgroundColor: '#1E2022',
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  darkBorder: {
    borderBottomColor: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    color: '#6c757d',
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 100, // Space for the footer
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#212529',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212529',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkFooter: {
    backgroundColor: '#1E2022',
    shadowOpacity: 0.3,
  },
  editButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    flex: 2,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
    elevation: 2,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  darkErrorContainer: {
    backgroundColor: '#151718',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
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
});