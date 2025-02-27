// CONTROLLER
import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";

// TODO: Response body
/*
success,
auth token,
user data {
  id  
  first
  last
}
*/
//! handled by auth signup?
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // create a new user with the schema constructor
    const newUser: UserModel = await User.create(req.body);
    if (!newUser) {
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.USER_CREATION_FAILED,
      });
    }
    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_CREATED,
      StatusCodes.CREATED,
      newUser
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

/**
 * This function is an asynchronous function in TypeScript that retrieves all users.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `getAllUsers` function refers to the response
 * object in Express.js. This object represents the HTTP response that an Express app sends when it
 * receives an HTTP request. It is used to send data back to the client, set headers, status codes, and
 * more.
 * @param {NextFunction} next - The `next` parameter in the function signature refers to a callback
 * function that is used to pass control to the next middleware function in the stack. It is typically
 * used in Express.js middleware functions to trigger the next middleware in the chain.
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // get all the users async, usermodel array or null
    const allUsers: UserModel[] | null = await User.find({});
    if (allUsers === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NO_USERS_CREATED,
      });
    }

    sendSuccess(res, SuccessMessages.USERS_SUCCESS_FETCHED, StatusCodes.OK, {
      users: allUsers,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

/**
 * This function is an asynchronous function in TypeScript that retrieves a user by their ID.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `getUserById` function refers to the response
 * object in Express.js. This object represents the HTTP response that an Express app sends when it
 * receives an HTTP request. It is used to send data back to the client, such as JSON data, HTML
 * content, or status
 * @param {NextFunction} next - The `next` parameter in the function signature refers to a callback
 * function that is used to pass control to the next middleware function in the stack. It is typically
 * used in Express.js middleware functions to pass control to the next middleware or route handler.
 */
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // find a user by id, if they don't exist, catch the null
    const foundUser: UserModel | null = await User.findById(req.params.id);
    if (foundUser === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND_BY_ID,
      });
    }

    sendSuccess(res, SuccessMessages.USER_SUCCESS_FETCHED, StatusCodes.OK, {
      user: foundUser,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

/**
 * This function is an asynchronous function in TypeScript that updates a user.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `updateUser` function refers to the response
 * object in Express.js. This object represents the HTTP response that an Express app sends when it
 * receives an HTTP request. It is used to send data back to the client, such as JSON data, HTML
 * content, or status
 * @param {NextFunction} next - The `next` parameter in the `updateUser` function is a callback
 * function that is used to pass control to the next middleware function in the stack. It is typically
 * called when an error occurs or when the current middleware function has completed its task and wants
 * to pass control to the next function.
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const foundUser: UserModel | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (foundUser === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    sendSuccess(res, SuccessMessages.USER_SUCCESS_UPDATED, StatusCodes.OK, {
      user: foundUser,
    });
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}

/**
 * This function is an asynchronous function in TypeScript that handles deleting a user.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `deleteUser` function refers to the response
 * object in Express.js. This object represents the HTTP response that an Express app sends when it
 * receives an HTTP request. It is used to send data back to the client, such as JSON data, HTML
 * content, or status
 * @param {NextFunction} next - The `next` parameter in the `deleteUser` function is a function that is
 * used to pass control to the next middleware function in the stack. It is typically called within the
 * function to trigger the next middleware in the chain. This allows for the sequential execution of
 * middleware functions in an Express application.
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const foundUser: UserModel | null = await User.findByIdAndDelete(
      req.params.id
    );

    if (foundUser === null) {
      return next({
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_DELETED,
      StatusCodes.OK,
      null
    );
  } catch (error: unknown) {
    return next({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
}
