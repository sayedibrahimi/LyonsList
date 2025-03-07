// src/screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { tabStyles } from '../styles/tabStyles';

// Define product interface based on your data structure
interface Product {
  id: string;
  title: string;
  description: string;
  picture: string;
  price: { $numberInt: string };
  condition: string;
  status: string;
  sellerID: { $oid: string };
  createdAt: { $date: { $numberLong: string } };
  updatedAt: { $date: { $numberLong: string } };
  __v: { $numberInt: string };
}

export default function SearchScreen(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  // Fetch products from your JSON server
  // Fetch products from your JSON server
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('http://172.20.6.184:3001/products');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
      console.error('Error fetching products:', err);
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
  const formatPrice = (price: string) => {
    return `$${parseInt(price).toFixed(2)}`;
  };

  // Calculate how long ago the item was posted
  const getTimeAgo = (timestamp: string) => {
    const postTime = new Date(parseInt(timestamp));
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

  // Render each product item
  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}
    onPress={() => router.push({
        pathname: '/productDetails',
        params: { productId: item.id }
      })}>
      <View style={styles.productImageContainer}>
        <Image 
        source={imageError ? require('../assets/images/placeholder.png') : { uri: item.picture }} 
        style={styles.productImage}
        onError={() => setImageError(true)} // If image fails to load, show placeholder
      />
        {item.condition === 'new' && (
          <View style={styles.badgeNew}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.productFooter}>
          <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt.$date.$numberLong)}</Text>
          <Text style={styles.productPrice}>{formatPrice(item.price.$numberInt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tabStyles.container}>
      <View style={styles.header}>
        <Text style={tabStyles.headerTitle}>Search Marketplace</Text>
      </View>
      
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="What are you looking for?"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#666" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#aaa" />
          <Text style={styles.emptyText}>No products found</Text>
          {searchQuery.length > 0 && (
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          style={styles.productList}
          contentContainerStyle={styles.productListContent}
          numColumns={1} // Set to 2 for a 2-column grid
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  
  // Search bar styles
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
  
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  
  // Product list styles
  productList: {
    flex: 1,
  },
  productListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  
  // Product card styles
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
    fontWeight: '600',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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
  
  // Loading, error, empty states
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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