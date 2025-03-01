import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import User, { UserModel } from "../models/users.model";
import { UserRequest, UserRequestObject } from "../types/UserRequest";
import ErrorMessages from "../config/errorMessages";

export async function userAccountAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get user account by id
    const user: UserRequestObject = (req as UserRequest).user;
    if (!user || !user.userID) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    const userAccountID: string = user.userID;
    const userAccount: UserModel | null = await User.findById(userAccountID);
    if (!userAccount) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    next();
  } catch (error: unknown) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid Error" });
    return;
  }
}
