// client/components/ReportListingModal.tsx
// Purpose: ReportListingModal component for reporting listings
// Description: This file contains the ReportListingModal component that allows users to report listings. It includes a form for selecting a report category, providing additional details, and submitting the report. The component also handles displaying error messages and submission status.
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reportService } from '../services/reportService';

interface ReportListingModalProps {
  isVisible: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const ReportListingModal: React.FC<ReportListingModalProps> = ({
  isVisible,
  onClose,
  listingId,
  listingTitle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const reportCategories = reportService.getReportCategories();

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await reportService.reportListing(listingId, {
        category: selectedCategory,
        message: message.trim() || undefined
      });
      
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. We will review it as soon as possible.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to submit report. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setMessage('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Report Listing</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.listingTitle}>{listingTitle}</Text>
            
            <Text style={styles.sectionTitle}>Why are you reporting this listing?</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            {reportCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={selectedCategory === category ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={selectedCategory === category ? "#007BFF" : "#666"}
                />
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
            
            <Text style={styles.sectionTitle}>Additional details (optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Please provide any additional information that will help us review this listing"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
            />
            <View style={{height: 30}} />
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  content: {
    padding: 15
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    color: '#333'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: '#333'
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  selectedCategory: {
    backgroundColor: '#f0f8ff'
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333'
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  submitButtonDisabled: {
    backgroundColor: '#80bdff'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10
  }
});

export default ReportListingModal;