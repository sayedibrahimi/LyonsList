import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { LoginRequest } from "../types";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { hashData, verifyHashedData } from "../utils/hashData";
import {
  // SendOTPResponse,
  RegisterRequestObject,
  UserResponseObject,
  // CustomJwtPayload,
} from "../types";
import {
  BadRequestError,
  ControllerError,
  InternalServerError,
} from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import { generateOTP } from "../utils/generateOTP";
import { MailOptions } from "../types";
import sendOTPemail from "../utils/sendOTPemail";
import otpCache from "../db/cache";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // check if req body is full
    const { firstName, lastName, email, password } =
      req.body as RegisterRequestObject;
    if (!email || !firstName || !lastName || !password) {
      throw new BadRequestError(ErrorMessages.USER_MISSING_FIELDS);
    }

    // if email already exists
    const existingUser: UserModel | null = await User.findOne({ email });
    if (existingUser !== null) {
      throw new BadRequestError(ErrorMessages.USER_EMAIL_IN_USE);
    }
    if (otpCache.get(`user:${email}`)) {
      throw new BadRequestError(ErrorMessages.USER_EMAIL_IN_USE);
    }

    const hashedPassword: string = await hashData(password);
    if (!hashedPassword) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    }

    // cache data using regis
    const userData: RegisterRequestObject = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      // password,
    };
    otpCache.set(`user:${email}`, userData);

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
    return;
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function verifyRegistration(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // check if req body is full
    const { email, otp } = req.body as { email: string; otp: string };
    if (!email || !otp) {
      throw new BadRequestError(ErrorMessages.INVALID_INPUT);
    }

    const storedOTP: string | undefined = otpCache.get(`otp:${email}`);
    if (!storedOTP || storedOTP === undefined) {
      throw new BadRequestError(ErrorMessages.INVALID_OTP);
    }

    const isValid: boolean = await verifyHashedData(otp.toString(), storedOTP);
    if (!isValid) {
      throw new BadRequestError(ErrorMessages.OTP_INVALID);
    }

    const userData: RegisterRequestObject | undefined = otpCache.get(
      `user:${email}`
    );
    if (!userData || userData === undefined) {
      throw new BadRequestError(ErrorMessages.OTP_NOT_FOUND);
    }
    const user: UserModel = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      verified: true,
    });
    if (!user) {
      throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    }

    otpCache.del(`otp:${email}`);
    otpCache.del(`user:${email}`);

    const userResponse: UserResponseObject = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    sendSuccess(res, SuccessMessages.OTP_VERIFIED, StatusCodes.OK, {
      user: userResponse,
      token: user.createJWT(),
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

/**
 * This TypeScript function is an asynchronous login function that takes in a request, response, and
 * next function as parameters.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `login` function represents the response object
 * in Express.js. It is used to send a response back to the client making the request. You can use
 * methods like `res.send()`, `res.json()`, `res.status()`, etc., to send the response
 * @param {NextFunction} next - The `next` parameter in the `login` function is a callback function
 * that is used to pass control to the next middleware function in the stack. It is typically called
 * within the `login` function to hand over control to the next middleware or route handler. This
 * allows for the sequential execution of middleware
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as LoginRequest;

    // check if req body is full
    if (!email || !password) {
      throw new BadRequestError(ErrorMessages.AUTH_INVALID_CREDENTIALS);
    }

    // check for the user from dB by email
    const user: UserModel | null = await User.findOne({ email });
    // user is not providing valid credentials but user exists
    if (!user) {
      throw new BadRequestError(ErrorMessages.AUTH_NO_EMAIL_MATCH);
    }

    /* The line `const isMatch = await user.comparePassword(password);` is checking whether the provided
 `password` matches the password stored for the user in the database. */
    const isMatch: boolean = await user.comparePassword(password);
    if (!isMatch) {
      throw new BadRequestError(ErrorMessages.AUTH_NO_PASSWORD_MATCH);
    }

    if (user.verified === false) {
      throw new BadRequestError(ErrorMessages.AUTH_NOT_VERIFIED);
    }

    // If user exists with valid credentials
    const token: string = user.createJWT();
    const returnObject: UserResponseObject = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    sendSuccess(res, SuccessMessages.USER_SUCCESS_LOGIN, StatusCodes.OK, {
      user: returnObject,
      token,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

// export async function logout(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     // clear the cookie
//     res.clearCookie("token");
//     sendSuccess(res, SuccessMessages.USER_SUCCESS_LOGOUT, StatusCodes.OK);
//   } catch (error: unknown) {
//     ControllerError(error, next);
//   }
// }
