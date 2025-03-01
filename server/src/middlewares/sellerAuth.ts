import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { requestAuth } from "../utils/requestAuth";
import Listing, { ListingModel } from "../models/listings.model";
import ErrorMessages from "../config/errorMessages";
import { CustomError } from "../types/CustomError";

export async function sellerAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    // query using rep.params.is (listing id) to check if the associated
    // sellerID matches the userID
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      return next(
        new CustomError(ErrorMessages.LISTING_NOT_FOUND, StatusCodes.NOT_FOUND)
      );
    }

    // if the id's dont match, return an error
    if (foundListing.sellerID.toString() !== UserReqID) {
      return next(
        new CustomError(
          ErrorMessages.LISTING_NOT_AUTHORIZED,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    next();
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
