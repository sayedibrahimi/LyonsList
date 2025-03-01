import mongoose, { Schema, Model, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRequestObject } from "../types/UserRequest";
import { CustomClaims } from "../types/JwtSignClaims";

// get an interface object to refer to types in the schema
export interface UserModel extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classYear: number;
  profilePicture: string;
  totalListings: number;
  // methods
  createJWT(): string;
  comparePassword(password: string): Promise<boolean>;
}

// TODO: add if false error fields
const UserSchema: Schema<UserModel> = new Schema<UserModel>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [20, "Name cannot be more than 20 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [20, "Name cannot be more than 20 characters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    classYear: {
      type: Number,
      required: false,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    totalListings: {
      type: Number,
    },
  },
  { timestamps: true }
);

// user methods
UserSchema.pre("save", async function () {
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (): string {
  const jwtSecret: string | undefined = process.env.JWT_SECRET || "";
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const current_time: number = Math.floor(Date.now() / 1000);
  // : check this math
  const expiration_time: number =
    current_time + parseInt(process.env.JWT_LIFETIME_HOURS || "0") * 3600;

  const userData: UserRequestObject = {
    userID: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
  };

  const claims: CustomClaims = {
    sub: this._id.toString(),
    iat: current_time,
    exp: expiration_time,
    userData: userData,
  };

  return jwt.sign(claims, jwtSecret, { algorithm: "HS256" });
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user: UserModel = await this.model("User")
    .findById(this._id)
    .select("+password");
  const isMatch: boolean = await bcrypt.compare(
    candidatePassword,
    user.password
  );
  // const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// export the user model as 'User'
const User: Model<UserModel> = mongoose.model<UserModel>("User", UserSchema);
export default User;
