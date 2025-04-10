// src/screens/ChatScreen.tsx
// Purpose: This file defines the ChatScreen component.
// Description: It provides a UI for displaying chat conversations with search functionality.
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
  // Sample data - replace with actual data from your state management
  const [conversations, setConversations] = useState<ChatConversation[]>([
    { 
      id: '1', 
      name: 'Jane Doe', 
      lastMessage: 'Is this still available?', 
      time: '2m ago',
      unread: true
    },
    { 
      id: '2', 
      name: 'John Smith', 
      lastMessage: 'I can meet tomorrow', 
      time: '1h ago',
      unread: false
    },
    { 
      id: '3', 
      name: 'Emily Johnson', 
      lastMessage: 'Thanks for the quick response!', 
      time: '3h ago',
      unread: false
    }
  ]);
  
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