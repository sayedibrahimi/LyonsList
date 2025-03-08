import bcrypt from "bcryptjs";
import { Document } from "mongoose";

export async function hashPassword(
  this: Document & { password: string }
): Promise<void> {
  if (!this.isModified("password")) return;
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}
