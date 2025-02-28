import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";
import { UserRequest } from "../types/UserRequest";

// Create a new listing
export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReq = req as UserRequest;
    req.body.sellerID = UserReq.user.userID;

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
    const UserReq = req as UserRequest;
    const UserReqID = UserReq.user.userID;

    const allListings: ListingModel[] | null = await Listing.find({
      sellerID: UserReqID,
    });
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
    // then now, you can update the item
    const updatedListing: ListingModel | null = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // extraneous check
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
