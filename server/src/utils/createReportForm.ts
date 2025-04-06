import ErrorMessages from "../constants/errorMessages";
import Listing from "../models/listings.model";
import User from "../models/users.model";
import { ControllerError, NotFoundError } from "../errors";
import { NextFunction } from "express";
import ReportForm from "../types/ReportForm";
import { UserRequestObject, ListingObject } from "../types";
import { isValidReportCategory } from "../constants/reportCategories";

export async function createReportForm(
  reporterID: string,
  listingID: string,
  category: string,
  message: string,
  next: NextFunction
): Promise<ReportForm | undefined> {
  try {
    const listingData: ListingObject | null = await Listing.findById(listingID);
    if (listingData === null) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND);
    }
    let reporterData: UserRequestObject | null =
      await User.findById(reporterID);
    let sellerData: UserRequestObject | null = await User.findById(
      listingData.sellerID
    );
    if (reporterData === null || sellerData === null) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    // ensure id's are turned to strings for seller and reporter
    reporterData = {
      userID: reporterID.toString(),
      firstName: reporterData.firstName,
      lastName: reporterData.lastName,
      email: reporterData.email,
    };
    sellerData = {
      userID: listingData.sellerID.toString(),
      firstName: sellerData.firstName,
      lastName: sellerData.lastName,
      email: sellerData.email,
    };

    if (!isValidReportCategory(category)) {
      throw new Error(ErrorMessages.INVALID_REPORT_CATEGORY);
    }

    const newReport: ReportForm = {
      listingID: listingID,
      listingData,
      reporterData,
      sellerData,
      category: category, // Ensure this matches a valid category
      message: message || "",
      status: "pending",
      createdAt: new Date(),
    };
    return newReport;
  } catch (error: unknown) {
    ControllerError(error, next);
    return undefined;
  }
}
