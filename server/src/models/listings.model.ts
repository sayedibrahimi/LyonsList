import { Schema, model, Document } from "mongoose";

export interface ListingModel extends Document {
  _id: string;
  title: string;
  description: string;
  picture: string;
  price: number;
  condition: string;
  status: string;
  sellerID: Schema.Types.ObjectId;
  // TODO: add some sort of tags or category here?
}

const ListingSchema = new Schema<ListingModel>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    picture: {
      type: String,
      required: [true, "Please provide a picture URL"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    condition: {
      type: String,
      required: [true, "Please provide the condition"],
      enum: {
        // TODO: Update these field names
        values: ["new", "lightly used", "refurbished", "used"],
        message: "{VALUE} is not a valid condition",
      },
    },
    status: {
      type: String,
      required: [true, "Please provide the status"],
      enum: {
        values: ["available", "sold", "pending", "deactivated"],
        message: "{VALUE} is not a valid status",
      },
      default: "available",
    },
    sellerID: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming the seller is referenced from a User model
      required: [true, "Please provide a seller ID"],
    },
  },
  { timestamps: true }
);

const Listing = model<ListingModel>("Listing", ListingSchema);
export default Listing;
