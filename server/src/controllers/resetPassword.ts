import User, { UserModel } from "../models/users.model";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PasswordResetRequest } from "../types/PasswordResetRequest";
import {
  BadRequestError,
  InternalServerError,
  UnauthError,
  CustomError,
  NotFoundError,
} from "../errors";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";
import { requestAuth } from "../utils/requestAuth";
import { sendSuccess } from "../utils/sendResponse";

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, newPassword } = req.body as PasswordResetRequest;
    if (!email) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_EMAIL);
    }
    if (!newPassword) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_PASSWORD);
    }

    const foundUser: UserModel | null = await User.findOne({ email });
    if (!foundUser) {
      throw new NotFoundError(ErrorMessages.PASSWORD_RESET_NO_USER);
    }

    // get user account by id
    const UserReqID: string = requestAuth(req, next);

    if (foundUser._id.toString() !== UserReqID) {
      throw new UnauthError(ErrorMessages.PASSWORD_UNAUTHORIZED);
    }

    foundUser.password = newPassword;
    await foundUser.save();
    sendSuccess(
      res,
      SuccessMessages.USER_PASSWORD_SUCCESS_RESET,
      StatusCodes.OK
      //   ,{ user: foundUser }
    );
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
