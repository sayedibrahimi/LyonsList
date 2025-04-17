import { NextFunction, Request, Response } from "express";
import Message, { MessageModel } from "../models/messages.model";
// import { requestAuth } from "../utils/requestAuth";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, ControllerError } from "../errors";
import ErrorMessages from "../constants/errorMessages";
import { sendSuccess } from "../utils/sendResponse";
import SuccessMessages from "../constants/successMessages";
import { getSocketID } from "../db/socket";
import { Socket } from "socket.io";

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

    const socketID: Socket | undefined = getSocketID(receiverID);
    if (socketID) {
      socketID.emit("message", savedMessage);
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
