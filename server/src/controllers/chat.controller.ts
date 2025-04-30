// controllers/chat.controller.ts
// Purpose: This file contains the chat controller that handles chat-related functionalities such as creating messages, creating chats, retrieving chats, and getting all user chats. It interacts with the database models and manages socket events for real-time updates.
// Description: The chat controller exports functions that are used as middleware in the Express application. These functions handle incoming requests, interact with the database models (Message, Chat, Listing), and manage socket events for real-time communication. Error handling is also implemented to ensure proper responses are sent back to the client.
import { NextFunction, Request, Response } from "express";
import Message, { MessageModel } from "../models/messages.model";
import Chat, { ChatModel } from "../models/chat.model";
import Listing, { ListingModel } from "../models/listings.model";
import { requestAuth } from "../utils/requestAuth";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  ControllerError,
} from "../errors";
import { sendSuccess } from "../utils/sendResponse";
import SuccessMessages from "../constants/successMessages";
import { getSocketID } from "../db/socket";
import { io } from "../db/socket";

// REST API endpoint for creating messages (fallback for when socket isn't connected)
export async function createMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { senderID, receiverID, listingID, chatID, content } = req.body;
    const newMessage: MessageModel = new Message({
      senderID,
      receiverID,
      listingID,
      chatID,
      content,
    });
    const savedMessage: MessageModel = await newMessage.save();

    // Update the associated chat with the latest message information
    await Chat.findByIdAndUpdate(chatID, {
      lastMessage: content,
      lastMessageTimestamp: new Date(),
      updatedAt: new Date() // Also update the general timestamp
    });

    // Important: Only emit socket events if we're handling this through the REST API directly
    // (Socket connections already handle their own events)
    const viaSocket: boolean = req.query.viaSocket === 'true';
    
    if (!viaSocket) {
      const receiverSocketID: string | undefined = getSocketID(receiverID);
      if (receiverSocketID) {
        console.log(
          `User ${receiverID} is connected with socket ID ${receiverSocketID}`,
          `\n They received this message: ${savedMessage}`
        );
        // Send the full message object for better client handling
        io.to(receiverSocketID).emit("message", savedMessage);
      } else {
        console.log(`User ${receiverID} is not connected`);
      }
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

    // Check if a chat already exists for this buyer, seller, and listing
    const existingChat: ChatModel | null = await Chat.findOne({
      listingID,
      sellerID,
      buyerID
    });

    let savedChat: ChatModel;
    
    if (existingChat) {
      // Use the existing chat
      savedChat = existingChat;
      console.log(`Using existing chat: ${existingChat._id}`);
    } else {
      // Create a new chat
      const chat: ChatModel = new Chat({
        listingID,
        sellerID,
        buyerID,
      });
      savedChat = await chat.save();
      console.log(`Created new chat: ${savedChat._id}`);
    }
    
    // Only create a message if content is provided
    if (content) {
      const newMessage: MessageModel = new Message({
        senderID: buyerID,
        receiverID: sellerID,
        listingID,
        chatID: savedChat._id,
        content,
      });
      
      const savedMessage: MessageModel = await newMessage.save();
      
      // Update chat with last message
      savedChat.lastMessage = content;
      savedChat.lastMessageTimestamp = new Date();
      await savedChat.save();
      
      // Send message via socket if available
      const receiverSocketID: string | undefined = getSocketID(sellerID);
      if (receiverSocketID) {
        console.log(
          `User ${sellerID} is connected with socket ID ${receiverSocketID}`
        );
        io.to(receiverSocketID).emit("message", savedMessage);
      }
    }
    
    // Now respond with the saved chat
    sendSuccess(
      res,
      SuccessMessages.CHAT_CREATED,
      StatusCodes.OK,
      savedChat
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
    const foundChat: ChatModel | null = await Chat.findById(req.params.id)
      .populate('listingID', 'title price pictures')
      .populate('sellerID', 'firstName lastName')
      .populate('buyerID', 'firstName lastName');
      
    if (foundChat === null) {
      throw new BadRequestError("Chat not found");
    }
    
    const chatID: string = foundChat._id.toString();
    const messages: MessageModel[] = await Message.find({ chatID })
      .populate("senderID", "firstName lastName")
      .populate("receiverID", "firstName lastName")
      .sort({ createdAt: 1 }); // Sort from oldest to newest for proper conversation flow
    
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
    })
      .populate('listingID', 'title price pictures') // Populate listing details
      .populate('sellerID', 'firstName lastName') // Populate seller details
      .populate('buyerID', 'firstName lastName') // Populate buyer details
      .sort({ lastMessageTimestamp: -1 }); // Sort by most recent message

    sendSuccess(res, SuccessMessages.CHATS_RETRIEVED, StatusCodes.OK, allChats);
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}