// src/middlewares/errorHandler.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import { CustomError } from "../types/CustomError";

export function errorHandlerMiddleware(
  err: CustomError,
  req: Request,
  res: Response
): void {
  // Default error setup
  const statusCode: number =
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const message: string = err.message || ErrorMessages.INTERNAL_SERVER_ERROR;

  // console.log(err);
  // console.error("Error: 3", err);
  // if (err.stack) {
  //   console.error(err.stack);
  // }

  // Send standardized error response
  sendError(res, statusCode, err.errors || { message });
  // res.status(statusCode).json({
  //   success: false,
  //   message: err.message,
  //   errors: err.errors || err,
  // });
}
