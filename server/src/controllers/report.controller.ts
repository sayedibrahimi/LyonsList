import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import ErrorMessages from "../constants/errorMessages";
import User from "../models/users.model";
import { ControllerError, NotFoundError, InternalServerError } from "../errors";
import { requestAuth } from "../utils/requestAuth";
import { isValidReportCategory } from "../constants/reportCategories";
import ReportForm from "../types/ReportForm";
import { ListingObject } from "../types";
import { UserRequestObject, MailOptions } from "../types";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import SuccessMessages from "../constants/successMessages";
import { sendEmailReport } from "../utils/sendEmail";

export async function reportListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // passing listing id by params
  // passing body of the message through json body
  // passing user id through the token
  try {
    // validate that user is authenticated
    const ReporterID: string = requestAuth(req, next);

    // validate that listing exists
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND_BY_ID);
    }

    // validate that message is not empty
    if (!req.body.category) {
      throw new NotFoundError(ErrorMessages.REPORT_MESSAGE_EMPTY);
    }
    // is the category a valid, predefined category?
    if (!isValidReportCategory(req.body.category)) {
      throw new NotFoundError(ErrorMessages.REPORT_INVALID_CATEGORY);
    }

    // build the report form
    //!
    const listingData: ListingObject = await foundListing.toObject();
    let reporterData: UserRequestObject | null =
      await User.findById(ReporterID);
    let sellerData: UserRequestObject | null = await User.findById(
      listingData.sellerID
    );
    if (reporterData === null || sellerData === null) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    // ensure id's are turned to strings for seller and reporter
    reporterData = {
      userID: ReporterID.toString(),
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

    const newReport: ReportForm = {
      listingID: foundListing._id.toString(),
      listingData,
      reporterData,
      sellerData,
      category: req.body.category,
      message: req.body.message || "",
      status: "pending",
      createdAt: new Date(),
    };

    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.EMAIL_NOT_FOUND);
    }
    const report: MailOptions<ReportForm> = {
      from: emailSender,
      to: emailSender,
      subject: `New Report: ${newReport.category}`,
      data: newReport,
    };
    await sendEmailReport(report, next);

    // send success message
    sendSuccess(res, SuccessMessages.REPORT_CREATED, StatusCodes.CREATED, {
      report: newReport,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
