// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";

interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error setup
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ErrorMessages.INTERNAL_SERVER_ERROR;

  console.error(err); // Log the error for debugging

  // Send standardized error response
  sendError(res, message, statusCode, err.errors || err);
};
