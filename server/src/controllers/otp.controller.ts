import { NextFunction, Request, Response } from "express";
import OTP, { OTPModel } from "../models/otp.model";
// import User, { UserModel } from "../models/users.model";
import { generateOTP } from "../utils/generateOTP";
import sendOTPemail from "../utils/sendOTPemail";
import { hashData, verifyHashedData } from "../models/otpUtils/hashData";
// import { updateUserAccount } from "./user.controller";
import { MailOptions, SendOTPResponse } from "../types";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/sendResponse";
import ErrorMessages from "../config/errorMessages";
import SuccessMessages from "../config/successMessages";
import {
  BadRequestError,
  InternalServerError,
  ControllerError,
  // NotFoundError,
} from "../errors";
import { createJWT } from "../models/otpUtils/createJWT";
// import { requestAuth } from "../utils/requestAuth";

export async function sendOTP(
  req: Request,
  res: Response,
  next: NextFunction,
  shouldSendResponse: boolean = true
): Promise<void | SendOTPResponse> {
  try {
    const email: string = req.body.email;

    if (!email) {
      throw new BadRequestError(ErrorMessages.INVALID_INPUT);
    }

    // delete any past OTP
    await OTP.deleteOne({ email });

    const generatedOTP: number = await generateOTP(next);

    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.EMAIL_NOT_FOUND);
    }
    const mailOptions: MailOptions = {
      from: emailSender,
      to: email,
      subject: "OTP for password reset",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4285f4; margin: 20px 0;">
        ${generatedOTP}
        </div>
        <p style="font-size: 14px; color: #777;">This OTP will expire in 10 minutes.</p>
      </div>
      `,
    };
    await sendOTPemail(mailOptions);

    const hashedOTP: string = await hashData(generatedOTP.toString());
    const newOTP: OTPModel = new OTP({
      email: email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000, // 10 minutes
    });

    await newOTP.save();
    if (shouldSendResponse) {
      sendSuccess(res, SuccessMessages.OTP_CREATED, StatusCodes.CREATED, {
        message: "OTP sent successfully",
        email: email,
        expiresAt: Date.now() + 600000,
      });
    } else {
      const otpResponse: SendOTPResponse = {
        message: "OTP sent successfully",
        expiresAt: Date.now() + 600000,
      };
      return otpResponse;
    }
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export function sendOTPHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  return sendOTP(req, res, next, true) as Promise<void>;
}

// TODO: Cache the email
export async function verifyOTP(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const email: string = req.body.email;
    if (!email) {
      throw new BadRequestError(ErrorMessages.INVALID_INPUT);
    }

    const otp: string = req.body.otp.toString();
    if (!otp) {
      throw new BadRequestError(ErrorMessages.INVALID_INPUT);
    }

    const foundOTP: OTPModel | null = await OTP.findOne({ email });
    if (!foundOTP) {
      throw new BadRequestError(ErrorMessages.OTP_NOT_FOUND);
    }

    if (foundOTP.expiresAt.getTime() < Date.now()) {
      await foundOTP.deleteOne();
      throw new BadRequestError(ErrorMessages.OTP_EXPIRED);
    }

    const isMatch: boolean = await verifyHashedData(otp, foundOTP.otp);
    if (!isMatch) {
      throw new BadRequestError(ErrorMessages.OTP_INVALID);
    }

    const token: string = createJWT(email);

    await foundOTP.deleteOne();
    sendSuccess(res, SuccessMessages.OTP_VERIFIED, StatusCodes.OK, {
      message: "OTP verified successfully",
      token: token,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
