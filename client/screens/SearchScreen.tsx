// client/screens/SearchScreen.tsx
// Purpose: This file contains the SearchScreen component that allows users to search for products in a marketplace. It includes a search bar, product listing, and handles dark mode styling. The component uses React Native's built-in components and hooks for state management and navigation.
// Description: The SearchScreen component fetches product listings from an API, filters them based on the search query, and displays them in a list. It handles loading states, error handling, and empty state scenarios. The component also utilizes custom hooks for authentication and favorites management, and it applies styles based on the current color scheme (light or dark mode).
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  Alert, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createTabStyles } from '../styles/tabStyles';
import { listingsService, Listing } from '../services/listingsService';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useColorScheme } from '../hooks/useColorScheme';

export default function SearchScreen(): React.ReactElement {
  const [products, setProducts] = useState<Listing[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const colorScheme = useColorScheme();
  
  // Get tab styles based on current color scheme
  const tabStyles = createTabStyles(colorScheme);
  const isDarkMode = colorScheme === 'dark';
  
  // Fetch products from the API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await listingsService.getAllListings();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(text.toLowerCase()) || 
      product.description.toLowerCase().includes(text.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Calculate how long ago the item was posted
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

  const handleFavoriteToggle = async (item: Listing) => {
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
    
    try {
      if (isFavorite(item._id)) {
        await removeFavorite(item._id);
      } else {
        await addFavorite(item._id);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  // Render each product item
  const renderProductItem = ({ item }: { item: Listing }) => {
    const favorited = isFavorite(item._id);
    const itemImageError = imageError[item._id] || false;
    
    return (
      <TouchableOpacity 
        style={[
          styles.productCard,
          isDarkMode && styles.darkProductCard
        ]}
        onPress={() => router.push({
          pathname: '/productDetails',
          params: { productId: item._id }
        })}
      >
        <View style={styles.productImageContainer}>
          <Image 
            source={
              itemImageError 
                ? require('../assets/images/placeholder.png') 
                : { uri: item.pictures[0] }
            } 
            style={styles.productImage}
            onError={() => {
              setImageError(prev => ({
                ...prev,
                [item._id]: true
              }));
            }}
          />
          {item.condition === 'new' && (
            <View style={styles.badgeNew}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={[
            styles.productTitle,
            isDarkMode && styles.darkText
          ]} numberOfLines={1}>{item.title}</Text>
          <Text style={[
            styles.productDescription,
            isDarkMode && styles.darkSubText
          ]} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.productFooter}>
            <Text style={[
              styles.timeAgo,
              isDarkMode && styles.darkSubText
            ]}>{getTimeAgo(item.createdAt)}</Text>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
          </View>
        </View>
        
        {user && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => handleFavoriteToggle(item)}
          >
            <Ionicons 
              name={favorited ? "heart" : "heart-outline"} 
              color={favorited ? "#ff6b6b" : (isDarkMode ? "#9BA1A6" : "#ccc")}
              size={24} 
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={tabStyles.container}>
      <View style={[
        tabStyles.header,
        isDarkMode && { borderBottomColor: '#333' }
      ]}>
        <Text style={tabStyles.headerTitle}>Search Marketplace</Text>
      </View>
      
      <View style={[
        styles.searchBarContainer,
        isDarkMode && { backgroundColor: '#1E2022' }
      ]}>
        <View style={[
          styles.searchBar,
          isDarkMode && styles.darkSearchBar
        ]}>
          <Ionicons name="search" size={20} color={isDarkMode ? "#9BA1A6" : "#666"} style={styles.searchIcon} />
          <TextInput 
            style={[
              styles.searchInput,
              isDarkMode && styles.darkSearchInput
            ]}
            placeholder="What are you looking for?"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={isDarkMode ? "#9BA1A6" : "#666"} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={[
          styles.loadingContainer,
          isDarkMode && { backgroundColor: '#151718' }
        ]}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[
            styles.loadingText,
            isDarkMode && styles.darkText
          ]}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={[
          styles.errorContainer,
          isDarkMode && { backgroundColor: '#151718' }
        ]}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={[
            styles.errorText,
            isDarkMode && styles.darkText
          ]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={[
          styles.emptyContainer,
          isDarkMode && { backgroundColor: '#151718' }
        ]}>
          <Ionicons name="search-outline" size={48} color={isDarkMode ? "#9BA1A6" : "#aaa"} />
          <Text style={[
            styles.emptyText,
            isDarkMode && styles.darkText
          ]}>No products found</Text>
          {searchQuery.length > 0 && (
            <Text style={[
              styles.emptySubtext,
              isDarkMode && styles.darkSubText
            ]}>Try a different search term</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item._id}
          style={[
            styles.productList,
            isDarkMode && { backgroundColor: '#151718' }
          ]}
          contentContainerStyle={styles.productListContent}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginRight: 10,
    height: 42,
  },
  darkSearchBar: {
    backgroundColor: '#2A2F33',
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  darkSearchInput: {
    color: '#ECEDEE',
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  productList: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  productListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  darkProductCard: {
    backgroundColor: '#1E2022',
    shadowColor: '#000',
    borderColor: '#333',
  },
  productImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    paddingRight: 25,
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007bff',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  badgeNew: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
});