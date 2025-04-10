// client/screens/FavoritesScreen.tsx
// Purpose: This code defines a FavoritesScreen component that displays a list of favorite items for a user. It includes functionality to remove items from favorites, handle loading and error states, and navigate to product details. The screen also adapts its appearance based on the user's theme preference (light or dark mode).
// Description: The FavoritesScreen component uses React Native components to create a user interface that displays a list of favorite items. It utilizes hooks for managing state and side effects, such as loading data and handling errors. The screen also includes styles for both light and dark modes, ensuring a consistent user experience across different themes.
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createTabStyles } from '../styles/tabStyles';
import { Listing } from '../services/listingsService';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useColorScheme } from '../hooks/useColorScheme';

export default function FavoritesScreen(): React.ReactElement {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user } = useAuth();
  const { favorites, loading, error, refreshFavorites, removeFavorite } = useFavorites();
  const colorScheme = useColorScheme();
  const tabStyles = createTabStyles(colorScheme);
  const isDarkMode = colorScheme === 'dark';

  // Format price for display
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderFavoriteItem = ({ item }: { item: Listing }) => {
    const itemImageError = imageError[item._id] || false;
    
    return (
      <TouchableOpacity 
        style={[
          styles.favoriteItem,
          isDarkMode && styles.darkFavoriteItem
        ]}
        onPress={() => router.push({
          pathname: '/productDetails',
          params: { productId: item._id }
        })}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={
              itemImageError 
                ? require('../assets/images/placeholder.png') 
                : { uri: item.pictures[0] }
              } 
            style={styles.itemImage}
            onError={() => {
              setImageError(prev => ({
                ...prev,
                [item._id]: true
              }));
            }}
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={[
            styles.itemTitle,
            isDarkMode && styles.darkText
          ]}>{item.title}</Text>
          <Text style={[
            styles.itemPrice,
            isDarkMode && { color: '#4a9eff' }
          ]}>{formatPrice(item.price)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFavorite(item._id)}
        >
          <Ionicons name="heart" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <View style={tabStyles.container}>
        <View style={tabStyles.header}>
          <Text style={tabStyles.headerTitle}>Your Favorites</Text>
        </View>
        <View style={[
          styles.notLoggedInContainer,
          isDarkMode && { backgroundColor: '#151718' }
        ]}>
          <Ionicons name="lock-closed-outline" size={50} color={isDarkMode ? "#9BA1A6" : "#999"} />
          <Text style={[
            styles.notLoggedInText,
            isDarkMode && styles.darkText
          ]}>Please log in to view your favorites</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>Your Favorites</Text>
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
          ]}>Loading favorites...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={refreshFavorites}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={[
            styles.listContent,
            isDarkMode && { backgroundColor: '#151718' }
          ]}
          refreshing={loading}
          onRefresh={refreshFavorites}
          style={isDarkMode ? { backgroundColor: '#151718' } : undefined}
        />
      ) : (
        <View style={[
          tabStyles.placeholderContent,
          isDarkMode && { backgroundColor: '#1E2022' }
        ]}>
          <Ionicons name="heart-outline" size={50} color={isDarkMode ? "#9BA1A6" : "#999"} />
          <Text style={[
            tabStyles.placeholderText,
            isDarkMode && styles.darkText
          ]}>No favorites yet</Text>
          <Text style={[
            styles.emptyStateText,
            isDarkMode && styles.darkSubText
          ]}>
            Save items you like by tapping the heart icon
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.browseButtonText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  darkFavoriteItem: {
    backgroundColor: '#1E2022',
    borderColor: '#333',
    shadowOpacity: 0.2,
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  itemPrice: {
    fontSize: 15,
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
  removeButton: {
    padding: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: '600',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});