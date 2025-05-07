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
  StyleSheet,
  Modal,
  ScrollView,
  RefreshControl // Import RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createTabStyles } from '../styles/tabStyles';
import { listingsService, Listing } from '../services/listingsService';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useColorScheme } from '../hooks/useColorScheme';
import { Categories } from '@/constants/Categories';

export default function SearchScreen(): React.ReactElement {
  const [products, setProducts] = useState<Listing[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state for ScrollView
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const colorScheme = useColorScheme();
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  
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
      setRefreshing(false); // Make sure to turn off refreshing
    }
  };

  // Add this function for the pull-to-refresh functionality
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
  };

  // Handle search functionality
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Update filtering logic (unchanged)
  useEffect(() => {
    if (!user || !products.length) return;
    
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter, user]);

  // Format price for display (unchanged)
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Calculate how long ago the item was posted (unchanged)
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

  // Favorite toggle logic (unchanged)
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
  }

  // Category modal (unchanged)
  const renderCategoryModal = () => {
    return (
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={[
            styles.modalContainer,
            isDarkMode && styles.darkModalContainer
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                Filter by Category
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.categoryList} contentContainerStyle={{ paddingBottom: 24 }}>
              <TouchableOpacity 
                style={[
                  styles.categoryOption,
                  !categoryFilter && {
                    backgroundColor: isDarkMode ? '#3A3F44' : '#e0f0ff'
                  }
                ]}
                onPress={() => {
                  setCategoryFilter('');
                  setShowCategoryModal(false);
                }}
              >
                <Text style={[
                  styles.categoryOptionText,  
                  !categoryFilter && styles.categoryOptionTextActive,
                  isDarkMode && styles.darkText
                ]}>
                  All Categories
                </Text>
              </TouchableOpacity>
              
              {Object.values(Categories).map((category) => (
                <TouchableOpacity 
                  key={category}
                  style={[
                    styles.categoryOption, 
                    categoryFilter === category && {
                      backgroundColor: isDarkMode ? '#3A3F44' : '#e0f0ff'
                    }
                  ]}
                  onPress={() => {
                    setCategoryFilter(category);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    categoryFilter === category && {
                      color: isDarkMode ? '#fff' : '#007bff',
                      fontWeight: '600',
                    },
                    isDarkMode && { color: '#ECEDEE' }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  // Render each product item (unchanged)
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

  // Modified empty state with ScrollView and RefreshControl
  const renderEmptyState = () => {
    return (
      <ScrollView 
        contentContainerStyle={[
          styles.emptyScrollViewContainer,
          isDarkMode && { backgroundColor: '#151718' }
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor={isDarkMode ? '#9BA1A6' : '#007bff'}
          />
        }
      >
        <View style={styles.emptyContentContainer}>
          <Ionicons name="search-outline" size={48} color={isDarkMode ? "#9BA1A6" : "#aaa"} />
          <Text style={[
            styles.emptyText,
            isDarkMode && styles.darkText
          ]}>No products found</Text>
          
          {(searchQuery.length > 0 || categoryFilter) ? (
            <Text style={[
              styles.emptySubtext,
              isDarkMode && styles.darkSubText
            ]}>Try a different search term or category</Text>
          ) : (
            <Text style={[
              styles.emptySubtext,
              isDarkMode && styles.darkSubText
            ]}>Pull down to refresh or tap the button below</Text>
          )}
          
          {categoryFilter && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setCategoryFilter('')}
            >
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
          
          {!refreshing && !searchQuery && !categoryFilter && (
            <TouchableOpacity 
              style={[styles.retryButton, { marginTop: 20 }]}
              onPress={fetchProducts}
            >
              <Text style={styles.retryButtonText}>Refresh Marketplace</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <View style={styles.filterButtonContent}>
            <Ionicons name="filter" size={18} color="#fff" />
            {categoryFilter && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>1</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
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
        renderEmptyState()
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
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      {renderCategoryModal()}
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
  // Updated empty state styles
  emptyScrollViewContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  emptyContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 500, // Give enough height for pull-to-refresh to work well
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
    textAlign: 'center',
  },
  filterButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonContent: {
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  clearFilterButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  clearFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  darkModalContainer: {
    backgroundColor: '#1E2022',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  categoryList: {
    padding: 16,
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryOptionActive: {
    backgroundColor: '#f0f8ff',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  categoryOptionTextActive: {
    color: '#007BFF',
    fontWeight: '600',
  },
});