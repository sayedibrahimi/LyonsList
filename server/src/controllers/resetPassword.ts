import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { hashData } from "../utils/hashData";
import { InternalServerError } from "../errors";
// import jwt from "jsonwebtoken";
import { ResetPasswordRequestObject } from "../types";
import { BadRequestError, ControllerError } from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import { generateOTP } from "../utils/generateOTP";
import { MailOptions } from "../types";
import sendOTPemail from "../utils/sendOTPemail";
import otpCache from "../db/cache";

export async function resetPasswordRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password1, password2 } =
      req.body as ResetPasswordRequestObject;
    if (!email || !password1 || !password2) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_FIELDS);
    }
    // check if passwords match
    if (password1 !== password2) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_MATCH);
    }
    // if email already exists
    const existingUser: UserModel | null = await User.findOne({ email });
    if (existingUser === null) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }
    // if cache in use by user already
    if (otpCache.get(`user:${email}`)) {
      throw new BadRequestError(ErrorMessages.USER_EMAIL_IN_USE);
    }

    const hashed1: string = await hashData(password1);
    const hashed2: string = await hashData(password2);
    if (!hashed1 || !hashed2) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    }

    const userData: ResetPasswordRequestObject = {
      email,
      password1: hashed1,
      password2: hashed2,
    };
    // cache data using reset password
    otpCache.set(`user:${email}`, userData);
    // generate OTP
    const generatedOTP: number = await generateOTP(next);
    otpCache.set(`otp:${email}`, generatedOTP.toString(), 300);

    // send OTP email
    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
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
    sendSuccess(res, SuccessMessages.OTP_CREATED, StatusCodes.CREATED, {
      user: userData.email,
      message: "OTP sent successfully",
    });
    //! TODO return;
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function verifyReset(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new BadRequestError(ErrorMessages.INVALID_INPUT);
    }

    const foundUser: UserModel | null = await User.findOne({ email });
    if (!foundUser) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    // check if OTP is valid
    const cachedOTP: string | undefined = otpCache.get(`otp:${email}`);
    console.log(`cachedOTP: ${cachedOTP}, otp: ${otp}`);
    if (!cachedOTP || cachedOTP !== otp.toString()) {
      throw new BadRequestError(ErrorMessages.OTP_INVALID);
    }

    // update user password
    const userData: ResetPasswordRequestObject | undefined = otpCache.get(
      `user:${email}`
    );
    if (!userData) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_USER);
    }
    // update the users password
    foundUser.password = userData.password1;
    await foundUser.save();

    otpCache.del(`otp:${email}`);
    otpCache.del(`user:${email}`);

    sendSuccess(res, SuccessMessages.OTP_VERIFIED, StatusCodes.OK, {
      user: foundUser.email,
      message: "OTP verified successfully",
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
