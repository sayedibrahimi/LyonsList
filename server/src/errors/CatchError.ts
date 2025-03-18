import { NextFunction } from "express";
import { CustomError, InternalServerError } from "../errors";
import ErrorMessages from "../constants/errorMessages";

/**
 * Handles controller errors uniformly across the application
 * @param error The caught error
 * @param next Express next function
 * @returns void
 */
export function ControllerError(error: unknown, next: NextFunction): void {
  if (error instanceof CustomError) {
    next(error);
  } else {
    next(
      new InternalServerError(`${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`)
    );
  }
}
