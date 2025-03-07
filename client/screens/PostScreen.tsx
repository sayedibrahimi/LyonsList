// screens/PostScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tabStyles } from '../styles/tabStyles';

interface PostScreenProps {
  // Define props if needed
}

export default function PostScreen({}: PostScreenProps): React.ReactElement {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    // This would typically open image picker
    Alert.alert('Add Image', 'Image selector would open here');
  };

  const handleSubmit = () => {
    // Validate form
    if (!title || !description || !price || !category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Submit the form
    console.log({
      title,
      description,
      price,
      category,
      images
    });
    
    Alert.alert('Success', 'Your listing has been posted');
    
    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImages([]);
  };

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>Create Listing</Text>
      </View>
      
      <ScrollView style={tabStyles.content}>
        <TouchableOpacity 
          style={styles.imageUploadBox} 
          onPress={handleAddImage}
        >
          <Ionicons name="camera" size={40} color="#666" />
          <Text style={styles.uploadText}>Add Photos</Text>
        </TouchableOpacity>
        
        <Text style={styles.labelText}>Title</Text>
        <TextInput
          style={tabStyles.input}
          placeholder="What are you selling?"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={styles.labelText}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe your item"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        
        <Text style={styles.labelText}>Price</Text>
        <TextInput
          style={tabStyles.input}
          placeholder="$0.00"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        
        <Text style={styles.labelText}>Category</Text>
        <TextInput
          style={tabStyles.input}
          placeholder="Select a category"
          value={category}
          onChangeText={setCategory}
        />
        
        <TouchableOpacity 
          style={tabStyles.button}
          onPress={handleSubmit}
        >
          <Text style={tabStyles.buttonText}>Post Listing</Text>
        </TouchableOpacity>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageUploadBox: {
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadText: {
    marginTop: 10,
    color: '#666',
  },
  descriptionInput: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  }
});