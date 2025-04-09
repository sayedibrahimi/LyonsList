// client/screens/OTPVerificationScreen.tsx
// Purpose: This file contains the OTPVerificationScreen component, which allows users to enter a one-time password (OTP) for verification. It includes form validation, error handling, and navigation to the appropriate screen based on the verification result.
// Description: The OTPVerificationScreen component uses React Native components to create a user interface for OTP verification. It includes an OTP input field, a button to verify the OTP, and a countdown timer for resending the code. The component also handles navigation using the Expo Router and manages loading states during the submission process.
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import OTPInput from '../components/OTPInput';
import { Ionicons } from '@expo/vector-icons';

interface OTPVerificationScreenProps {
  // Define props if needed
}

export default function OTPVerificationScreen({}: OTPVerificationScreenProps): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get params from the route
  const email = params.email as string;
  const mode = params.mode as string; // 'signup' or 'reset'
  
  const [otp, setOtp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes countdown
  const [canResend, setCanResend] = useState<boolean>(false);
  const [verificationSuccessful, setVerificationSuccessful] = useState<boolean>(false);

  
  const { verifyOTP, resetPassword, sendOTP, error: authError, clearError } = useAuth();

  // Debug log to track OTP state changes
  useEffect(() => {
    console.log('OTP state updated:', otp, 'Length:', otp.length);
  }, [otp]);

  // Effect to handle countdown timer
  useEffect(() => {
    // Start countdown timer
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Effect for handling navigation after successful verification
  useEffect(() => {
    if (verificationSuccessful) {
      if (mode === 'signup') {
        // For signup flow - navigate to home
        router.replace('/(tabs)/search');
      } else if (mode === 'reset') {
        // For password reset flow - navigate to reset password screen
        router.push({
          pathname: '/auth/new-password',
          params: { email }
        });
      }
    }
  }, [verificationSuccessful, mode, email, router]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = async () => {
    // Log the current OTP state before verification
    console.log('Verifying OTP:', otp, 'Length:', otp?.length || 0);
    
    // Check if OTP is valid
    if (!otp || otp.length < 6) {
      console.log('OTP validation failed, current value:', otp);
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }
    
    clearError();
    setIsSubmitting(true);
    
    try {
      console.log('Proceeding with OTP verification for:', otp);
      if (mode === 'signup') {
        // For signup flow - verify OTP and then navigate to home
        await verifyOTP(email, otp);
        setVerificationSuccessful(true);
        // Navigation will be handled by the useEffect hook
      } else if (mode === 'reset') {
        // For password reset flow - verify OTP and then navigate to reset password screen
        await resetPassword.verifyOTP(email, otp);
        setVerificationSuccessful(true);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    clearError();
    
    try {
      setCanResend(false);
      await sendOTP(email, mode);
      setTimeLeft(120); // Reset timer to 2 minutes
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (error) {
      console.error('Error resending OTP:', error);
      setCanResend(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // This is the key function that updates the OTP state
  const handleOTPFilled = (code: string) => {
    console.log('OTP filled with code:', code);
    // Immediately set the OTP state with the received code
    setOtp(code);
    
    // Add a direct console log to verify state update
    console.log('OTP state should now be:', code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Image source={require('../assets/images/wheaton.webp')} style={styles.logo} />
        
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit code sent to
        </Text>
        <Text style={styles.emailText}>{email}</Text>
        
        {authError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        ) : null}
        
        <OTPInput
          length={6}
          onCodeFilled={handleOTPFilled}
          autofocus={true}
        />
        
        <TouchableOpacity
          style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
          onPress={handleVerify}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in {formatTime(timeLeft)}
            </Text>
          )}
        </View>
      </ScrollView>
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
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timerText: {
    color: '#666',
    fontSize: 16,
  },
});