import { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
import Message, { MessageModel } from "../models/messages.model";
import Chat, { ChatModel } from "../models/chat.model";
import Listing, { ListingModel } from "../models/listings.model";
import { requestAuth } from "../utils/requestAuth";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  /* NotFoundError, */ ControllerError,
} from "../errors";
// import ErrorMessages from "../constants/errorMessages";
import { sendSuccess } from "../utils/sendResponse";
import SuccessMessages from "../constants/successMessages";
import { getSocketID } from "../db/socket";
import { io } from "../db/socket";

export async function createMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // is this needed?
    // const UserReqID: string = requestAuth(req, next);

    const { senderID, receiverID, listingID, chatID, content } = req.body;
    const newMessage: MessageModel = new Message({
      senderID,
      receiverID,
      listingID,
      chatID,
      content,
    });
    const savedMessage: MessageModel = await newMessage.save();

    const receiverSocketID: string | undefined = getSocketID(receiverID);
    // display all sockcet ids
    if (receiverSocketID) {
      // TODO check that this is correct socket ID
      console.log(
        `User ${receiverID} is connected with socket ID ${receiverSocketID}`,
        `\n They received this message: ${savedMessage}`
      );
      // TODO: change the meesage they receive from json to just the content
      io.to(receiverSocketID).emit("message", savedMessage.content);
    } else {
      console.log(`User ${receiverID} is not connected`);
    }

    sendSuccess(
      res,
      SuccessMessages.MESSAGE_CREATED,
      StatusCodes.OK,
      savedMessage
    );
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function createChat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const buyerID: string = requestAuth(req, next);
    const { listingID, content } = req.body as {
      listingID: string;
      content: string;
    };
    // get the sellerID from the listingID
    const listing: ListingModel | null = await Listing.findById(listingID);
    if (!listing) {
      throw new BadRequestError("Listing not found");
    }
    const sellerID: string = listing.sellerID.toString();

    // create chat
    const chat: ChatModel = new Chat({
      listingID,
      sellerID,
      buyerID,
    });
    const savedChat: ChatModel = await chat.save();

    // create message for the initialized chat
    await createMessage(
      {
        body: {
          senderID: buyerID,
          receiverID: sellerID,
          listingID,
          chatID: savedChat._id,
          content,
        },
      } as Request,
      res,
      next
    );
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function getChatById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const foundChat: ChatModel | null = await Chat.findById(req.params.id);
    if (foundChat === null) {
      throw new BadRequestError("Chat not found");
    }
    req.params.chatID = foundChat._id.toString();
    // TODO check the populate fields
    const chatID: string = req.params.chatID;
    const messages: MessageModel[] = await Message.find({ chatID })
      .populate("senderID", "firstName lastName")
      .populate("receiverID", "firstName lastName")
      .sort({ createdAt: -1 });
    // TODO test the return data and make sure it is correct and useful
    sendSuccess(res, SuccessMessages.MESSAGES_RETRIEVED, StatusCodes.OK, {
      chat: foundChat,
      messages,
    });
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function getAllUsersChats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const UserReqID: string = requestAuth(req, next);

    const allChats: ChatModel[] = await Chat.find({
      $or: [{ sellerID: UserReqID }, { buyerID: UserReqID }],
    }).sort({ createdAt: -1 });

    sendSuccess(res, SuccessMessages.CHATS_RETRIEVED, StatusCodes.OK, allChats);
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}
