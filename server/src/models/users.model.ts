import mongoose, { Schema, Model, Document, Types } from "mongoose";
import {
  createJWTMethod,
  comparePasswordMethod,
  // hashPassword,
} from "../utils/usersUtils";
import ErrorMessages from "../constants/errorMessages";

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
  favorites: Types.ObjectId[];
  verified: boolean;
  // methods
  createJWT(): string;
  // eslint-disable-next-line no-unused-vars
  comparePassword(password: string): Promise<boolean>;
}

// TODO: add if false error fields
const UserSchema: Schema<UserModel> = new Schema<UserModel>(
  {
    firstName: {
      type: String,
      required: [true, ErrorMessages.USER_NO_NAME],
      trim: true,
      max_length: [20, ErrorMessages.USER_CHAR_LIMIT],
    },
    lastName: {
      type: String,
      required: [true, ErrorMessages.USER_NO_NAME],
      trim: true,
      max_length: [20, ErrorMessages.USER_CHAR_LIMIT],
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
      default: 0,
    },
    favorites: {
      type: [Types.ObjectId],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Attach pre-save hook for password hashing
// UserSchema.pre("save", hashPassword);

// Attach methods: createJWT and comparePassword
UserSchema.methods.createJWT = createJWTMethod;
UserSchema.methods.comparePassword = comparePasswordMethod;

// export the user model as 'User'
const User: Model<UserModel> = mongoose.model<UserModel>("User", UserSchema);
export default User;
