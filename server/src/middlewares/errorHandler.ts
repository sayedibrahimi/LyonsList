/* eslint-disable @typescript-eslint/no-unused-vars */
// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { sendError } from "../utils/sendResponse";
// import ErrorMessages from "../config/errorMessages";
import { CustomError } from "../errors/CustomError";

export function errorHandlerMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
): void {
  const statusCode: number = err instanceof CustomError ? err.statusCode : 500;
  const message: string = err.message || "Internal Server Error";

  res.setHeader("Content-Type", "application/json");
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
}
