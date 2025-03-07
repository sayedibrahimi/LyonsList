// screens/FavoritesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tabStyles } from '../styles/tabStyles';

interface FavoritesScreenProps {
  // Define props if needed
}

// You can define an interface for your favorite items
interface FavoriteItem {
  id: string;
  title: string;
  price: number;
  image?: string;
}

export default function FavoritesScreen({}: FavoritesScreenProps): React.ReactElement {
  // Sample data - replace with actual data from your state management
  const favorites: FavoriteItem[] = [];
  
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>Your Favorites</Text>
      </View>
      
      <ScrollView style={tabStyles.content}>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.favoriteItem}>
                <View style={styles.imageContainer}>
                  {item.image ? (
                    <Text>Image would go here</Text>
                  ) : (
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <Ionicons name="heart" size={24} color="#007BFF" />
              </View>
            )}
          />
        ) : (
          <View style={tabStyles.placeholderContent}>
            <Ionicons name="heart-outline" size={50} color="#999" />
            <Text style={tabStyles.placeholderText}>No favorites yet</Text>
            <Text style={styles.emptyStateText}>
              Items you save will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  favoriteItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  }
});