import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import { requestAuth } from "../utils/requestAuth";
import { CustomError } from "../types/CustomError";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";
// import { UserRequest } from "../types/UserRequest";

// Create a new listing
export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);
    req.body.sellerID = UserReqID;

    const newListing: ListingModel = await Listing.create(req.body);
    if (!newListing) {
      return next(
        new CustomError(
          ErrorMessages.LISTING_CREATION_FAILED,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_CREATED,
      StatusCodes.CREATED,
      { listing: newListing }
    );
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
}

// Get all listings
export async function getAllListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    const allListings: ListingModel[] = await Listing.find({
      sellerID: UserReqID,
    });
    // if null, check if length is zero
    if (allListings.length === 0) {
      return next(
        new CustomError(
          ErrorMessages.LISTING_NO_LISTINGS_CREATED,
          StatusCodes.NOT_FOUND
        )
      );
    }

    sendSuccess(res, SuccessMessages.LISTINGS_SUCCESS_FETCHED, StatusCodes.OK, {
      listings: allListings,
    });
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
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
      return next(
        new CustomError(
          ErrorMessages.LISTING_NOT_FOUND_BY_ID,
          StatusCodes.NOT_FOUND
        )
      );
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_FETCHED, StatusCodes.OK, {
      listing: foundListing,
    });
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
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
      return next(
        new CustomError(ErrorMessages.LISTING_NOT_FOUND, StatusCodes.NOT_FOUND)
      );
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_UPDATED, StatusCodes.OK, {
      listing: updatedListing,
    });
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
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
      return next(
        new CustomError(ErrorMessages.LISTING_NOT_FOUND, StatusCodes.NOT_FOUND)
      );
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_DELETED,
      StatusCodes.OK,
      null
    );
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
}
