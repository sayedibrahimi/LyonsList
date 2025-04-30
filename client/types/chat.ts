// types/chat.ts
// Purpose: This file defines TypeScript interfaces and types for chat-related data structures in the application.
// Description: The interfaces include definitions for messages, chats, users, and requests for creating new messages and chats. It also includes helper functions to populate and normalize message data.
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  // Add other user fields as needed
}

export interface ListingDetails {
  _id: string;
  title: string;
  price: number;
  pictures: string[];
  description?: string;
  condition?: string;
  category?: string;
  status?: string;
  sellerID?: string;
}

// Interface for a message with populated user references
export interface Message {
  _id: string;
  senderID: PopulatedUser;
  receiverID: PopulatedUser;
  content: string;
  chatID: string;
  listingID?: string | ListingDetails;
  readStatus: boolean;
  timestamp: Date;
  createdAt: string;
  updatedAt?: string;
}

// Interface for raw message data (from API or socket)
export interface MessageData {
  _id: string;
  senderID: string;
  receiverID: string;
  content: string;
  chatID: string;
  listingID?: string;
  readStatus: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt?: string;
}

// Interface for creating a new message
export interface NewMessageRequest {
  senderID: string;
  receiverID: string;
  listingID: string;
  chatID: string;
  content: string;
}

// Interface for a chat with populated references
export interface Chat {
  _id: string;
  listingID: ListingDetails;
  sellerID: PopulatedUser;
  buyerID: PopulatedUser;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for raw chat data (from API)
export interface ChatData {
  _id: string;
  listingID: string | ListingDetails;
  sellerID: string | PopulatedUser;
  buyerID: string | PopulatedUser;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for creating a new chat
export interface NewChatRequest {
  listingID: string;
  content: string;
}

// Response types for API calls
export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    chat: Chat;
    messages: Message[];
  };
}

export interface ChatsResponse {
  success: boolean;
  message: string;
  data: Chat[];
}

export interface ChatApiResponse {
  success: boolean;
  message?: string;
  data: Chat;
}

// Helper function to convert MessageData to Message
export function populateMessage(messageData: MessageData, users: Record<string, PopulatedUser>): Message {
  return {
    ...messageData,
    senderID: users[messageData.senderID] || {
      _id: messageData.senderID,
      firstName: 'Unknown',
      lastName: 'User'
    },
    receiverID: users[messageData.receiverID] || {
      _id: messageData.receiverID,
      firstName: 'Unknown',
      lastName: 'User'
    },
    timestamp: new Date(messageData.timestamp || messageData.createdAt)
  };
}

// Helper function to ensure message has the correct format
export function normalizeMessage(message: any): Message {
  // Handle case where senderID/receiverID are strings
  const senderID = typeof message.senderID === 'string'
    ? { _id: message.senderID, firstName: 'User', lastName: '' }
    : message.senderID;
    
  const receiverID = typeof message.receiverID === 'string'
    ? { _id: message.receiverID, firstName: 'User', lastName: '' }
    : message.receiverID;

  return {
    ...message,
    senderID,
    receiverID,
    timestamp: message.timestamp instanceof Date ? 
      message.timestamp : 
      new Date(message.timestamp || message.createdAt)
  };
}