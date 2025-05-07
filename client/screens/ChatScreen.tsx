// screens/ChatScreen.tsx
// Purpose: This file contains the ChatScreen component that displays a list of user chats. It allows users to filter chats by type (all, buying, selling), search through messages, and navigate to individual conversations. The component handles loading states, errors, and dark mode styling.
// Description: The ChatScreen component fetches chat data from the server and displays it in a list format. Users can switch between different chat types (all, buying, selling) using tabs, and search for specific messages using a search bar. Each chat item shows the other party's name, the product title, and the last message timestamp. The component also handles image loading errors gracefully. It uses React Native's built-in components and hooks for state management and navigation.
import React, { useState, useEffect } from 'react';
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

// Chat tab type for better type checking
type ChatTab = 'all' | 'buying' | 'selling';

export default function ChatScreen(): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get current color scheme
  const colorScheme = useColorScheme();
  const tabStyles = createTabStyles(colorScheme);
  const isDarkMode = colorScheme === 'dark';
  
  const { user } = useAuth();
  
  // State variables
  const [activeTab, setActiveTab] = useState<ChatTab>('all');
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
  }, [params]);
  
  // Fetch chats from the server
  useEffect(() => {
    fetchChats();
  }, []);
  
  // Filter chats based on active tab
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
  
  const fetchChats = async () => {
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
  };
  
  // Navigate to conversation screen
  const navigateToConversation = (chat: Chat) => {
    // Check if all required properties exist
    if (!chat || !chat._id) {
      console.error("Invalid chat object:", chat);
      Alert.alert("Error", "Cannot open this conversation.");
      return;
    }

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
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      // More than a week, show date
      return date.toLocaleDateString();
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
    
    // Debug logging to see the actual data structure
    console.log(`Chat ${item._id}: Last message: "${item.lastMessage}" from ${item.lastMessageTimestamp}`);
    
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
    
    return (
      <TouchableOpacity 
        style={[styles.chatItem, isDarkMode && styles.darkChatItem]}
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
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, isDarkMode && styles.darkText]} numberOfLines={1}>
              {otherParty.firstName || ''} {otherParty.lastName || ''}
            </Text>
            <Text style={[styles.chatTime, isDarkMode && styles.darkSubText]}>
              {timestamp}
            </Text>
          </View>
          
          <Text style={[styles.productTitle, isDarkMode && styles.darkSubText]} numberOfLines={1}>
            {item.listingID.title || 'Product'}
          </Text>
          
          <Text style={[styles.lastMessage, isDarkMode && styles.darkSubText]} numberOfLines={1}>
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
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>Messages</Text>
      </View>
      
      <View style={[
        styles.searchBar,
        isDarkMode && styles.darkSearchBar
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isDarkMode ? "#9BA1A6" : "#666"} 
          style={styles.searchIcon} 
        />
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
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={isDarkMode ? "#9BA1A6" : "#666"} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {renderTabs()}
      
      {loading ? (
        <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading chats...
          </Text>
        </View>
      ) : error ? (
        <View style={[styles.errorContainer, isDarkMode && styles.darkErrorContainer]}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChats}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredChats.length === 0 ? (
        <View style={[styles.emptyContainer, isDarkMode && styles.darkEmptyContainer]}>
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
          style={[styles.chatList, isDarkMode && styles.darkChatList]}
          contentContainerStyle={styles.chatListContent}
          refreshing={loading}
          onRefresh={fetchChats}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    margin: 15,
  },
  darkSearchBar: {
    backgroundColor: '#2A2F33',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
  darkSearchInput: {
    color: '#ECEDEE',
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
    backgroundColor: '#f8f9fa',
  },
  darkChatList: {
    backgroundColor: '#151718',
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
  chatImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  chatImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    fontWeight: '600',
    color: '#333',
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  darkErrorContainer: {
    backgroundColor: '#151718',
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
  darkEmptyContainer: {
    backgroundColor: '#151718',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});