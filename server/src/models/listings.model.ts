import mongoose, { Schema, Model, Document } from "mongoose";
import ListingMessages from "../constants/listingsModelMessages";

export interface ListingModel extends Document {
  _id: string;
  title: string;
  description: string;
  pictures: string[]; // Changed from picture: string to pictures: string[]
  price: number;
  condition: string;
  status: string;
  sellerID: Schema.Types.ObjectId;
  // TODO: add some sort of tags or category here?
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
      maxlength: [500, ListingMessages.DESCRIPTION_TOO_LONG], // Ensure description is not more than 500 characters
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
        // TODO: Update these field names
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
    sellerID: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming the seller is referenced from a User model
      required: [true, ListingMessages.PROVIDE_SELLER_ID], // Ensure sellerID is provided
    },
  },
  { timestamps: true }
);

const Listing: Model<ListingModel> = mongoose.model<ListingModel>(
  "Listing",
  ListingSchema
);
export default Listing;
