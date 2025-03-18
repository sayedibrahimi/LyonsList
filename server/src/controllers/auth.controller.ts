import { NextFunction, Request, Response } from "express";
import User, { UserModel } from "../models/users.model";
import { LoginRequest } from "../types";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CustomError, UnauthError } from "../errors";
import jwt from "jsonwebtoken";
import {
  // SendOTPResponse,
  RegisterRequestObject,
  UserResponseObject,
  CustomJwtPayload,
} from "../types";
import { BadRequestError, ControllerError } from "../errors";
import ErrorMessages from "../constants/errorMessages";
import SuccessMessages from "../constants/successMessages";
// import { sendOTP } from "./otp.controller";
/**
 * This TypeScript function named `register` is an asynchronous function that handles registration
 * requests by taking in a request, response, and next function as parameters.
 * @param {Request} req - The `req` parameter in the `register` function represents the incoming
 * request object. It contains information about the HTTP request made by the client, such as headers,
 * parameters, body content, and more. This object is typically used to extract data sent by the client
 * to the server.
 * @param {Response} res - The `res` parameter in the `register` function refers to the response object
 * that will be sent back to the client making the request. This object allows you to send data, set
 * headers, and manage the response to the client's request.
 * @param {NextFunction} next - The `next` parameter in the `register` function is a callback function
 * that is used to pass control to the next middleware function in the stack. It is typically called
 * within the current middleware function to hand over control to the next middleware function. This
 * allows for sequential execution of middleware functions in an Express
 */
// export async function register(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     // check if req body is full
//     const { firstName, lastName, email, password } =
//       req.body as RegisterRequestObject;
//     if (!firstName || !lastName || !email || !password) {
//       throw new BadRequestError(ErrorMessages.USER_MISSING_FIELDS);
//     }

//     // if email already exists
//     const existingUser: UserModel | null = await User.findOne({ email });
//     if (existingUser !== null) {
//       throw new CustomError(ErrorMessages.USER_EMAIL_IN_USE);
//     }

//     // else, create user
//     const user: UserModel = await User.create({ ...req.body });
//     //! Validation?
//     const token: string = user.createJWT();

//     const returnObject: UserResponseObject = {
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//     };

//     req.user = {
//       userID: user._id.toString(),
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//     };

//     //TODO fix this
//     const otpSuccess: SendOTPResponse | void = await sendOTP(
//       req,
//       res,
//       next,
//       false
//     );
//     if (!otpSuccess) {
//       throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
//     }
//     sendSuccess(
//       res,
//       SuccessMessages.USER_SUCCESS_CREATED,
//       StatusCodes.CREATED,
//       {
//         message: otpSuccess.message,
//         user: returnObject,
//         token,
//       }
//     );
//     return;
//   } catch (error: unknown) {
//     if (error instanceof CustomError) {
//       return next(error);
//     } else {
//       return next(
//         new InternalServerError(
//           `${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`
//         )
//       );
//     }
//   }
// }

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // check if req body is full
    const { firstName, lastName, password } = req.body as RegisterRequestObject;
    if (!firstName || !lastName || !password) {
      throw new BadRequestError(ErrorMessages.USER_MISSING_FIELDS);
    }

    // get email from token
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthError(ErrorMessages.AUTH_NO_TOKEN);
    }
    const cachedToken: string = authHeader.split(" ")[1];

    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new UnauthError(ErrorMessages.AUTH_INVALID_JWT_SECRET);
    }

    const payload: CustomJwtPayload = jwt.verify(
      cachedToken,
      jwtSecret
    ) as CustomJwtPayload;

    const email: string | undefined = payload.sub;

    if (!email) {
      throw new BadRequestError(ErrorMessages.INVALID_INPUT);
    }

    // if email already exists
    const existingUser: UserModel | null = await User.findOne({ email });
    if (existingUser !== null) {
      throw new CustomError(ErrorMessages.USER_EMAIL_IN_USE);
    }

    // else, create user
    const user: UserModel = await User.create({
      email: email,
      ...req.body,
      verified: true,
    });
    //! Validation?
    const token: string = user.createJWT();

    const returnObject: UserResponseObject = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    req.user = {
      userID: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    // //TODO fix this
    // const otpSuccess: SendOTPResponse | void = await sendOTP(
    //   req,
    //   res,
    //   next,
    //   false
    // );
    // if (!otpSuccess) {
    //   throw new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR);
    // }
    sendSuccess(
      res,
      SuccessMessages.USER_SUCCESS_CREATED,
      StatusCodes.CREATED,
      {
        user: returnObject,
        token,
      }
    );
    return;
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
