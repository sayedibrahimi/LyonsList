// import cors from "cors";
import { Server, Socket } from "socket.io";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "../app";

const server: http.Server = http.createServer(app);
const io: SocketIOServer = new Server(server, {
  cors: {
    origin: "*", // production url
    // methods: ["GET", "POST"],
  },
});

export function getSocketID(userID: string): Socket | undefined {
  const socketID: Socket | undefined = userSocketMap.get(userID);
  if (!socketID) {
    return undefined;
  }
  return socketID;
}

const userSocketMap: Map<string, Socket> = new Map();

io.on("connection", (socket: Socket) => {
  console.log("New client connected:", socket.id);

  const userID: string = socket.handshake.query.userID as string;
  if (userID) {
    userSocketMap.set(userID, socket);
    console.log(`User ${userID} connected with socket ID ${socket.id}`);
  }

  // emit that this user is online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

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

export default server;
