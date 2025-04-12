// client/screens/ProductDetailsScreen.tsx
// Purpose: This file contains the ProductDetailsScreen component that displays detailed information about a product listing. It includes features such as viewing images, adding to favorites, reporting the listing, and contacting the seller.
// Description: The ProductDetailsScreen component fetches product details from an API, handles loading and error states, and provides a user interface for interacting with the product. It uses React Native components and hooks for state management and navigation. The component also includes dark mode styling and integrates with a custom favorites management system.
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
import { useFavorites } from '../hooks/useFavorites';
import ReportListingModal from '../components/ReportListingModal';
import ScreenHeader from '../components/ScreenHeader';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProductDetailsScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId as string;
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [product, setProduct] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

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

  const handleFavoriteToggle = async () => {
    if (!user) {
      Alert.alert(
        'Authentication Required',
        'Please login to add items to favorites',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    if (!product) return;
    
    try {
      if (isFavorite(product._id)) {
        await removeFavorite(product._id);
      } else {
        await addFavorite(product._id);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleReply = () => {
    if (!user) {
      Alert.alert(
        'Authentication Required',
        'Please login to contact the seller',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    // Navigate to chat screen with the seller info
    if (product && product.sellerID) {
      router.push({
        pathname: '/(tabs)/chat',
        params: { 
          sellerId: product.sellerID,
          productId: product._id,
          productTitle: product.title
        }
      });
    }
  };

  const handleReport = () => {
    if (!user) {
      Alert.alert(
        'Authentication Required',
        'Please login to report a listing',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    setShowReportModal(true);
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

  const favorited = isFavorite(product._id);

  const headerRight = (
    <View style={styles.headerActions}>
      <TouchableOpacity 
        style={styles.reportButton}
        onPress={handleReport}
      >
        <Ionicons 
          name="flag-outline" 
          size={22} 
          color={isDarkMode ? '#ECEDEE' : '#333'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
      >
        <Ionicons 
          name={favorited ? "heart" : "heart-outline"} 
          size={24} 
          color={favorited ? "#ff6b6b" : (isDarkMode ? '#ECEDEE' : '#333')} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScreenHeader 
        title="Product Details" 
        rightComponent={headerRight}
      />

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
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
          style={styles.replyButton}
          onPress={handleReply}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.replyButtonText}>Reply to Seller</Text>
        </TouchableOpacity>
      </View>

      {/* Report Modal */}
      <ReportListingModal 
        isVisible={showReportModal}
        onClose={() => setShowReportModal(false)}
        listingId={productId}
        listingTitle={product ? product.title : ''}
      />
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
  backButton: {
    padding: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 6,
  },
  reportButton: {
    padding: 6,
    marginRight: 5,
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
  darkText: {
    color: '#ECEDEE',
  },
  darkSubText: {
    color: '#9BA1A6',
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkFooter: {
    backgroundColor: '#1E2022',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  replyButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  replyButtonText: {
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