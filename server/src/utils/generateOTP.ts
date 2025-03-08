import { InternalServerError } from "../errors";
import ErrorMessages from "../config/errorMessages";
import { NextFunction } from "express";

export async function generateOTP(next: NextFunction): Promise<number> {
  try {
    const otpCode: number = Math.floor(100000 + Math.random() * 900000);
    return otpCode;
  } catch (error: unknown) {
    next(
      new InternalServerError(`${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`)
    );
    // Return a default OTP or re-throw to handle at a higher level
    return 0; // Or throw error instead of returning a default value
  }
}
