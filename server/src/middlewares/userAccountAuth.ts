import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import User, { UserModel } from "../models/users.model";
import { UserRequest, UserRequestObject } from "../types/UserRequest";
import ErrorMessages from "../config/errorMessages";
import { CustomError } from "../types/CustomError";

export async function userAccountAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get user account by id
    const user: UserRequestObject = (req as UserRequest).user;
    if (!user || !user.userID) {
      return next(
        new CustomError(ErrorMessages.USER_NOT_FOUND, StatusCodes.BAD_REQUEST)
      );
    }

    const userAccountID: string = user.userID;
    const userAccount: UserModel | null = await User.findById(userAccountID);
    if (!userAccount) {
      return next(
        new CustomError(ErrorMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND)
      );
    }
    next();
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
}
