// src/utils/errorHandler.ts
import { Response } from "express";

export function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ msg: error.message });
  } else {
    res.status(500).json({ msg: "An unknown error occurred" });
  }
}
