import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.model";

interface JwtPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    // attach the user to the job routes
    req.user = {
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };
    next();
  } catch (error) {
    throw new Error("Authentication invalid");
  }
};

export default auth;
