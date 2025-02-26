// src/utils/errorHandler.ts
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unknown error occurred" });
  }
}
