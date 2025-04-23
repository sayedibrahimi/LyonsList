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

    // TODO uncomment this line to allow user to see their own listings
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
