import { ControllerError } from "../errors";
import { NextFunction } from "express";

export async function generateOTP(next: NextFunction): Promise<number> {
  try {
    const otpCode: number = Math.floor(100000 + Math.random() * 900000);
    return otpCode;
  } catch (error: unknown) {
    ControllerError(error, next);
    return 0; // Or throw error instead of returning a default value
  }
}
