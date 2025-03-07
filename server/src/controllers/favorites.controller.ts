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
  CustomError,
} from "../errors";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";

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

    const favorites: ListingModel[] = await Listing.find({
      _id: { $in: user.favorites },
    });

    sendSuccess(
      res,
      SuccessMessages.FAVORITES_SUCCESS_FETCHED,
      StatusCodes.OK,
      {
        favorites,
      }
    );
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      return next(
        new InternalServerError(
          `${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`
        )
      );
    }
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      return next(
        new InternalServerError(
          `${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`
        )
      );
    }
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      return next(
        new InternalServerError(
          `${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`
        )
      );
    }
  }
}
