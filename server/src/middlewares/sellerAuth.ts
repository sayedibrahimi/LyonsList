import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../types/request";
import { StatusCodes } from "http-status-codes";
import Listing, { ListingModel } from "../models/listings.model";
import ErrorMessages from "../config/errorMessages";

export async function sellerAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReq = req as UserRequest;
    const UserReqID = UserReq.user.userID;

    // query using rep.params.is (listing id) to check if the associated
    // sellerID matches the userID
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND,
      });
    }

    // if the id's dont match, return an error
    if (foundListing.sellerID.toString() !== UserReqID) {
      return next({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.LISTING_NOT_AUTHORIZED,
      });
    }

    next();
  } catch (error: unknown) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid Error" });
    return;
  }
}
