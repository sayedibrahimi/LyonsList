import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import User, { UserModel } from "../models/users.model";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import { requestAuth } from "../utils/requestAuth";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  ControllerError,
} from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";

export async function getAllFavorites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    const user: UserModel | null = await User.findById(UserReqID);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    // get all favorites data that still exist
    const favorites: ListingModel[] = await Listing.find({
      _id: { $in: user.favorites },
    }).populate("sellerID", "firstName lastName profilePicture");

    // Get the IDs of listings that still exist
    const existingListingIds: string[] = favorites.map((listing) =>
      listing._id.toString()
    );

    // Find IDs in user.favorites that don't exist in the database anymore
    const deletedListingIds: string[] = user.favorites
      .map((id) => id.toString())
      .filter((id) => !existingListingIds.includes(id));

    // If there are any deleted listings, clean up the user's favorites array
    if (deletedListingIds.length > 0) {
      await User.findByIdAndUpdate(UserReqID, {
        $pull: {
          favorites: {
            $in: deletedListingIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      });
      console.log(
        `Removed ${deletedListingIds.length} deleted listings from user ${UserReqID}'s favorites`
      );
    }

    sendSuccess(
      res,
      SuccessMessages.FAVORITES_SUCCESS_FETCHED,
      StatusCodes.OK,
      {
        favorites,
        deletedCount: deletedListingIds.length,
      }
    );
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function addFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);
    const listingID: string = req.params.id;

    const user: UserModel | null = await User.findById(UserReqID);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    const listing: ListingModel | null = await Listing.findById(listingID);
    if (!listing) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }
    if (user.favorites.includes(new mongoose.Types.ObjectId(listingID))) {
      throw new BadRequestError(ErrorMessages.LISTING_ALREADY_FAVORITED);
    }

    const updatedUser: UserModel | null = await User.findByIdAndUpdate(
      UserReqID,
      { $addToSet: { favorites: new mongoose.Types.ObjectId(listingID) } },
      { new: true }
    );

    if (!updatedUser) {
      throw new InternalServerError(ErrorMessages.LISTING_FAVORITE_FAILED);
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_FAVORITED,
      StatusCodes.OK,
      {
        favorites: updatedUser.favorites,
      }
    );
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function removeFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);
    const listingID: string = req.params.id;

    const user: UserModel | null = await User.findById(UserReqID);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    const listing: ListingModel | null = await Listing.findById(listingID);
    if (!listing) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }
    if (!user.favorites.includes(new mongoose.Types.ObjectId(listingID))) {
      throw new BadRequestError(ErrorMessages.LISTING_NOT_FAVORITED);
    }

    await User.findByIdAndUpdate(
      UserReqID,
      { $pull: { favorites: new mongoose.Types.ObjectId(listingID) } },
      { new: true }
    );

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_UNFAVORITED,
      StatusCodes.OK,
      {
        favorites: user.favorites,
      }
    );
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
