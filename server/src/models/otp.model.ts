import mongoose, { Schema, Model, Document } from "mongoose";

// get an interface object to refer to types in the schema
export interface OTPModel extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const OTPSchema: Schema<OTPModel> = new Schema<OTPModel>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// export the user model as 'User'
const OTP: Model<OTPModel> = mongoose.model<OTPModel>("OTP", OTPSchema);
export default OTP;
