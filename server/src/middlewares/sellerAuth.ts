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

/**
 * The `sellerAuth` function in TypeScript ensures that the user making the request is authorized to
 * access a specific listing based on the seller ID.
 * @param {Request} req - The `req` parameter in the `sellerAuth` function stands for the request
 * object, which contains information about the HTTP request made to the server. This object includes
 * details such as the request headers, parameters, body, query parameters, and more. It is typically
 * used to extract data sent by the
 * @param {Response} res - The `res` parameter in the `sellerAuth` function stands for the response
 * object in Express.js. This object represents the HTTP response that an Express app sends when it
 * receives an HTTP request. It is used to send back the response to the client with data, status
 * codes, headers, etc.
 * @param {NextFunction} next - The `next` parameter in the `sellerAuth` function is a callback
 * function that is used to pass control to the next middleware function in the stack. It is typically
 * called within the middleware function to move to the next middleware or route handler. If an error
 * occurs or the middleware function completes its task
 * @returns The `sellerAuth` function is returning a Promise that resolves to `void`.
 */
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
          `${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`
        )
      );
    }
  }
}
