// services/chatService.ts
// Purpose: This file contains the chat service that handles chat-related functionalities such as fetching all chats, getting a specific chat by ID, sending messages, creating new chats, and deleting chats. It interacts with the backend API to perform these actions.
// Description: The chatService object contains methods for managing chats. It includes methods to get all chats for the current user, get a specific chat by ID, send a new message, create a new chat, and delete a chat. Each method makes an API call using the apiService and handles the response appropriately.
import { apiService } from './api';

// Define chat interfaces
interface ChatItem {
  _id: string;
  listingID: {
    _id: string;
    title: string;
    price: number;
    pictures: string[];
  };
  sellerID: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  buyerID: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  lastMessage?: string;
  lastMessageTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  senderID: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  receiverID: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  readStatus: boolean;
  timestamp: string;
  createdAt: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    chat: ChatItem;
    messages: Message[];
  };
}

interface ChatsResponse {
  success: boolean;
  message: string;
  data: ChatItem[];
}

interface ChatApiResponse {
  success: boolean;
  message?: string;
  data: ChatItem;
}

interface NewMessageRequest {
  senderID: string;
  receiverID: string;
  listingID: string;
  chatID: string;
  content: string;
}

interface NewChatRequest {
  listingID: string;
  content: string;
}

export const chatService = {
  // Get all chats for the current user
  getAllChats: async (): Promise<ChatItem[]> => {
    try {
      const response = await apiService.get<ChatsResponse>('/chat/all');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },
  
  // Get a specific chat by ID
  getChatById: async (chatId: string): Promise<{ chat: ChatItem; messages: Message[] }> => {
    try {
      const response = await apiService.get<ChatResponse>(`/chat/${chatId}`);
      return response.data || { chat: {} as ChatItem, messages: [] };
    } catch (error) {
      console.error('Error fetching chat details:', error);
      throw error;
    }
  },
  
  // Create a new message
  sendMessage: async (messageData: NewMessageRequest): Promise<Message> => {
    try {
      const response = await apiService.post<Message>('/chat/message', messageData);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Create a new chat
  createChat: async (chatData: NewChatRequest): Promise<ChatApiResponse> => {
    try {
      const response = await apiService.post<ChatApiResponse>('/chat', chatData);
      console.log('Chat created successfully:', response);
      
      return response;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },
  
  // Delete a chat (optional, can be implemented later)
  deleteChat: async (chatId: string): Promise<void> => {
    try {
      await apiService.delete(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
};