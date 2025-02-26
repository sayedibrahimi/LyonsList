import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.model";
import RequestObject from "../types/RequestObject";
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
      .json({ msg: "Authentication invalid" });
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
    const payload = jwt.verify(token, jwtSecret) as RequestObject;
    // attach the user to the job routes
    req.user = {
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };
    console.log(req.user);
    next();
  } catch (error: unknown) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
    return;
  }
};

export default auth;
