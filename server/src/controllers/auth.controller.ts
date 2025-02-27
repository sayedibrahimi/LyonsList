import { Request, Response } from "express";
import User from "../models/users.model";
import { sendSuccess, sendError } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";

// register function
// input param: req body: first, last, email, password
export async function register(req: Request, res: Response): Promise<void> {
  try {
    // check if req body is full
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      sendError(
        res,
        ErrorMessages.USER_MISSING_FIELDS,
        StatusCodes.BAD_REQUEST
      );
      return;
    }

    // if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, ErrorMessages.USER_EMAIL_IN_USE, StatusCodes.BAD_REQUEST);
      return;
    }

    // else, create user
    const user = await User.create({ ...req.body });
    const token = user.createJWT();

    const returnObject = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_CREATED,
      StatusCodes.CREATED,
      {
        user: returnObject,
        token,
      }
    );
    return;
  } catch (error) {
    sendError(
      res,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
    return;
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // check if req body is full
  if (!email || !password) {
    sendError(
      res,
      ErrorMessages.AUTH_INVALID_CREDENTIALS,
      StatusCodes.BAD_REQUEST
    );
    return;
  }

  // check for the user from dB by email
  const user = await User.findOne({ email });
  // user is not providing valid credentials but user exists
  if (!user) {
    sendError(res, ErrorMessages.AUTH_NO_EMAIL_MATCH, StatusCodes.BAD_REQUEST);
    return;
  }

  // check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    sendError(
      res,
      ErrorMessages.AUTH_NO_PASSWORD_MATCH,
      StatusCodes.BAD_REQUEST
    );
    return;
  }

  // If user exists with valid credentials
  const token = user.createJWT();
  const returnObject = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  sendSuccess(res, SuccessMessages.USER_SUCCESS_LOGIN, StatusCodes.OK, {
    user: returnObject,
    token,
  });
}
