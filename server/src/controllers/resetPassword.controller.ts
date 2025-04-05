import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { hashData, verifyHashedData } from "../utils/hashData";
import { InternalServerError } from "../errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ResetPasswordRequestObject } from "../types";
import { BadRequestError, ControllerError, UnauthError } from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
import { sendOtp, resendOtp } from "../utils/generateOTP";
import otpCache from "../db/cache";

export async function resetPasswordRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_FIELDS);
    }
    // if email already exists
    const existingUser: UserModel | null = await User.findOne({ email });
    if (existingUser === null) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }
    // if cache in use by user already
    if (otpCache.get(`user:${email}`)) {
      // clear otp from cache
      otpCache.del(`otp:${email}`);
      // resend otp
      req.body = { email };
      await resendOtp(req, res, next);
      return;
    }

    req.body = { email, subject: "OTP for password reset" };
    await sendOtp(req, res, next);

    sendSuccess(res, SuccessMessages.OTP_CREATED, StatusCodes.CREATED, {
      user: email,
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

    // create temporary jwt token
    if (!process.env.JWT_SECRET) {
      throw new InternalServerError(
        "JWT_SECRET is not defined in environment variables"
      );
    }
    const token: string = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    sendSuccess(res, SuccessMessages.OTP_VERIFIED, StatusCodes.OK, {
      user: foundUser.email,
      token,
      message: "OTP verified successfully, JWT token created",
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthError(ErrorMessages.AUTH_NO_TOKEN);
    }
    const decoded: string | JwtPayload = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET || ""
    );
    if (!decoded) {
      throw new BadRequestError(ErrorMessages.INVALID_TOKEN);
    }
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

    const hashed: string = await hashData(password1);

    // update the users password
    existingUser.password = hashed;
    await existingUser.save();

    otpCache.del(`otp:${email}`);
    otpCache.del(`user:${email}`);

    sendSuccess(res, SuccessMessages.PASSWORD_RESET_SUCCESS, StatusCodes.OK, {
      user: existingUser.email,
      message: "Password reset successfully",
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

// export async function resetPasswordRequest(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const { email, password1, password2 } =
//       req.body as ResetPasswordRequestObject;
//     if (!email || !password1 || !password2) {
//       throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_FIELDS);
//     }
//     // check if passwords match
//     if (password1 !== password2) {
//       throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_MATCH);
//     }
//     // if email already exists
//     const existingUser: UserModel | null = await User.findOne({ email });
//     if (existingUser === null) {
//       throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
//     }
//     // if cache in use by user already
//     if (otpCache.get(`user:${email}`)) {
//       throw new BadRequestError(ErrorMessages.USER_EMAIL_IN_USE);
//     }

//     const hashed1: string = await hashData(password1);
//     const hashed2: string = await hashData(password2);
//     if (!hashed1 || !hashed2) {
//       throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
//     }

//     const userData: ResetPasswordRequestObject = {
//       email,
//       password1: hashed1,
//       password2: hashed2,
//     };
//     // cache data using reset password
//     otpCache.set(`user:${email}`, userData);
//     req.body = { email, subject: "OTP for password reset" };
//     await sendOtp(req, res, next);

//     sendSuccess(res, SuccessMessages.OTP_CREATED, StatusCodes.CREATED, {
//       user: userData.email,
//       message: "OTP sent successfully",
//     });
//   } catch (error: unknown) {
//     ControllerError(error, next);
//   }
// }

// export async function verifyReset(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       throw new BadRequestError(ErrorMessages.INVALID_INPUT);
//     }

//     const foundUser: UserModel | null = await User.findOne({ email });
//     if (!foundUser) {
//       throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
//     }

//     // check if OTP is valid
//     const cachedOTP: string | undefined = otpCache.get(`otp:${email}`);

//     if (!cachedOTP || cachedOTP === undefined) {
//       throw new BadRequestError(ErrorMessages.OTP_NOT_FOUND);
//     }
//     const isValid: boolean = await verifyHashedData(otp.toString(), cachedOTP);
//     if (!isValid) {
//       throw new BadRequestError(ErrorMessages.OTP_INVALID);
//     }
//     // update user password
//     const userData: ResetPasswordRequestObject | undefined = otpCache.get(
//       `user:${email}`
//     );
//     if (!userData) {
//       throw new BadRequestError(ErrorMessages.PASSWORD_RESET_NO_USER);
//     }
//     // update the users password
//     foundUser.password = userData.password1;
//     await foundUser.save();

//     otpCache.del(`otp:${email}`);
//     otpCache.del(`user:${email}`);

//     sendSuccess(res, SuccessMessages.OTP_VERIFIED, StatusCodes.OK, {
//       user: foundUser.email,
//       message: "OTP verified successfully",
//     });
//   } catch (error: unknown) {
//     ControllerError(error, next);
//   }
// }
