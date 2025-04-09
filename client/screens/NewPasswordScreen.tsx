// client/screens/NewPasswordScreen.tsx
// Purpose: This file contains the NewPasswordScreen component, which allows users to set a new password after verifying their OTP. It includes form validation, error handling, and navigation to the login screen.
// Description: The NewPasswordScreen component uses React Native components to create a user interface for setting a new password. It includes text inputs for the new password and confirmation, a button to submit the new password, and error messages for invalid input or server errors. The component also handles navigation using the Expo Router and manages loading states during the submission process.
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

interface NewPasswordScreenProps {
  // Define props if needed
}

export default function NewPasswordScreen({}: NewPasswordScreenProps): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { resetPassword, error: authError, clearError } = useAuth();

  const handleResetPassword = async () => {
    // Clear previous errors
    setFormError('');
    clearError();
    
    // Basic validation
    if (!password || !confirmPassword) {
      setFormError('Please enter both password fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword.setNewPassword(email, password, confirmPassword);
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully',
        [
          {
            text: 'Login Now',
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <Image source={require('../assets/images/wheaton.webp')} style={styles.logo} />
          
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>
            Create a new password for your account
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          
          {formError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}
          
          {authError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setFormError('');
                clearError();
              }}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#999"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setFormError('');
                clearError();
              }}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#999"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.passwordRules}>
            <Text style={styles.passwordRulesTitle}>Password must:</Text>
            <View style={styles.passwordRule}>
              <Ionicons 
                name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={password.length >= 8 ? "#28a745" : "#999"} 
              />
              <Text style={styles.passwordRuleText}>Be at least 8 characters long</Text>
            </View>
            <View style={styles.passwordRule}>
              <Ionicons 
                name={/[A-Z]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/[A-Z]/.test(password) ? "#28a745" : "#999"} 
              />
              <Text style={styles.passwordRuleText}>Have at least one uppercase letter</Text>
            </View>
            <View style={styles.passwordRule}>
              <Ionicons 
                name={/\d/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/\d/.test(password) ? "#28a745" : "#999"} 
              />
              <Text style={styles.passwordRuleText}>Have at least one number</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
            onPress={handleResetPassword}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 60,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007BFF',
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 10,
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    paddingRight: 50, // Space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  passwordRules: {
    width: '100%',
    marginBottom: 20,
  },
  passwordRulesTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  passwordRule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordRuleText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 15,
  },
  buttonDisabled: {
    backgroundColor: '#80bdff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});