// src/screens/ChatScreen.tsx
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
import { tabStyles } from '../styles/tabStyles';

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
      
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search messages"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {conversations.length > 0 ? (
        <FlatList
          style={styles.chatList}
          data={filterConversations()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.chatItem}
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
                    item.unread && styles.unreadText
                  ]}>{item.name}</Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <Text 
                  style={[
                    styles.chatMessage,
                    item.unread && styles.unreadText
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
        <View style={tabStyles.placeholderContent}>
          <Ionicons name="chatbubbles-outline" size={50} color="#999" />
          <Text style={tabStyles.placeholderText}>No messages yet</Text>
          <Text style={styles.emptyStateText}>
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  },
  unreadText: {
    fontWeight: 'bold',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
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