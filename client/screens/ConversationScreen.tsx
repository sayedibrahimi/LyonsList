// screens/ConversationScreen.tsx
// Purpose: This screen displays the conversation between a buyer and seller, allowing them to send and receive messages related to a specific product listing.
// Description: The ConversationScreen component fetches messages from a chat service and displays them in a chat interface. It allows users to send new messages, view product details, and manage the conversation (e.g., report or delete). The screen also handles loading states and errors gracefully.
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '../hooks/useColorScheme';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chatService';
import { listingsService } from '../services/listingsService';
import { useSocket } from '../hooks/useSocket';
import { Message, ListingDetails, normalizeMessage, NewChatRequest } from '../types/chat';

export default function ConversationScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { user } = useAuth();
  const { socket, isConnected, messages, setMessagesForChat, addOptimisticMessage } = useSocket();
  
  // Extract params
  const chatId = params.chatId as string;
  const productId = params.productId as string;
  const productTitle = params.productTitle as string;
  const sellerId = params.sellerId as string;
  const buyerId = params.buyerId as string;
  const isNewChat = params.isNew === 'true';
  
  // State variables
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<ListingDetails | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [chat, setChat] = useState<any>(null);
  
  // Refs
  const flatListRef = useRef<FlatList>(null);

  // Check for existing chat if it's a new chat
  const checkExistingChat = async () => {
    if (!isNewChat || !productId || !user) return;
    
    try {
      // Get all chats for the user
      const allChats = await chatService.getAllChats();
      
      // Find if there's already a chat for this listing
      const existingChat = allChats.find(chat => {
        if (typeof chat.listingID === 'string') {
          return chat.listingID === productId;
        } else {
          return chat.listingID?._id === productId;
        }
      });
      
      if (existingChat) {
        console.log("Found existing chat:", existingChat._id);
        // Update the params to use the existing chat ID
        router.setParams({ 
          chatId: existingChat._id, 
          isNew: 'false' 
        });
        
        // Also fetch messages for this chat
        const chatData = await chatService.getChatById(existingChat._id);
        
        setMessagesForChat(existingChat._id, chatData.messages);
      }
    } catch (err) {
      console.error("Error checking for existing chats:", err);
      // Continue as a new chat if there's an error
    }
  };
  
  // Set default message for new chat
  useEffect(() => {
    if (isNewChat && productTitle) {
      setInputMessage(`Hi! I am interested in buying this ${productTitle}`);
    }
  }, [isNewChat, productTitle]);
  
  // Fetch chat messages and product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        if (productId) {
          const productData = await listingsService.getListingById(productId);
          setProductDetails(productData);
        }
        
        // If we have an existing chat, fetch messages
        if (chatId) {
          const data = await chatService.getChatById(chatId);
          setChat(data.chat);
          
          setMessagesForChat(chatId, data.messages);
        }
        
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || 'Failed to fetch conversation';
        setError(errorMessage);
        console.error('Error fetching conversation:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isNewChat) {
      checkExistingChat();
    }
    
    fetchData();
  }, [chatId, productId]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages[chatId]?.length && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, chatId]);


  const createNewChat = async (productId: string, messageText: string): Promise<string> => {
  try {
    const chatData: NewChatRequest = {
      listingID: productId,
      content: messageText
    };
    
    // Create a new chat
    const response = await chatService.createChat(chatData);
    console.log('New chat created:', response);
    
    // Return the new chat ID
    return response.data._id;
  } catch (error) {
    console.error('Failed to create new chat:', error);
    Alert.alert('Error', 'Failed to create new chat. Please try again.');
    throw error;
  }
};

