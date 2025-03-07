import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "./users.model";
import { UserRequestObject } from "../types/UserRequest";
import { CustomClaims } from "../types/JwtSignClaims";
import { CustomError } from "../errors/CustomError";

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
  this: UserModel,
  candidatePassword: string
): Promise<boolean> {
  // Include the password field (even if it's set to select: false)
  const user: UserModel | null = await this.model("User")
    .findById(this._id)
    .select("+password");
  if (!user) {
    throw new CustomError("User not found during password comparison.", 404);
  }
  return bcrypt.compare(candidatePassword, user.password);
}
