// services/chatService.ts
// Purpose: This file contains the chat service that handles chat-related functionalities such as fetching all chats, getting a specific chat by ID, sending messages, creating new chats, and deleting chats. It interacts with the backend API to perform these actions.
// Description: The chatService object contains methods for managing chats. It includes methods to get all chats for the current user, get a specific chat by ID, send a new message, create a new chat, and delete a chat. Each method makes an API call using the apiService and handles the response appropriately.
import { apiService } from './api';
import { 
  Chat, 
  Message, 
  NewMessageRequest, 
  NewChatRequest, 
  ChatResponse, 
  ChatsResponse, 
  ChatApiResponse,
  normalizeMessage
} from '../types/chat';
import { Socket } from 'socket.io-client';

export const chatService = {
  // Get all chats for the current user
  getAllChats: async (): Promise<Chat[]> => {
    try {
      const response = await apiService.get<ChatsResponse>('/chat/all');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },
  
  // Get a specific chat by ID
  getChatById: async (chatId: string): Promise<{ chat: Chat; messages: Message[] }> => {
    try {
      const response = await apiService.get<ChatResponse>(`/chat/${chatId}`);
      
      // Ensure messages have the correct format
      const messages = response.data.messages.map(normalizeMessage);
      
      return { 
        chat: response.data.chat, 
        messages 
      };
    } catch (error) {
      console.error('Error fetching chat details:', error);
      throw error;
    }
  },
  
  // Send a message via REST API
  // Note: This method should be used only when we need to ensure message delivery
  // For normal operation, use sendMessageViaSocket
  sendMessageViaREST: async (messageData: NewMessageRequest): Promise<Message> => {
    try {
      const response = await apiService.post<Message>('/chat/message', messageData);
      return normalizeMessage(response);
    } catch (error) {
      console.error('Error sending message via REST:', error);
      throw error;
    }
  },

  // Send a message via socket (preferred method)
  // This should be called with the socket instance from SocketContext
  sendMessageViaSocket: (socket: Socket, messageData: NewMessageRequest): void => {
    if (!socket) {
      console.error('Socket is not connected. Falling back to REST API');
      // You could automatically fall back to REST API here if needed
      return;
    }
    
    console.log('Sending message via socket:', messageData);
    socket.emit('message', messageData);
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
  
  // Delete a chat
  deleteChat: async (chatId: string): Promise<void> => {
    try {
      await apiService.delete(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
};