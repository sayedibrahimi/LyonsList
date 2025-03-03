import { Request, Response, NextFunction } from "express";
import { requestAuth } from "../utils/requestAuth";
import Listing, { ListingModel } from "../models/listings.model";
import ErrorMessages from "../config/errorMessages";
import {
  InternalServerError,
  UnauthError,
  NotFoundError,
  CustomError,
} from "../errors";

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
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }

    // if the id's dont match, return an error
    if (foundListing.sellerID.toString() !== UserReqID) {
      throw new UnauthError(ErrorMessages.LISTING_NOT_AUTHORIZED);
    }

    next();
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      return next(
        new InternalServerError(
          (ErrorMessages.INTERNAL_SERVER_ERROR + error) as string
        )
      );
    }
  }
}
