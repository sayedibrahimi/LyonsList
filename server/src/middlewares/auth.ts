import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRequest } from "../types/UserRequest";
import { StatusCodes } from "http-status-codes";

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid Bearer" });
    return;
  }
  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error: JWT_SECRET is not defined",
      });
      return;
    }
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    (req as UserRequest).user = {
      userID: payload.userData.userID,
      firstName: payload.userData.firstName,
      lastName: payload.userData.lastName,
      email: payload.userData.email,
    };

    next();
  } catch (error: unknown) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid Error" });
    return;
  }
};

export default auth;
