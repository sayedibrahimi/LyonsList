// client/screens/ChatScreen.tsx
// Purpose: This file contains the ChatScreen component that displays a list of chat conversations. It allows users to search for messages and view chat details. The component uses React Native's FlatList for rendering the chat items and handles dark mode styling.
// Description: The ChatScreen component maintains a state for chat conversations and search query. It filters the conversations based on the search input and displays them in a list. Each chat item can be pressed to open the chat details. The component also handles dark mode styling using a custom hook for color scheme detection.
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTabStyles } from '../styles/tabStyles';
import { useColorScheme } from '../hooks/useColorScheme';

interface ChatScreenProps {
  // Define props if needed
}

interface ChatConversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar?: string;
}

export default function ChatScreen({}: ChatScreenProps): React.ReactElement {
  // Initialize with empty conversations array
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const colorScheme = useColorScheme();
  const tabStyles = createTabStyles(colorScheme);
  const isDarkMode = colorScheme === 'dark';
  
  const handleConversationPress = (conversation: ChatConversation) => {
    // Navigate to the specific chat
    Alert.alert('Open Chat', `Chat with ${conversation.name}`);
    
    // Mark as read
    setConversations(prevConversations => 
      prevConversations.map(chat => 
        chat.id === conversation.id 
          ? { ...chat, unread: false } 
          : chat
      )
    );
  };

  const filterConversations = () => {
    if (!searchQuery) return conversations;
    
    return conversations.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

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
      </View>
      
      {conversations.length > 0 ? (
        <FlatList
          style={isDarkMode ? { backgroundColor: '#151718' } : styles.chatList}
          data={filterConversations()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.chatItem,
                isDarkMode && styles.darkChatItem
              ]}
              onPress={() => handleConversationPress(item)}
            >
              <View style={[
                styles.chatAvatar, 
                item.unread && styles.unreadIndicator
              ]}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={[
                    styles.chatName,
                    item.unread && styles.unreadText,
                    isDarkMode && styles.darkText
                  ]}>{item.name}</Text>
                  <Text style={[
                    styles.chatTime,
                    isDarkMode && styles.darkSubText
                  ]}>{item.time}</Text>
                </View>
                <Text 
                  style={[
                    styles.chatMessage,
                    item.unread && styles.unreadText,
                    isDarkMode && styles.darkSubText
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={[
          tabStyles.placeholderContent,
          isDarkMode && { backgroundColor: '#1E2022' }
        ]}>
          <Ionicons name="chatbubbles-outline" size={50} color={isDarkMode ? "#9BA1A6" : "#999"} />
          <Text style={[
            tabStyles.placeholderText,
            isDarkMode && styles.darkText
          ]}>No messages yet</Text>
          <Text style={[
            styles.emptyStateText,
            isDarkMode && styles.darkSubText
          ]}>
            Start a conversation by messaging a seller
          </Text>
        </View>
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  darkChatItem: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIndicator: {
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
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
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  unreadText: {
    fontWeight: 'bold',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  }
});