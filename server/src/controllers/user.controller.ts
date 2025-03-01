// CONTROLLER
import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { UserRequestObject } from "../types/UserRequest";
import { requestAuth } from "../utils/requestAuth";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";

// get user account data
export async function getUserAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get user account by id
    const userAccountID: string = requestAuth(req, next);
    const userAccount: UserModel | null = await User.findById(userAccountID);
    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_ACCOUNT_FETCHED,
      StatusCodes.OK,
      userAccount
    );
  } catch (error: unknown) {
    // handle error
    next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// update user account data
export async function updateUserAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get user account by id
    const userAccountID: string = requestAuth(req, next);

    // update user account
    const updatedUserAccount: UserModel | null = await User.findByIdAndUpdate(
      userAccountID,
      req.body as UserRequestObject,
      { new: true }
    );
    if (!updatedUserAccount) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_ACCOUNT_UPDATED,
      StatusCodes.OK,
      updatedUserAccount
    );
  } catch (error: unknown) {
    // handle error
    next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

// delete user account data
export async function deleteUserAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get user account by id
    const userAccountID: string = requestAuth(req, next);
    // delete user account
    const deletedUserAccount: UserModel | null = await User.findByIdAndDelete(
      userAccountID
    );
    if (!deletedUserAccount) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_ACCOUNT_DELETED,
      StatusCodes.OK,
      deletedUserAccount
    );
  } catch (error: unknown) {
    // handle error
    next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}
