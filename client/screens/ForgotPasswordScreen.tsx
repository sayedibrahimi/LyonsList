// client/screens/ForgotPasswordScreen.tsx
// Purpose: This file contains the ForgotPasswordScreen component, which allows users to request a password reset by entering their email address. It includes form validation, error handling, and navigation to the OTP verification screen.
// Description: The ForgotPasswordScreen component uses React Native components to create a user interface for password reset. It includes a text input for the email address, a button to send the verification code, and error messages for invalid input or server errors. The component also handles navigation using the Expo Router and manages loading states during the submission process.
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
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

interface ForgotPasswordScreenProps {
  // Define props if needed
}

export default function ForgotPasswordScreen({}: ForgotPasswordScreenProps): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resetPassword, error: authError, clearError } = useAuth();

  const handleSendResetLink = async () => {
    // Reset error messages
    setFormError('');
    clearError();
    
    // Basic validation
    if (!email) {
      setFormError('Please enter your email address');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword.sendOTP(email);
      // Add a small delay before navigation
      setTimeout(() => {
        // Navigate to OTP verification screen 
        router.push({
          pathname: '/auth/otp-verification',
          params: { email, mode: 'signup' }
      });
      }, 100);
    } catch (error) {
      console.error('Password reset request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <Image source={require('../assets/images/wheaton.webp')} style={styles.logo} />
          
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a verification code to reset your password
          </Text>
          
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
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setFormError('');
              clearError();
            }}
          />
          
          <TouchableOpacity
            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
            onPress={handleSendResetLink}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
    textAlign: 'center',
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
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
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
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});