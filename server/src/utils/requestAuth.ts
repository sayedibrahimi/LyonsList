// src/utils/authUtils.ts
import { Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ErrorMessages from "../config/errorMessages";

/**
 * Gets the authenticated user ID from request or returns an error through next()
 * @param req Express request object
 * @param next Express next function
 * @returns User ID if authenticated, or calls next() with error
 */
export function getUserId(
  req: Request,
  next: NextFunction
): string | undefined {
  if (!req.user) {
    next({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: ErrorMessages.AUTH_NO_TOKEN,
    });
    return undefined;
  }
  return req.user.userID;
}

/**
 * Gets the authenticated user ID from request with error handling wrapper
 * Returns the user ID directly and handles error using next()
 * Use this in controllers to avoid repetitive checks
 */
export function requestAuth(req: Request, next: NextFunction): string | never {
  const userId: string | undefined = getUserId(req, next);

  if (!userId) {
    // This prevents TypeScript from thinking execution continues
    throw new Error(ErrorMessages.AUTH_CHECK_FAILED);
  }

  return userId;
}
