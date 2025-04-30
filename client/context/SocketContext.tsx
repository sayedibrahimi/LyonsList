// client/context/SocketContext.tsx
// Purpose: This file provides a context for managing WebSocket connections using Socket.IO.
// Description: The SocketContext allows components to access the WebSocket connection, manage online users, and handle chat messages in real-time. It provides methods for adding messages, setting messages for specific chats, and handling optimistic updates for message sending.
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { Message, MessageData, normalizeMessage } from '../types/chat';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  messages: Record<string, Message[]>; // Store messages by chatID
  addMessage: (message: Message | MessageData) => void;
  setMessagesForChat: (chatId: string, messages: Message[] | MessageData[]) => void;
  addOptimisticMessage: (message: Message) => void; // New function for optimistic messages
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const { user, loading } = useAuth();

  // Method to add an optimistic message (with temp ID) to the messages state
  const addOptimisticMessage = (message: Message) => {
    if (!message || !message.chatID) return;
    
    // Ensure the message has a temporary ID format
    const optimisticMessage = {
      ...message,
      _id: message._id.startsWith('temp_') ? message._id : `temp_${Date.now()}`
    };
    
    setMessages(prevMessages => {
      const chatMessages = prevMessages[optimisticMessage.chatID] || [];
      
      return {
        ...prevMessages,
        [optimisticMessage.chatID]: [...chatMessages, optimisticMessage]
      };
    });
  };

  // Method to add a confirmed message to the messages state
  const addMessage = (message: Message | MessageData) => {
    if (!message || !message.chatID) return;
    
    // Normalize the message to ensure proper format
    const normalizedMessage = normalizeMessage(message);
    
    setMessages(prevMessages => {
      const chatMessages = prevMessages[normalizedMessage.chatID] || [];
      
      // Check if this exact message already exists
      const exactMessageExists = chatMessages.some(msg => msg._id === normalizedMessage._id);
      if (exactMessageExists) return prevMessages;

      // Check if this is a server confirmation of an optimistic message
      const isConfirmationOfOptimistic = chatMessages.some(msg => 
        msg._id.startsWith('temp_') && 
        msg.content === normalizedMessage.content &&
        // Check if the sender and receiver match
        msg.senderID._id === normalizedMessage.senderID._id &&
        msg.receiverID._id === normalizedMessage.receiverID._id
      );

      if (isConfirmationOfOptimistic) {
        // Replace the optimistic message with the confirmed one
        const updatedMessages = chatMessages.map(msg => {
          if (msg._id.startsWith('temp_') && 
              msg.content === normalizedMessage.content &&
              msg.senderID._id === normalizedMessage.senderID._id &&
              msg.receiverID._id === normalizedMessage.receiverID._id) {
            return normalizedMessage; // Replace with server-confirmed message
          }
          return msg;
        });
        
        return {
          ...prevMessages,
          [normalizedMessage.chatID]: updatedMessages
        };
      }
      
      // If it's not a duplicate or confirmation, add it as a new message
      return {
        ...prevMessages,
        [normalizedMessage.chatID]: [...chatMessages, normalizedMessage]
      };
    });
  };

  // Method to set all messages for a specific chat
  const setMessagesForChat = (chatId: string, chatMessages: Message[] | MessageData[]) => {
    // Normalize all messages to ensure proper format
    const normalizedMessages = chatMessages.map(normalizeMessage);
    
    setMessages(prevMessages => ({
      ...prevMessages,
      [chatId]: normalizedMessages
    }));
  };

  useEffect(() => {
    // Only connect to socket if user is authenticated and not in loading state
    if (user && !loading) {
      // Get the base URL from environment variable
      const baseURL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      // Remove 'api/v1' if it exists in the URL for socket connection
      const socketURL = baseURL.replace('/api/v1', '');
      
      // Initialize socket connection with user ID
      const newSocket = io(socketURL, {
        query: { userID: user._id },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('getOnlineUsers', (users: string[]) => {
        console.log('Online users:', users);
        setOnlineUsers(users);
      });

      // Listen for incoming messages from other users
      newSocket.on('message', (message: MessageData | Message) => {
        console.log('Received message via socket:', message);
        addMessage(message);
      });

      // Listen for confirmation of sent messages
      newSocket.on('messageSent', (message: MessageData | Message) => {
        console.log('Message sent confirmation:', message);
        // This will replace the optimistic message with the confirmed one
        addMessage(message);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        console.log('Disconnecting socket');
        newSocket.disconnect();
        setSocket(null);
      };
    } else if (!user && socket) {
      // Disconnect socket when user logs out
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [user, loading]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      onlineUsers, 
      messages, 
      addMessage,
      setMessagesForChat,
      addOptimisticMessage
    }}>
      {children}
    </SocketContext.Provider>
  );
};