import mongoose, { Schema, Model, Document } from "mongoose";

export interface ChatModel extends Document {
  _id: string;
  listingID: Schema.Types.ObjectId;
  senderID: Schema.Types.ObjectId;
  receiverID: Schema.Types.ObjectId;
  lastMessage: string;
  lastMessageTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema<ChatModel> = new Schema<ChatModel>({
  listingID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
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
  lastMessage: {
    type: String,
    required: true,
    trim: true,
  },
  lastMessageTimestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation: Model<ChatModel> = mongoose.model<ChatModel>(
  "Chat",
  ChatSchema
);

export default Conversation;
