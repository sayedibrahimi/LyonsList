import { NextFunction, Request, Response } from "express";
// import { Types } from "mongoose";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import { NotFoundError, ControllerError } from "../errors";
import { requestAuth } from "../utils/requestAuth";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import { isValidObjectId, Types } from "mongoose"; // Import to validate ObjectId and use Types.ObjectId
import User, { UserModel } from "../models/users.model";

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

    const user: UserModel | null = await User.findById(UserReqID);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    // reverse order for newer listings to be on top
    const allListings: ListingModel[] = await Listing.find({
      status: "available", // Filter listings with status: available
      _id: { $nin: user.reports }, // Exclude listings created by the user
    }).sort({ createdAt: -1 }); // Sort by createdAt field in descending order

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

    const user: UserModel | null = await User.findById(UserReqID);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    const allListings: ListingModel[] = await Listing.find({
      status: "available", // Filter listings with status: available
      category: category, // Filter listings by category
      _id: { $nin: user.reports }, // Exclude listings created by the user
    }).sort({ createdAt: -1 }); // Sort by createdAt field in descending order

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

export async function getListingsBatch(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    const { batchSize, offset, category } = req.body;
    if (
      !Number.isInteger(batchSize) ||
      !Number.isInteger(offset) ||
      batchSize < 1 ||
      offset < 0
    ) {
      throw new NotFoundError("Invalid Params for Batch Processing");
    }

    const user: UserModel | null = await User.findById(UserReqID);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    interface Query {
      status: string;
      _id: { $nin: Types.ObjectId[] };
      category?: string; // Optional category filter
    }

    const query: Query = {
      status: "available", // Filter listings with status: available
      _id: { $nin: user.reports }, // Exclude listings created by the user
    };
    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    const allListings: ListingModel[] = await Listing.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .skip(offset) // Skip the offset number of listings
      .limit(batchSize); // Limit the number of listings to the batch size

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
