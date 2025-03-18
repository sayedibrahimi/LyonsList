import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/users.model";
import { UserRequestObject } from "../types/UserRequest";
import { CustomClaims } from "../types";
import { CustomError } from "../errors/CustomError";
import { Document } from "mongoose";

export function createJWTMethod(this: UserModel): string {
  const jwtSecret: string | undefined = process.env.JWT_SECRET || "";
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const currentTime: number = Math.floor(Date.now() / 1000);
  const expirationTime: number =
    currentTime + parseInt(process.env.JWT_LIFETIME_HOURS || "24") * 3600;

  const userData: UserRequestObject = {
    userID: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
  };

  const claims: CustomClaims = {
    sub: this._id.toString(),
    iat: currentTime,
    exp: expirationTime,
    userData: userData,
  };

  return jwt.sign(claims, jwtSecret, { algorithm: "HS256" });
}

export async function comparePasswordMethod(
  user: UserModel,
  candidatePassword: string
): Promise<boolean> {
  // Include the password field (even if it's set to select: false)
  const userAccount: UserModel | null = await user
    .model("User")
    .findById(user._id)
    .select("+password");
  if (!userAccount) {
    throw new CustomError("User not found during password comparison.", 404);
  }
  return bcrypt.compare(candidatePassword, userAccount.password);
}

export async function hashPassword(
  this: Document & { password: string }
): Promise<void> {
  if (!this.isModified("password")) return;
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}
