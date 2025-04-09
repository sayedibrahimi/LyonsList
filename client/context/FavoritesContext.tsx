// client/context/FavoritesContext.tsx
// Purpose: This file defines the FavoritesContext and its provider, which manages the user's favorite listings.
// Description: The FavoritesContext provides a way to manage the user's favorite listings throughout the application. It includes functions to fetch, add, and remove favorites, as well as a function to check if a listing is a favorite. The context is designed to be used with React's Context API and hooks.
import { createContext, useState, useEffect, ReactNode } from 'react';
import { favoritesService } from '../services/favoritesService';
import { Listing } from '../services/listingsService';
import { useAuth } from '../hooks/useAuth';

interface FavoritesContextType {
  favorites: Listing[];
  loading: boolean;
  error: string | null;
  refreshFavorites: () => Promise<void>;
  addFavorite: (listingId: string) => Promise<void>;
  removeFavorite: (listingId: string) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch favorites when the component mounts and when user changes
  useEffect(() => {
    if (user) {
      refreshFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const refreshFavorites = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await favoritesService.getAllFavorites();
      setFavorites(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch favorites';
      setError(errorMessage);
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (listingId: string): Promise<void> => {
    if (!user) return;
    
    try {
      await favoritesService.addFavorite(listingId);
      // Refresh favorites after adding
      await refreshFavorites();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to add favorite';
      setError(errorMessage);
      console.error('Error adding favorite:', err);
    }
  };

  const removeFavorite = async (listingId: string): Promise<void> => {
    if (!user) return;
    
    try {
      await favoritesService.removeFavorite(listingId);
      // Refresh favorites after removing
      await refreshFavorites();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to remove favorite';
      setError(errorMessage);
      console.error('Error removing favorite:', err);
    }
  };

  const isFavorite = (listingId: string): boolean => {
    return favorites.some(fav => fav._id === listingId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error,
        refreshFavorites,
        addFavorite,
        removeFavorite,
        isFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};