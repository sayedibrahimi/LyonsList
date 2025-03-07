import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/CustomJwtPayload";
import { UserRequest } from "../types/UserRequest";
import { InternalServerError, UnauthError, CustomError } from "../errors";
import ErrorMessages from "../config/errorMessages";

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // check header
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthError(ErrorMessages.AUTH_NO_TOKEN);
    }
    const token: string = authHeader.split(" ")[1];

    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new UnauthError(ErrorMessages.AUTH_INVALID_JWT_SECRET);
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
    if (error instanceof CustomError) {
      return next(error);
    } else {
      return next(
        new InternalServerError(
          `${ErrorMessages.INTERNAL_SERVER_ERROR} ${error}`
        )
      );
    }
  }
}
