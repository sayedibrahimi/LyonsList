// server/db/socket.ts
// Purpose: This file sets up a WebSocket server using Socket.IO to handle real-time communication for chat functionality in the application.
// Description: The code initializes a Socket.IO server that listens for incoming connections, manages user socket mappings, and handles real-time events such as sending and receiving messages, updating user statuses, and broadcasting online user lists. It also integrates with the Express application and MongoDB models for message and chat management.
import { Server, Socket } from "socket.io";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
import Message from "../models/messages.model";
import Chat from "../models/chat.model";
const app: express.Application = express();

const server: http.Server = http.createServer(app);
const io: SocketIOServer = new Server(server, {
  cors: {
    origin: "*", // In production, you should be more specific
  },
});

const userSocketMap: Map<string, Socket> = new Map();

export function getSocketID(userID: string): string | undefined {
  const socket: Socket | undefined = userSocketMap.get(userID);
  if (!socket) {
    return undefined;
  }
  return socket.id;
}

io.on("connection", (socket: Socket) => {
  console.log("\n\nNew client connected:", socket.id);

  const userID: string = socket.handshake.query.userID as string;
  
  if (!userID) {
    console.log("User ID not provided in handshake query");
    socket.disconnect(true);
    return;
  }
  
  userSocketMap.set(userID, socket);
  console.log(`User ${userID} connected with socket ID ${socket.id}`);

  // Emit online users list to all connected clients
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  // Handle messages sent from client
  socket.on("message", async (messageData) => {
    try {
      console.log("Message received via socket:", messageData);
      
      // Create and save the message to the database
      const newMessage: InstanceType<typeof Message> = new Message({
        senderID: messageData.senderID,
        receiverID: messageData.receiverID,
        listingID: messageData.listingID,
        chatID: messageData.chatID,
        content: messageData.content,
      });
      
      const savedMessage: InstanceType<typeof Message> = await newMessage.save();
      
      // Update the associated chat with the latest message
      await Chat.findByIdAndUpdate(messageData.chatID, {
        lastMessage: messageData.content,
        lastMessageTimestamp: new Date(),
        updatedAt: new Date()
      });
      
      // Send to recipient if online
      const recipientSocketID: string | undefined = getSocketID(messageData.receiverID);
      if (recipientSocketID) {
        io.to(recipientSocketID).emit("message", savedMessage);
      }
      
      // Return confirmation to sender
      // This is crucial - send back to the sender so they know it was processed
      socket.emit("messageSent", savedMessage);
      
    } catch (error) {
      console.error("Error processing socket message:", error);
      socket.emit("messageError", { error: "Failed to process message" });
    }
  });

  // Handle status updates (typing, seen, etc.)
  socket.on("status", (statusData) => {
    const { receiverID, status } = statusData;
    const receiverSocket: string | undefined = getSocketID(receiverID);
    
    if (receiverSocket) {
      io.to(receiverSocket).emit("status", {
        senderID: userID,
        status,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    userSocketMap.delete(userID);
    console.log("Client disconnected:", socket.id);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    console.log(`User ${userID} disconnected`);
  });
});

export { app, server, io };
