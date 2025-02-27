// CONTROLLER
import { Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import { handleError } from "../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";

// Create a new listing
export async function createListing(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newListing: ListingModel = await Listing.create(req.body);
    res.status(StatusCodes.CREATED).json({ listing: newListing });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// Get all listings
export async function getAllListings(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const allListings: ListingModel[] | null = await Listing.find({});
    if (allListings === null || allListings.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "No listings found" });
      return;
    }
    res.status(StatusCodes.OK).json({ listings: allListings });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// Get a listing by ID
export async function getListingById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No listing found with the given ID" });
      return;
    }
    res.status(StatusCodes.OK).json({ listing: foundListing });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// Update a listing by ID
export async function updateListing(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const updatedListing: ListingModel | null = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedListing === null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No listing found with the given ID" });
      return;
    }
    res.status(StatusCodes.OK).json({ listing: updatedListing });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// Delete a listing by ID
export async function deleteListing(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const deletedListing: ListingModel | null = await Listing.findByIdAndDelete(
      req.params.id
    );
    if (deletedListing === null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No listing found with the given ID" });
      return;
    }
    res
      .status(StatusCodes.OK)
      .json({ listing: null, status: "Successfully deleted" });
  } catch (error: unknown) {
    handleError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
