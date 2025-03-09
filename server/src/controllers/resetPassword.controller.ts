import User, { UserModel } from "../models/users.model";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendOTP } from "./otp.controller";
import {
  BadRequestError,
  InternalServerError,
  UnauthError,
  CustomError,
  NotFoundError,
} from "../errors";
import { SendOTPResponse } from "../types";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";
import { requestAuth } from "../utils/requestAuth";
import { sendSuccess } from "../utils/sendResponse";

export async function requestPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_EMAIL);
    }

    const foundUser: UserModel | null = await User.findOne({ email });
    if (!foundUser) {
      throw new NotFoundError(ErrorMessages.PASSWORD_RESET_NO_USER);
    }
    if (foundUser.verified === false) {
      throw new UnauthError(ErrorMessages.USER_UNVERIFIED);
    }
    // get user account by id
    const UserReqID: string = requestAuth(req, next);

    if (foundUser._id.toString() !== UserReqID) {
      throw new UnauthError(ErrorMessages.PASSWORD_UNAUTHORIZED);
    }

    // send OTP for password reset
    req.body.email = email;
    const otpSuccess: SendOTPResponse | void = await sendOTP(
      req,
      res,
      next,
      false
    );

    if (otpSuccess === void 0) {
      throw new BadRequestError(ErrorMessages.OTP_SEND_FAILED);
    }

    sendSuccess(res, SuccessMessages.PASSWORD_RESET_SENT, StatusCodes.OK, {
      user: foundUser,
      message: otpSuccess.message,
      expires: otpSuccess.expiresAt,
    });
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
