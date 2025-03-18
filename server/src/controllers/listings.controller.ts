import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import { requestAuth } from "../utils/requestAuth";
import { BadRequestError, NotFoundError, ControllerError } from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import User, { UserModel } from "../models/users.model";
import { ListingObject } from "../types";
import { validListingRequest } from "../utils/validListingRequest";

// Create a new listing
export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);
    req.body.sellerID = UserReqID;

    //TODO: Add validation for the request body and send bad request
    if (!validListingRequest(req.body as ListingObject)) {
      throw new BadRequestError(ErrorMessages.LISTING_INVALID_REQUEST);
    }

    const newListing: ListingModel = await Listing.create(req.body);
    if (!newListing) {
      throw new BadRequestError(ErrorMessages.LISTING_CREATION_FAILED);
    }

    const postingUser: UserModel | null = await User.findById(UserReqID);
    if (postingUser === null) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }
    postingUser.totalListings += 1;
    await postingUser.save();

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_CREATED,
      StatusCodes.CREATED,
      { listing: newListing }
    );
  } catch (error: unknown) {
    ControllerError(error, next);
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
      throw new NotFoundError(ErrorMessages.LISTING_NO_LISTINGS_CREATED);
    }

    sendSuccess(res, SuccessMessages.LISTINGS_SUCCESS_FETCHED, StatusCodes.OK, {
      listings: allListings,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
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
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND_BY_ID);
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_FETCHED, StatusCodes.OK, {
      listing: foundListing,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
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
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_UPDATED, StatusCodes.OK, {
      listing: updatedListing,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
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
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }

    // const postingUser: UserModel | null = await User.findById(UserReqID);
    // if (postingUser === null) {
    //   throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    // }
    // postingUser.totalListings -= 1;
    // await postingUser.save();

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_DELETED,
      StatusCodes.OK,
      null
    );
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
