import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";
import { UserRequest } from "../types/request";
import User from "../models/users.model";

// Create a new listing
export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReq = req as UserRequest;
    req.body.sellerID = UserReq.user.userID;
    console.log(req.body);

    const newListing: ListingModel = await Listing.create(req.body);
    if (!newListing) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.LISTING_CREATION_FAILED,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_CREATED,
      StatusCodes.CREATED,
      { listing: newListing }
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Get all listings
export async function getAllListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReq = req as UserRequest;
    const UserReqID = UserReq.user.userID;

    const allListings: ListingModel[] | null = await Listing.find({
      sellerID: UserReqID,
    });
    if (allListings === null || allListings.length === 0) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NO_LISTINGS_CREATED,
      });
    }

    sendSuccess(res, SuccessMessages.LISTINGS_SUCCESS_FETCHED, StatusCodes.OK, {
      listings: allListings,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Get a listing by ID
export async function getUserListingById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND_BY_ID,
      });
    }

    // // check if the listing matches the seller ID
    // const UserReq = req as UserRequest;
    // const UserReqID = UserReq.user.userID;

    // if (foundListing.sellerID.toString() !== UserReqID) {
    //   return next({
    //     statusCode: StatusCodes.UNAUTHORIZED,
    //     message: ErrorMessages.LISTING_NOT_AUTHORIZED,
    //   });
    // }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_FETCHED, StatusCodes.OK, {
      listing: foundListing,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Update a listing by ID
export async function updateListing(
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

    // then now, you can update the item
    const updatedListing: ListingModel | null = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // extraneous check
    if (updatedListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND,
      });
    }

    sendSuccess(res, SuccessMessages.LISTING_SUCCESS_UPDATED, StatusCodes.OK, {
      listing: updatedListing,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// Delete a listing by ID
export async function deleteListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Check if user is authorized to delete this listing
    // This would need user info from the auth middleware
    // if (req.user._id !== listing.userId) { throw new Error... }

    const deletedListing: ListingModel | null = await Listing.findByIdAndDelete(
      req.params.id
    );

    if (deletedListing === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.LISTING_NOT_FOUND,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.LISTING_SUCCESS_DELETED,
      StatusCodes.OK,
      null
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// // Get listings by user ID
// export async function getListingsByUserId(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const userListings: ListingModel[] = await Listing.find({
//       sellerID: req.params.id,
//       //! be careful
//     });

//     if (!userListings || userListings.length === 0) {
//       return next({
//         statusCode: StatusCodes.NOT_FOUND,
//         message: ErrorMessages.USER_LISTINGS_NOT_FOUND,
//       });
//     }

//     sendSuccess(
//       res,
//       SuccessMessages.USER_LISTINGS_SUCCESS_FETCHED,
//       StatusCodes.OK,
//       { listings: userListings }
//     );
//   } catch (error: unknown) {
//     return next({
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: ErrorMessages.INTERNAL_SERVER_ERROR,
//       errors: error,
//     });
//   }
// }
