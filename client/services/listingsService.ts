// client/services/listingsService.ts
// Purpose: This file contains the listingsService which provides methods to interact with the listings API.
// Description: The listingsService includes methods to get all listings, get a specific listing by ID, create a new listing, update an existing listing, and delete a listing. It uses the apiService to make HTTP requests to the backend API.
import { apiService } from './api';

export interface Listing {
  _id: string;
  title: string;
  description: string;
  pictures: string[];
  price: number;
  condition: string;
  status: string;
  sellerID: string;
  createdAt: string;
  updatedAt: string;
}

interface ListingsResponse {
  success: boolean;
  message: string;
  data: {
    listings: Listing[];
  };
}

interface ListingResponse {
  success: boolean;
  message: string;
  data: {
    listing: Listing;
  };
}

interface CreateListingData {
  title: string;
  description: string;
  pictures: string[];
  price: number;
  condition: string;
  status: string;
}

export const listingsService = {
  // Get all listings (excluding user's own listings)
  getAllListings: async (): Promise<Listing[]> => {
    try {
      const response = await apiService.get<ListingsResponse>('/listings/search');
      return response.data.listings;
    } catch (error) {
      throw error;
    }
  },

  // Method to get only the user's listings
  getUserListings: async (): Promise<Listing[]> => {
    try {
      // Use the listings endpoint which returns only the user's listings
      const response = await apiService.get<ListingsResponse>('/listings');
      return response.data.listings;
    } catch (error) {
        throw error;
    }
  },

  // Get listings by category (excluding user's own listings)
  getListingsByCategory: async (category: string): Promise<Listing[]> => {
    try {
      // Use the search/category endpoint which filters by category and excludes user's listings
      const response = await apiService.post<ListingsResponse>('listings/search/category', { category });
      return response.data.listings;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific listing by ID
  getListingById: async (id: string): Promise<Listing> => {
    try {
      const response = await apiService.get<ListingResponse>(`/listings/${id}`);
      return response.data.listing;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new listing
  createListing: async (listingData: CreateListingData): Promise<Listing> => {
    try {
      const response = await apiService.post<ListingResponse>('/listings', listingData);
      return response.data.listing;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a listing
  updateListing: async (id: string, listingData: Partial<CreateListingData>): Promise<Listing> => {
    try {
      const response = await apiService.patch<ListingResponse>(`/listings/${id}`, listingData);
      return response.data.listing;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a listing
  deleteListing: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/listings/${id}`);
    } catch (error) {
      throw error;
    }
  }
};