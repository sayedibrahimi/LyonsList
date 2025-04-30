// client/hooks/useSocket.ts
// Purpose: This file contains a custom React hook that provides access to the Socket.IO context, allowing components to interact with the WebSocket connection and manage chat messages.
// Description: The useSocket hook retrieves the Socket.IO context, which includes the socket instance, connection status, online users, and methods for managing chat messages. It throws an error if used outside of a SocketProvider context.
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { Socket } from 'socket.io-client';
import { Message } from '../types/chat';

// Define return type for the hook
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  messages: Record<string, Message[]>;
  addMessage: (message: any) => void;
  setMessagesForChat: (chatId: string, messages: any[]) => void;
  addOptimisticMessage: (message: Message) => void; // New method for optimistic updates
}

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};