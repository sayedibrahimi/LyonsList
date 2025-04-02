import { Request, Response, NextFunction } from "express";
// import { sendSuccess } from "../utils/sendResponse";
// import { StatusCodes } from "http-status-codes";
import { ControllerError, InternalServerError } from "../errors";
import { hashData } from "../utils/hashData";
import { MailOptions } from "../types";
import { sendEmailOTP } from "../utils/sendEmail";
import otpCache from "../db/cache";
import ErrorMessages from "../constants/errorMessages";
import { sendSuccess } from "./sendResponse";
// import { sendSuccess } from "./sendResponse";
// import SuccessMessages from "../constants/successMessages"

export async function generateOTP(next: NextFunction): Promise<number> {
  try {
    const otpCode: number = Math.floor(100000 + Math.random() * 900000);
    return otpCode;
  } catch (error: unknown) {
    ControllerError(error, next);
    return 0; // Or throw error instead of returning a default value
  }
}

export async function sendOtp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, subject } = req.body;
    const generatedOTP: number = await generateOTP(next);
    const hashedOTP: string = await hashData(generatedOTP.toString());
    if (!hashedOTP) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
    otpCache.set(`otp:${email}`, hashedOTP, 600);

    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.EMAIL_NOT_FOUND);
    }

    const mailOptions: MailOptions<string> = {
      from: emailSender,
      to: email,
      subject: subject,
      data: generatedOTP.toString(),
    };
    await sendEmailOTP(mailOptions, next);
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function resendOtp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (otpCache.get(`otp:${email}`)) {
      otpCache.del(`otp:${email}`);
    }
    req.body = { email, subject: "Resent OTP" };
    await sendOtp(req, res, next);
    sendSuccess(res, "OTP resent successfully", 200, {
      email,
      message: "OTP resent successfully",
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
