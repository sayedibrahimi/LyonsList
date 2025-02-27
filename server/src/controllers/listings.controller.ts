import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";

// Create a new listing
export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newListing: ListingModel = await Listing.create(req.body);
    if (!newListing) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.LISTING_CREATION_FAILED,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_CREATED,
      StatusCodes.CREATED,
      { listing: newListing }
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Get all listings
export async function getAllListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const allListings: ListingModel[] | null = await Listing.find({});
    if (allListings === null || allListings.length === 0) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NO_LISTINGS_CREATED,
      });
    }

    sendSuccess(res, SuccessMessages.LISTINGS_SUCCESS_FETCHED, StatusCodes.OK, {
      listings: allListings,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Get a listing by ID
export async function getListingById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND_BY_ID,
      });
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_FETCHED, StatusCodes.OK, {
      listing: foundListing,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Update a listing by ID
export async function updateListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Check if user is authorized to update this listing
    // This would need user info from the auth middleware
    // if (req.user._id !== listing.userId) { throw new Error... }

    const updatedListing: ListingModel | null = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND,
      });
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_UPDATED, StatusCodes.OK, {
      listing: updatedListing,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Delete a listing by ID
export async function deleteListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Check if user is authorized to delete this listing
    // This would need user info from the auth middleware
    // if (req.user._id !== listing.userId) { throw new Error... }

    const deletedListing: ListingModel | null = await Listing.findByIdAndDelete(
      req.params.id
    );

    if (deletedListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_DELETED,
      StatusCodes.OK,
      null
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Get listings by user ID
export async function getListingsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userListings: ListingModel[] = await Listing.find({
      userId: req.params.userId,
    });

    if (!userListings || userListings.length === 0) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_LISTINGS_NOT_FOUND,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.USER_LISTINGS_SUCCESS_FETCHED,
      StatusCodes.OK,
      { listings: userListings }
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}
