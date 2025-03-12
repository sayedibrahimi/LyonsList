import jwt from "jsonwebtoken";
import { JWTClaim } from "../../types";

export function createJWT(email: string): string {
  const jwtSecret: string | undefined = process.env.JWT_SECRET || "";
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const currentTime: number = Math.floor(Date.now() / 1000);
  const expirationTime: number =
    currentTime + parseInt(process.env.JWT_LIFETIME_HOURS || "24") * 3600;

  const claims: JWTClaim = {
    sub: email,
    iat: currentTime,
    exp: expirationTime,
  };

  return jwt.sign(claims, jwtSecret, { algorithm: "HS256" });
}
