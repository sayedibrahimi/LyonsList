// CONTROLLER
import { Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model"; // Adjust the import path as needed
import { handleError } from "../middlewares/handleError";

// Create a new listing
export async function createListing(req: Request, res: Response) {
  try {
    const newListing: ListingModel = await Listing.create(req.body);
    res.status(201).json({ listing: newListing });
  } catch (error: unknown) {
    handleError(res, error);
  }
}

// Get all listings
export async function getAllListings(req: Request, res: Response) {
  try {
    const allListings: ListingModel[] | null = await Listing.find({});
    if (allListings === null || allListings.length === 0) {
      res.status(404).json({ msg: "No listings found" });
      return;
    }
    res.status(200).json({ listings: allListings });
  } catch (error: unknown) {
    handleError(res, error);
  }
}

// Get a listing by ID
export async function getListingById(req: Request, res: Response) {
  try {
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      res.status(404).json({ msg: "No listing found with the given ID" });
      return;
    }
    res.status(200).json({ listing: foundListing });
  } catch (error: unknown) {
    handleError(res, error);
  }
}

// Update a listing by ID
export async function updateListing(req: Request, res: Response) {
  try {
    const updatedListing: ListingModel | null = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedListing === null) {
      res.status(404).json({ msg: "No listing found with the given ID" });
      return;
    }
    res.status(200).json({ listing: updatedListing });
  } catch (error: unknown) {
    handleError(res, error);
  }
}

// Delete a listing by ID
export async function deleteListing(req: Request, res: Response) {
  try {
    const deletedListing: ListingModel | null = await Listing.findByIdAndDelete(
      req.params.id
    );
    if (deletedListing === null) {
      res.status(404).json({ msg: "No listing found with the given ID" });
      return;
    }
    res.status(200).json({ listing: null, status: "Successfully deleted" });
  } catch (error: unknown) {
    handleError(res, error);
  }
}
