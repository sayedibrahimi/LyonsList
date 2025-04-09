import { NextFunction, Request, Response } from "express";
// import { Types } from "mongoose";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import { NotFoundError, ControllerError } from "../errors";
import { requestAuth } from "../utils/requestAuth";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import { isValidObjectId } from "mongoose"; // Import to validate ObjectId

export async function getAllListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    if (!isValidObjectId(UserReqID)) {
      throw new NotFoundError("Invalid user ID.");
    }

    // TODO uncomment this line to allow user to see their own listings
    // reverse order for newer listings to be on top
    const allListings: ListingModel[] = await Listing
      .find
      //   {
      //   sellerID: { $ne: new Types.ObjectId(UserReqID) },
      // }
      ()
      .sort({ createdAt: -1 }); // Sort by createdAt field in descending order

    if (!allListings || allListings.length === 0) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_FETCHED, StatusCodes.OK, {
      listings: allListings,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function getListingsByCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    const { category } = req.body;
    if (!category) {
      throw new NotFoundError("Listing category not provided.");
    }

    const allListings: ListingModel[] = await Listing.find({
      sellerID: { $ne: UserReqID },
      category: category,
    });

    if (!allListings) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_FETCHED, StatusCodes.OK, {
      listings: allListings,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
