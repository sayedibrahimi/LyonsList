import { NextFunction, Request, Response } from "express";
import Listing, { ListingModel } from "../models/listings.model";
import ErrorMessages from "../constants/errorMessages";
import {
  ControllerError,
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "../errors";
import { requestAuth } from "../utils/requestAuth";
import { isValidReportCategory } from "../constants/reportCategories";
import ReportForm from "../types/ReportForm";
import { MailOptions } from "../types";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import SuccessMessages from "../constants/successMessages";
import { sendEmailReport } from "../utils/sendEmail";
import Report, { ReportModel } from "../models/reports.model";
import { createReportForm } from "../utils/createReportForm";
import User, { UserModel } from "../models/users.model";
import mongoose from "mongoose";

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
    const reporterID: string = requestAuth(req, next);

    // validate that listing exists
    const foundListing: ListingModel | null = await Listing.findById(
      req.params.id
    );
    if (foundListing === null) {
      throw new NotFoundError(ErrorMessages.LISTING_NOT_FOUND_BY_ID);
    }
    const listingID: string = foundListing._id.toString();

    // validate that message is not empty
    if (!req.body.category) {
      throw new NotFoundError(ErrorMessages.REPORT_MESSAGE_EMPTY);
    }
    // is the category a valid, predefined category?
    if (!isValidReportCategory(req.body.category)) {
      throw new NotFoundError(ErrorMessages.REPORT_INVALID_CATEGORY);
    }

    // create a report object
    const existingReport: ReportModel | null = await Report.findOne({
      listingId: listingID,
      reporterId: reporterID,
    });
    if (existingReport) {
      console.log("Report already exists:", existingReport);
      throw new BadRequestError(ErrorMessages.REPORT_ALREADY_EXISTS);
    }

    const createdReport: ReportModel = new Report({
      listingId: listingID,
      reporterId: reporterID,
      reason: req.body.category, // Ensure this matches a valid category
      description: req.body.message || "",
      createdAt: new Date(),
      status: "pending",
    });
    await createdReport.save();

    // increment the report count on the listing
    await Listing.updateOne(
      { _id: listingID },
      {
        $inc: { reportCount: 1 },
        $set: { lastReported: new Date() },
      }
    );

    const updatedUser: UserModel | null = await User.findByIdAndUpdate(
      reporterID,
      { $addToSet: { reports: new mongoose.Types.ObjectId(listingID) } },
      { new: true }
    );
    if (!updatedUser) {
      throw new InternalServerError(ErrorMessages.LISTING_FAVORITE_FAILED);
    }

    // build the report form
    const newReport: ReportForm | undefined = await createReportForm(
      reporterID,
      listingID,
      req.body.category,
      req.body.message,
      next
    );
    if (newReport === undefined) {
      throw new InternalServerError("Failed to create report form.");
    }

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
