import User, { UserModel } from "../models/users.model";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PasswordResetRequest } from "../types/PasswordResetRequest";
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
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: ErrorMessages.PASSWORD_RESET_NO_EMAIL,
      });
      return;
    }
    if (!newPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: ErrorMessages.PASSWORD_RESET_NO_PASSWORD,
      });
      return;
    }

    const foundUser: UserModel | null = await User.findOne({ email });
    if (!foundUser) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: ErrorMessages.PASSWORD_RESET_NO_USER,
      });
      return;
    }

    // get user account by id
    const UserReqID: string = requestAuth(req, next);

    if (foundUser._id.toString() !== UserReqID) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        msg: ErrorMessages.PASSWORD_UNAUTHORIZED,
      });
      return;
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
}
