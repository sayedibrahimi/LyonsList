import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
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
import { MailOptions, FeedbackForm } from "../types";
import { sendEmailFeedback } from "../utils/sendEmail";

export async function sendFeedback(
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

    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.EMAIL_NOT_FOUND);
    }
    const userEmail: string = user.email;
    const message: string = req.body.message;
    const subject: string = req.body.subject;

    if (!message || !subject) {
      throw new BadRequestError("Feedback message or subject is missing.");
    }

    const feedbackMessage: FeedbackForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: userEmail,
      subject: subject,
      message: message,
    };

    const feedbackObject: MailOptions<FeedbackForm> = {
      from: userEmail,
      to: emailSender,
      subject: `${subject} from ${user.firstName} ${user.lastName}`,
      data: feedbackMessage,
    };

    await sendEmailFeedback(feedbackObject, next);

    sendSuccess(res, SuccessMessages.FEEDBACK_SENT, StatusCodes.OK, {
      data: feedbackObject,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function reportIssue(
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

    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.EMAIL_NOT_FOUND);
    }
    const userEmail: string = user.email;
    const message: string = req.body.message;
    const subject: string = req.body.subject;
    const issue: string = req.body.issue;

    if (!message || !subject) {
      throw new BadRequestError("Feedback message or subject is missing.");
    }

    const feedbackMessage: FeedbackForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: userEmail,
      subject: subject,
      message: message,
      issue: issue,
    };

    const feedbackObject: MailOptions<FeedbackForm> = {
      from: userEmail,
      to: emailSender,
      subject: `Issue Reported: ${subject}`,
      data: feedbackMessage,
    };

    await sendEmailFeedback(feedbackObject, next);

    sendSuccess(res, SuccessMessages.FEEDBACK_SENT, StatusCodes.OK, {
      data: feedbackObject,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
