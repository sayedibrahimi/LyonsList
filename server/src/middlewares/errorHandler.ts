// src/middlewares/errorHandler.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/sendResponse";

interface CustomError extends Error {
  statusCode?: number;
  errors?: unknown;
}

export function errorHandlerMiddleware(
  err: CustomError,
  req: Request,
  res: Response
): void {
  // Default error setup
  const statusCode: number =
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Send standardized error response
  sendError(res, statusCode, err.errors || err);
}
