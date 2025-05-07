// // screens/ChatScreen.tsx
// // Purpose: This file contains the ChatScreen component that displays a list of user chats. It allows users to filter chats by type (all, buying, selling), search through messages, and navigate to individual conversations. The component handles loading states, errors, and dark mode styling.
// // Description: The ChatScreen component fetches chat data from the server and displays it in a list format. Users can switch between different chat types (all, buying, selling) using tabs, and search for specific messages using a search bar. Each chat item shows the other party's name, the product title, and the last message timestamp. The component also handles image loading errors gracefully. It uses React Native's built-in components and hooks for state management and navigation.
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTabStyles } from '../styles/tabStyles';
import { useColorScheme } from '../hooks/useColorScheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chatService';
import { Chat } from '../types/chat';
import { useSocket } from '../hooks/useSocket';

// Chat tab type for better type checking
type ChatTab = 'all' | 'buying' | 'selling';

// Interface for tracking unread messages
interface UnreadMessagesCount {
  [chatId: string]: number;
}

export default function ChatScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get current color scheme
  const colorScheme = useColorScheme();
  const tabStyles = createTabStyles(colorScheme);
  const isDarkMode = colorScheme === 'dark';
  
  const { user } = useAuth();
  const { socket, isConnected, messages } = useSocket(); // Get messages from socket context
  
  // State variables
  const [activeTab, setActiveTab] = useState<ChatTab>('all');
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessagesCount>({});
  const [openedChats, setOpenedChats] = useState<Record<string, boolean>>({});

  // Check if we need to start a new chat with a seller from product details
  useEffect(() => {
    if (params.sellerId && params.productId && params.productTitle) {
      // Navigate to conversation screen with these params to start a new chat
      router.push({
        pathname: '/conversation',
        params: {
          sellerId: params.sellerId as string,
          productId: params.productId as string,
          productTitle: params.productTitle as string,
          isNew: 'true'
        }
      });
    }
    
    // Mark the current chat as opened when returning from conversation
    if (params.chatId) {
      setOpenedChats(prev => ({
        ...prev,
        [params.chatId as string]: true
      }));
      
      // Reset unread count for this chat
      setUnreadMessages(prev => ({
        ...prev,
        [params.chatId as string]: 0
      }));
    }
  }, [params]);
  
  // Fetch chats from the server
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatService.getAllChats();
      // Sort chats by last message timestamp or creation date
      const sortedChats = data.sort((a, b) => {
        const aTime = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : new Date(a.updatedAt).getTime();
        const bTime = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : new Date(b.updatedAt).getTime();
        return bTime - aTime; // Descending order (newest first)
      });
      
      setChats(sortedChats);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch chats';
      setError(errorMessage);
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);
  
  // Update chats and unread messages when socket messages change
  useEffect(() => {
    if (!user || !messages || Object.keys(messages).length === 0) return;

    const updatedChats = [...chats];
    let hasUpdates = false;
    const newUnreadCounts = { ...unreadMessages };
    
    // Loop through all chats to check for updates
    updatedChats.forEach(chat => {
      const chatMessages = messages[chat._id];
      if (!chatMessages || chatMessages.length === 0) return;
      
      // Get the latest message
      const latestMessage = chatMessages[chatMessages.length - 1];
      
      // Skip if it's a temporary message
      if (latestMessage._id.startsWith('temp_')) return;
      
      // Check if this is a new message (more recent than the current lastMessageTimestamp)
      const currentLastMessageTime = chat.lastMessageTimestamp 
        ? new Date(chat.lastMessageTimestamp).getTime() 
        : 0;
      
      const newMessageTime = new Date(latestMessage.createdAt).getTime();
      
      // Only update if the new message is more recent
      if (newMessageTime > currentLastMessageTime) {
        // Update chat with latest message info
        chat.lastMessage = latestMessage.content;
        chat.lastMessageTimestamp = latestMessage.createdAt;
        hasUpdates = true;
        
        // Always increment unread count for messages from others
        // regardless of whether the chat was previously opened
        if (latestMessage.senderID._id !== user._id) {
          newUnreadCounts[chat._id] = (newUnreadCounts[chat._id] || 0) + 1;
          
          // Remove from openedChats when receiving a new message from someone else
          if (openedChats[chat._id]) {
            setOpenedChats(prev => {
              const updated = {...prev};
              delete updated[chat._id];
              return updated;
            });
          }
        }
      }
    });
    
    // Update state if changes were made
    if (hasUpdates) {
      // Sort chats by timestamp (newest first)
      updatedChats.sort((a, b) => {
        const aTime = a.lastMessageTimestamp 
          ? new Date(a.lastMessageTimestamp).getTime() 
          : new Date(a.updatedAt).getTime();
        const bTime = b.lastMessageTimestamp 
          ? new Date(b.lastMessageTimestamp).getTime() 
          : new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
      
      setChats([...updatedChats]);
      setUnreadMessages(newUnreadCounts);
    }
  }, [messages, chats, user, openedChats]);
  
  // Filter chats based on active tab and search query
  useEffect(() => {
    if (!user || !chats.length) return;
    
    let filtered = [...chats];
    
    // Filter based on active tab
    if (activeTab === 'buying') {
      filtered = chats.filter(chat => chat.buyerID._id === user._id);
    } else if (activeTab === 'selling') {
      filtered = chats.filter(chat => chat.sellerID._id === user._id);
    }
    
    // Apply search filter if needed
    if (searchQuery) {
      filtered = filtered.filter(chat => {
        const title = chat.listingID.title.toLowerCase();
        
        return title.includes(searchQuery.toLowerCase()) ||
          (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }
    setFilteredChats(filtered);
  }, [chats, activeTab, searchQuery, user]);
  
  // Navigate to conversation screen
  const navigateToConversation = (chat: Chat) => {
    // Check if all required properties exist
    if (!chat || !chat._id) {
      console.error("Invalid chat object:", chat);
      Alert.alert("Error", "Cannot open this conversation.");
      return;
    }

    // Mark this chat as opened
    setOpenedChats(prev => ({
      ...prev,
      [chat._id]: true
    }));
    
    // Reset unread count
    setUnreadMessages(prev => ({
      ...prev,
      [chat._id]: 0
    }));

    router.push({
      pathname: '/conversation',
      params: { 
        chatId: chat._id,
        productId: chat.listingID._id, 
        productTitle: chat.listingID.title,
        sellerId: chat.sellerID._id,
        buyerId: chat.buyerID._id
      }
    });
  };
  
  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', timestamp);
        return '';
      }
      
      // Use direct time format for messages that came in today
      // This avoids the problematic "days ago" calculation which can cause -1 days
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        // For messages today, just show the time
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        // For older messages, use date comparison
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          return 'Yesterday';
        } else if (diffDays > 1 && diffDays < 7) {
          return `${diffDays} days ago`;
        } else {
          // More than a week, show date
          return date.toLocaleDateString();
        }
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };
  
  const handleImageError = (chatId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [chatId]: true
    }));
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    if (!item) return null;
    
    // Get other party info based on if user is seller or buyer
    const isUserSeller = user?._id === item.sellerID._id;
    const otherParty = isUserSeller ? item.buyerID : item.sellerID;
    
    // Get image URL
    const imageUrl = item.listingID.pictures && item.listingID.pictures.length > 0
      ? item.listingID.pictures[0]
      : '';
    
    // Format timestamp with fallbacks
    const timestamp = item.lastMessageTimestamp
      ? formatTimestamp(item.lastMessageTimestamp)
      : (item.updatedAt ? formatTimestamp(item.updatedAt) : formatTimestamp(item.createdAt));
    
    const hasImageError = !imageUrl || (item._id && imageErrors[item._id]);
    
    // Check for unread messages
    const unreadCount = unreadMessages[item._id] || 0;
    const hasUnread = unreadCount > 0;
    
    return (
      <TouchableOpacity 
        style={[
          styles.chatItem, 
          isDarkMode && styles.darkChatItem,
          hasUnread && styles.unreadChatItem,
          hasUnread && isDarkMode && styles.darkUnreadChatItem
        ]}
        onPress={() => navigateToConversation(item)}
      >
        <View style={styles.chatImageContainer}>
          <Image 
            source={
              hasImageError
                ? require('../assets/images/placeholder.png')
                : { uri: imageUrl }
            } 
            style={styles.chatImage}
            onError={() => item._id && handleImageError(item._id)}
          />
          {hasUnread && (
            <View style={styles.unreadBadgeContainer}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text 
              style={[
                styles.chatName, 
                isDarkMode && styles.darkText,
                hasUnread && styles.boldText
              ]} 
              numberOfLines={1}
            >
              {otherParty.firstName || ''} {otherParty.lastName || ''}
            </Text>
            <Text style={[styles.chatTime, isDarkMode && styles.darkSubText]}>
              {timestamp}
            </Text>
          </View>
          
          <Text 
            style={[
              styles.productTitle, 
              isDarkMode && styles.darkSubText,
              hasUnread && { color: isDarkMode ? '#4a9eff' : '#007BFF' }
            ]} 
            numberOfLines={1}
          >
            {item.listingID.title || 'Product'}
          </Text>
          
          <Text 
            style={[
              styles.lastMessage, 
              isDarkMode && styles.darkSubText,
              hasUnread && styles.boldText
            ]} 
            numberOfLines={1}
          >
            {item.lastMessage || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Tab buttons
  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'all' ? styles.activeTabButton : null,
            isDarkMode && styles.darkTabButton,
            activeTab === 'all' && isDarkMode ? styles.darkActiveTabButton : null
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'all' ? styles.activeTabText : null,
            isDarkMode && styles.darkTabText,
            activeTab === 'all' && isDarkMode ? styles.darkActiveTabText : null
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'buying' ? styles.activeTabButton : null,
            isDarkMode && styles.darkTabButton,
            activeTab === 'buying' && isDarkMode ? styles.darkActiveTabButton : null
          ]}
          onPress={() => setActiveTab('buying')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'buying' ? styles.activeTabText : null,
            isDarkMode && styles.darkTabText,
            activeTab === 'buying' && isDarkMode ? styles.darkActiveTabText : null
          ]}>
            Buying
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'selling' ? styles.activeTabButton : null,
            isDarkMode && styles.darkTabButton,
            activeTab === 'selling' && isDarkMode ? styles.darkActiveTabButton : null
          ]}
          onPress={() => setActiveTab('selling')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'selling' ? styles.activeTabText : null,
            isDarkMode && styles.darkTabText,
            activeTab === 'selling' && isDarkMode ? styles.darkActiveTabText : null
          ]}>
            Selling
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render main screen
  return (
    <View style={tabStyles.container}>
      <View style={[
        tabStyles.header,
        isDarkMode && { borderBottomColor: '#333' }
      ]}>
        <Text style={tabStyles.headerTitle}>Messages</Text>
      </View>
      
      <View style={[
        styles.searchBarContainer,
        isDarkMode && { backgroundColor: '#1E2022' }
      ]}>
        <View style={[
          styles.searchBar,
          isDarkMode && styles.darkSearchBar
        ]}>
          <Ionicons name="search" size={20} color={isDarkMode ? "#9BA1A6" : "#666"} style={styles.searchIcon} />
          <TextInput 
            style={[
              styles.searchInput,
              isDarkMode && styles.darkSearchInput
            ]}
            placeholder="Search messages"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDarkMode ? "#9BA1A6" : "#666"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {renderTabs()}
      
      {loading ? (
        <View style={[styles.loadingContainer, isDarkMode && { backgroundColor: '#151718' }]}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading chats...
          </Text>
        </View>
      ) : error ? (
        <View style={[styles.errorContainer, isDarkMode && { backgroundColor: '#151718' }]}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChats}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredChats.length === 0 ? (
        <View style={[styles.emptyContainer, isDarkMode && { backgroundColor: '#151718' }]}>
          <Ionicons name="chatbubbles-outline" size={48} color={isDarkMode ? "#9BA1A6" : "#999"} />
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
            No {activeTab !== 'all' ? activeTab : ''} messages yet
          </Text>
          <Text style={[styles.emptySubText, isDarkMode && styles.darkSubText]}>
            {activeTab === 'all' ? 'Start a conversation by messaging a seller' :
             activeTab === 'buying' ? 'Start a conversation by messaging a seller' :
             'Wait for buyers to contact you about your listings'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={item => item._id}
          style={[styles.chatList, isDarkMode && { backgroundColor: '#151718' }]}
          contentContainerStyle={styles.chatListContent}
          refreshing={loading}
          onRefresh={fetchChats}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginRight: 10,
    height: 42,
  },
  darkSearchBar: {
    backgroundColor: '#2A2F33',
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  darkSearchInput: {
    color: '#ECEDEE',
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e1e1e1',
  },
  darkTabButton: {
    borderBottomColor: '#333',
  },
  activeTabButton: {
    borderBottomColor: '#007BFF',
  },
  darkActiveTabButton: {
    borderBottomColor: '#4a9eff',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
  },
  darkTabText: {
    color: '#9BA1A6',
  },
  activeTabText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  darkActiveTabText: {
    color: '#4a9eff',
    fontWeight: '600',
  },
  chatList: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  chatListContent: {
    paddingHorizontal: 15,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkChatItem: {
    backgroundColor: '#1E2022',
    borderColor: '#333',
  },
  unreadChatItem: {
    backgroundColor: '#EDF4FF',
    borderLeftWidth: 3,
    borderLeftColor: '#007BFF',
  },
  darkUnreadChatItem: {
    backgroundColor: '#1F2A3C',
    borderLeftWidth: 3,
    borderLeftColor: '#4a9eff',
  },
  chatImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  chatImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  unreadBadgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'transparent',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  darkText: {
    color: '#ECEDEE',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  productTitle: {
    fontSize: 14,
    color: '#007BFF',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
});