// Updated handleSendMessage function to handle both new and existing chats
const handleSendMessage = async () => {
  if (!inputMessage.trim() || !user) return;
  
  const messageText = inputMessage.trim();
  setInputMessage('');
  
  try {
    let actualChatId = chatId;
    
    // If this is a new chat, create it first
    if (isNewChat || !actualChatId) {
      console.log('Creating new chat first...');
      actualChatId = await createNewChat(productId, messageText);
      
      // Update the URL params to use the new chat ID
      router.setParams({ 
        chatId: actualChatId,
        isNew: 'false'
      });
      
      // No need to continue as the message was already sent when creating the chat
      return;
    }
    
    // For existing chats, continue with the normal flow
    // Determine the receiver ID
    const receiverId = user._id === sellerId ? buyerId : sellerId;
    
    // Create message data for the API
    const messageData = {
      senderID: user._id,
      receiverID: receiverId,
      listingID: productId,
      chatID: actualChatId,
      content: messageText
    };
    
    // Create optimistic message for immediate UI update
    const optimisticMessage: Message = normalizeMessage({
      _id: `temp_${Date.now()}`, // Use temp_ prefix to identify optimistic messages
      senderID: {
        _id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      },
      receiverID: {
        _id: receiverId,
        firstName: '',
        lastName: ''
      },
      content: messageText,
      chatID: actualChatId,
      readStatus: false,
      timestamp: new Date(),
      createdAt: new Date().toISOString()
    });
    
    // Add optimistic message to UI immediately
    addOptimisticMessage(optimisticMessage);
    
    // Send message via socket
    if (socket && isConnected) {
      chatService.sendMessageViaSocket(socket, messageData);
    } else {
      // Fallback to REST API if socket is not connected
      chatService.sendMessageViaREST(messageData)
        .then(confirmedMessage => {
          // If we had to use REST, manually add the confirmed message
          console.log('Message sent via REST:', confirmedMessage);
        })
        .catch(error => {
          console.error('Failed to send message:', error);
          Alert.alert(
            'Message Failed',
            'Failed to send message. Please check your connection and try again.',
            [{ text: 'OK' }]
          );
        });
    }
  } catch (error) {
    console.error('Error in handleSendMessage:', error);
    Alert.alert('Error', 'Failed to send message. Please try again.');
  }
};
  
  // Format timestamp
  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format price
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };
  
  // Report chat
  const reportChat = () => {
    setMenuVisible(false);
    Alert.alert(
      'Report Conversation',
      'Are you sure you want to report this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          style: 'destructive',
          onPress: () => {
            // Implement report functionality here
            Alert.alert('Reported', 'This conversation has been reported.');
          }
        }
      ]
    );
  };
  
  // Delete chat
  const deleteChat = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Implement delete functionality here
            router.back();
          }
        }
      ]
    );
  };
  
  // Render a message bubble
  const renderMessageItem = ({ item }: { item: Message }) => {
    // Check if the message sender ID matches the current user ID
    const isCurrentUser = user?._id === item.senderID._id;
    
    // Special styling for optimistic messages
    const isOptimistic = item._id.startsWith('temp_');
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? 
            (isDarkMode ? styles.darkCurrentUserBubble : styles.currentUserBubble) : 
            (isDarkMode ? styles.darkOtherUserBubble : styles.otherUserBubble),
          // Add a subtle indication for optimistic messages
          isOptimistic && styles.optimisticMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? 
              (isDarkMode ? styles.darkCurrentUserText : styles.currentUserText) : 
              (isDarkMode ? styles.darkOtherUserText : styles.otherUserText)
          ]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            {isOptimistic && (
              <Ionicons 
                name="time-outline" 
                size={12} 
                color={isCurrentUser ? 
                  (isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)") : 
                  (isDarkMode ? "#9BA1A6" : "#999")} 
                style={styles.sendingIcon}
              />
            )}
            <Text style={[
              styles.messageTime,
              isCurrentUser ? 
                (isDarkMode ? styles.darkCurrentUserTime : styles.currentUserTime) : 
                (isDarkMode ? styles.darkOtherUserTime : styles.otherUserTime)
            ]}>
              {formatMessageTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Render the product header
  const renderProductHeader = () => {
    if (!productDetails) return null;
    
    return (
      <View style={[styles.productHeader, isDarkMode && styles.darkProductHeader]}>
        <View style={styles.productImageContainer}>
          <Image 
            source={
              imageError ? 
                require('../assets/images/placeholder.png') : 
                { uri: productDetails.pictures[0] }
            } 
            style={styles.productImage}
            onError={() => setImageError(true)}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={[styles.productTitle, isDarkMode && styles.darkText]} numberOfLines={1}>
            {productDetails.title}
          </Text>
          <Text style={[styles.productPrice, isDarkMode && { color: '#4a9eff' }]}>
            {formatPrice(productDetails.price)}
          </Text>
        </View>
      </View>
    );
  };
  
  // Render the options menu
  const renderOptionsMenu = () => {
    return (
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[
            styles.menuContainer,
            isDarkMode && styles.darkMenuContainer
          ]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={reportChat}
            >
              <Ionicons name="flag-outline" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={deleteChat}
            >
              <Ionicons name="trash-outline" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
              <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  // Main render
  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Header */}
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]} numberOfLines={1}>
            {user?._id === sellerId ? 
              `${productTitle} - Buyer` : 
              `${productTitle} - Seller`}
          </Text>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
          </TouchableOpacity>
        </View>
        
        {/* Product header */}
        {renderProductHeader()}
        
        {/* Menu Modal */}
        {renderOptionsMenu()}
        
        {/* Chat content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
        >
          {loading ? (
            <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
                Loading conversation...
              </Text>
            </View>
          ) : error ? (
            <View style={[styles.errorContainer, isDarkMode && styles.darkErrorContainer]}>
              <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
              <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{error}</Text>
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={messages[chatId] || []}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item._id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                inverted={false}
              />
              
              <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.darkTextInput]}
                  placeholder="Type a message..."
                  placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton, 
                    !inputMessage.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <Ionicons 
                    name="paper-plane" 
                    size={20} 
                    color={!inputMessage.trim() ? "#CCC" : "#FFF"} 
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  darkSafeArea: {
    backgroundColor: '#151718',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  darkHeader: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    color: '#333',
    marginHorizontal: 10,
  },
  darkText: {
    color: '#ECEDEE',
  },
  menuButton: {
    padding: 6,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkProductHeader: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  productImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007BFF',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  darkMenuContainer: {
    backgroundColor: '#1E2022',
    borderColor: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 6,
  },
  currentUserBubble: {
    backgroundColor: '#007BFF',
  },
  darkCurrentUserBubble: {
    backgroundColor: '#4a9eff',
  },
  otherUserBubble: {
    backgroundColor: '#E9ECEF',
  },
  darkOtherUserBubble: {
    backgroundColor: '#2A2F33',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  currentUserText: {
    color: '#FFF',
  },
  darkCurrentUserText: {
    color: '#FFF',
  },
  otherUserText: {
    color: '#333',
  },
  darkOtherUserText: {
    color: '#ECEDEE',
  },
  // Footer with time and status indicators
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: 10,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  darkCurrentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTime: {
    color: '#999',
  },
  darkOtherUserTime: {
    color: '#9BA1A6',
  },
  // Styles for optimistic messages
  optimisticMessageBubble: {
    opacity: 0.85, // Slightly faded to indicate pending status
  },
  sendingIcon: {
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  darkInputContainer: {
    backgroundColor: '#1E2022',
    borderTopColor: '#333',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    maxHeight: 100,
    minHeight: 40,
    color: '#333',
  },
  darkTextInput: {
    backgroundColor: '#2A2F33',
    color: '#ECEDEE',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkLoadingContainer: {
    backgroundColor: '#151718',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  darkErrorContainer: {
    backgroundColor: '#151718',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});