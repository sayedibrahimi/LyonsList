// client/services/favoritesService.ts
// Purpose: Handle favorite related API requests
// Description: This file contains methods for handling favorite related API requests such as getting all favorites, adding a favorite, removing a favorite, and checking if a listing is in favorites.
import { apiService } from './api';
import { Listing } from './listingsService';

interface FavoritesResponse {
  success: boolean;
  message: string;
  data: {
    favorites: Listing[];
    deletedCount?: number;
  };
}

interface FavoriteActionResponse {
  success: boolean;
  message: string;
  data: {
    favorites: string[];
  };
}

export const favoritesService = {
  // Get all favorite listings for the current user
  getAllFavorites: async (): Promise<Listing[]> => {
    try {
      const response = await apiService.get<FavoritesResponse>('/favorites');
      return response.data.favorites;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a listing to favorites
  addFavorite: async (listingId: string): Promise<string[]> => {
    try {
      const response = await apiService.post<FavoriteActionResponse>(`/favorites/${listingId}`, {});
      return response.data.favorites;
    } catch (error) {
      throw error;
    }
  },
  
  // Remove a listing from favorites
  removeFavorite: async (listingId: string): Promise<string[]> => {
    try {
      const response = await apiService.delete<FavoriteActionResponse>(`/favorites/${listingId}`);
      return response.data.favorites;
    } catch (error) {
      throw error;
    }
  },
  
  // Check if a listing is in favorites
  isInFavorites: async (favorites: Listing[], listingId: string): Promise<boolean> => {
    return favorites.some(favorite => favorite._id === listingId);
  }
};