import mongoose, { Schema, Model, Document } from "mongoose";
import ListingMessages from "../constants/listingsModelMessages";
import { Categories } from "../constants/listingCategories";

export interface ListingModel extends Document {
  _id: string;
  title: string;
  description: string;
  pictures: string[]; // Changed from picture: string to pictures: string[]
  price: number;
  condition: string;
  category: string;
  status: string;
  sellerID: Schema.Types.ObjectId;
  reportCount: number; // Optional field to track the number of reports
  lastReported: Date;
  flagged: boolean; // Optional field to indicate if the listing is flagged
}

const ListingSchema: Schema<ListingModel> = new Schema<ListingModel>(
  {
    title: {
      type: String,
      required: [true, ListingMessages.MISSING_TITLE],
      trim: true,
      maxlength: [100, ListingMessages.TITLE_TOO_LONG], // Ensure title is not more than 100 characters
    },
    description: {
      type: String,
      required: [true, ListingMessages.MISSING_DESCRIPTION],
      trim: true,
      maxlength: [1000, ListingMessages.DESCRIPTION_TOO_LONG], // Ensure description is not more than 500 characters
    },
    pictures: {
      // Changed from picture to pictures
      type: [String], // Array of strings
      required: [true, ListingMessages.MISSING_PICTURES],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0; // Ensure at least one picture is provided
        },
        message: ListingMessages.INVALID_PICTURES, // Custom error message if validation fails
      },
    },
    price: {
      type: Number,
      required: [true, ListingMessages.MISSING_PRICE],
      min: [0, ListingMessages.INVALID_PRICE], // Ensure price is not negative
    },
    condition: {
      type: String,
      required: [true, ListingMessages.MISSING_CONDITION],
      enum: {
        values: [ListingMessages.NEW, ListingMessages.USED], // Valid conditions
        message: ListingMessages.INVALID_CONDITION, // Custom error message for invalid condition
      },
    },
    status: {
      type: String,
      required: [true, ListingMessages.MISSING_STATUS],
      enum: {
        values: [ListingMessages.AVAILABLE, ListingMessages.UNAVAILABLE],
        message: ListingMessages.INVALID_STATUS, // Custom error message for invalid status
      },
      default: ListingMessages.AVAILABLE, // Default status to available
    },
    category: {
      type: String,
      required: [true, ListingMessages.MISSING_CATEGORY],
      enum: {
        values: Object.values(Categories),
        message: ListingMessages.INVALID_CATEGORY, // Custom error message for invalid category
      },
    },
    sellerID: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming the seller is referenced from a User model
      required: [true, ListingMessages.PROVIDE_SELLER_ID], // Ensure sellerID is provided
    },
    reportCount: {
      type: Number,
      default: 0, // Default report count to 0
    },
    lastReported: {
      type: Date,
    },
    flagged: {
      type: Boolean,
      default: false, // Default flagged status to false
    },
  },
  { timestamps: true }
);

const Listing: Model<ListingModel> = mongoose.model<ListingModel>(
  "Listing",
  ListingSchema
);
export default Listing;
