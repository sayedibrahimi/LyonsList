import mongoose, { Schema, Model, Document } from "mongoose";

export interface MessageModel extends Document {
  _id: string;
  senderID: Schema.Types.ObjectId;
  receiverID: Schema.Types.ObjectId;
  listingID: Schema.Types.ObjectId;
  chatID: Schema.Types.ObjectId;
  content: string;
  readStatus: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<MessageModel> = new Schema<MessageModel>(
  {
    senderID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    listingID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Listing",
    },
    chatID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
    content: {
      type: String,
      required: true,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<MessageModel> = mongoose.model<MessageModel>(
  "Message",
  MessageSchema
);

export default MessageModel;
