// import cors from "cors";
import { Server, Socket } from "socket.io";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
const app: express.Application = express();

const server: http.Server = http.createServer(app);
const io: SocketIOServer = new Server(server, {
  cors: {
    origin: "*", // TODO! production url
    // origin: "http://localhost:5000",
    // methods: ["GET", "POST"],
  },
});

export function getSocketID(userID: string): string | undefined {
  const socketID: Socket | undefined = userSocketMap.get(userID);
  if (!socketID) {
    return undefined;
  }
  return socketID.id;
}

const userSocketMap: Map<string, Socket> = new Map();

io.on("connection", (socket: Socket) => {
  console.log("\n\nNew client connected:", socket.id);

  // TODO this may be able to be changed to JWT and use requestAuth to parse the UserID from the token
  const userID: string = socket.handshake.query.userID as string;
  console.log("User ID from handshake query:", userID);

  if (!userID) {
    console.log("User ID not provided in handshake query");
    socket.disconnect(true);
    return;
  }
  userSocketMap.set(userID, socket);
  console.log(`User ${userID} connected with socket ID ${socket.id}\n\n`);

  // emit that this user is online by updating keys?
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("getOnlineUsers", () => {
    console.log(
      `Online users requested ${Array.from(userSocketMap.entries()).map(([key, value]) => `${key}: ${value.id}`)}`
    );
  });

  // Listen for incoming messages from the client
  socket.on("message", (message) => {
    console.log("Message received:", message);
    // Broadcast the message to all connected clients
    io.emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    userSocketMap.delete(userID);
    console.log("Client disconnected:", socket.id);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`User ${userID} disconnected`);
  });
});

export { app, server, io };
