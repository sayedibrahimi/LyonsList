// src/utils/errorHandler.ts
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function handleError(
  res: Response,
  error: unknown,
  status: StatusCodes
): void {
  if (error instanceof Error) {
    res.status(status).json({ msg: error.message });
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unknown error occurred" });
  }
}
