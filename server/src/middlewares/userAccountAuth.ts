import { Request, Response, NextFunction } from "express";
import User, { UserModel } from "../models/users.model";
import { UserRequest, UserRequestObject } from "../types/UserRequest";
import ErrorMessages from "../config/errorMessages";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  CustomError,
} from "../errors";

export async function userAccountAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get user account by id
    const user: UserRequestObject = (req as UserRequest).user;
    if (!user || !user.userID) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    const userAccountID: string = user.userID;
    const userAccount: UserModel | null = await User.findById(userAccountID);
    if (!userAccount) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }
    next();
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
