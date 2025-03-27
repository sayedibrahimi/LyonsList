// client/services/listingsService.ts
// Purpose: Handle listing related API requests
// Description: This file contains methods for handling listing related API requests such as getting all listings, getting a specific listing by ID, creating a new listing, updating a listing, and deleting a listing.
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
  // Get all listings (without authentication)
  getAllListings: async (): Promise<Listing[]> => {
    try {
      const response = await apiService.get<ListingsResponse>('/listings');
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