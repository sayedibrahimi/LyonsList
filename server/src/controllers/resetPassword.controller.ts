import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { hashData, verifyHashedData } from "../utils/hashData";
import { InternalServerError } from "../errors";
// import jwt from "jsonwebtoken";
import { ResetPasswordRequestObject } from "../types";
import { BadRequestError, ControllerError } from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import { generateOTP } from "../utils/generateOTP";
import { MailOptions } from "../types";
import { sendEmailOTP } from "../utils/sendEmail";
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
    const hashedOTP: string = await hashData(generatedOTP.toString());

    if (!hashedOTP) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    }

    otpCache.set(`otp:${email}`, hashedOTP, 600);

    // send OTP email
    const emailSender: string | undefined = process.env.EMAIL;
    if (!emailSender) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    }

    const mailOptions: MailOptions<string> = {
      from: emailSender,
      to: email,
      subject: "OTP for password reset",
      data: generatedOTP.toString(),
    };
    await sendEmailOTP(mailOptions, next);
    sendSuccess(res, SuccessMessages.OTP_CREATED, StatusCodes.CREATED, {
      user: userData.email,
      message: "OTP sent successfully",
    });
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

    if (!cachedOTP || cachedOTP === undefined) {
      throw new BadRequestError(ErrorMessages.OTP_NOT_FOUND);
    }
    const isValid: boolean = await verifyHashedData(otp.toString(), cachedOTP);
    if (!isValid) {
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
