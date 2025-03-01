import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/CustomJwtPayload";
import { UserRequest } from "../types/UserRequest";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../types/CustomError";
import ErrorMessages from "../config/errorMessages";

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // check header
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(
      new CustomError(
        ErrorMessages.AUTH_INVALID_TOKEN,
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  const token: string = authHeader.split(" ")[1];

  try {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(
        new CustomError(
          ErrorMessages.AUTH_INVALID_JWT_SECRET,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }

    const payload: CustomJwtPayload = jwt.verify(
      token,
      jwtSecret
    ) as CustomJwtPayload;

    (req as UserRequest).user = {
      userID: payload.userData.userID,
      firstName: payload.userData.firstName,
      lastName: payload.userData.lastName,
      email: payload.userData.email,
    };

    next();
  } catch (error: unknown) {
    return next(
      new CustomError(
        ErrorMessages.AUTH_CHECK_FAILED,
        StatusCodes.UNAUTHORIZED,
        error
      )
    );
  }
}

export default auth;
