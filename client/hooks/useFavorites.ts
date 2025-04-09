// client/hooks/useFavorites.ts
// Purpose: This file defines a custom hook that provides access to the FavoritesContext.
// Description: The useFavorites hook allows components to access the favorites context, including the list of favorite listings, loading state, error state, and functions to add or remove favorites. It simplifies the process of using the FavoritesContext in functional components.
import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { Listing } from '../services/listingsService';

interface UseFavoritesResult {
  favorites: Listing[];
  loading: boolean;
  error: string | null;
  refreshFavorites: () => Promise<void>;
  addFavorite: (listingId: string) => Promise<void>;
  removeFavorite: (listingId: string) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
}

export const useFavorites = (): UseFavoritesResult => {
  const context = useContext(FavoritesContext);
  
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
};