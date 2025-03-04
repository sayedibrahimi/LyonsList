import mongoose from "mongoose";

export async function connectDB(uri: string): Promise<mongoose.Mongoose> {
  return mongoose.connect(uri);
}
