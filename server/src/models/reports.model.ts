import mongoose, { Schema, Model, Document } from "mongoose";
import { ReportCategory } from "../constants/reportCategories";

export interface ReportModel extends Document {
  _id: string;
  listingId: Schema.Types.ObjectId;
  reporterId: Schema.Types.ObjectId;
  reason: string;
  description?: string;
  status: string;
  adminNotes?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: Schema.Types.ObjectId;
}

const ReportSchema: Schema<ReportModel> = new Schema<ReportModel>({
  listingId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
  reporterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reason: {
    type: String,
    required: true,
    enum: {
      values: Object.values(ReportCategory), // Use values instead of keys
      message: "Invalid report reason",
    },
  },
  description: {
    type: String,
    default: "",
    trim: true,
    maxlength: [500, "Reason too long"],
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "dismissed"],
    default: "pending",
  },
  adminNotes: {
    type: String,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
});

const Report: Model<ReportModel> = mongoose.model<ReportModel>(
  "Report",
  ReportSchema
);
export default Report;
