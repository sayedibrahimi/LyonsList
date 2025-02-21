import { Schema, model, Document } from "mongoose";

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
}

const UserSchema = new Schema<UserModel>(
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
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    classYear: {
        type: Number,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    totalListings: {
        type: Number,
    }
  },
  { timestamps: true }
);

// export the user model as 'User'
const User = model<UserModel>("User", UserSchema);
export default User;
