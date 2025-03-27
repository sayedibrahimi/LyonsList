// client/app/auth/signup.tsx
// Purpose: Signup screen component
// Description: This file contains the SignupScreen component which allows users to create an account by entering their first name, last name, email, and password. The component also includes validation logic to ensure that all fields are filled out and that the email is in the correct format. If the user successfully signs up, they are redirected to the OTP verification screen.
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

interface OTPProps {
  email: string;
}

const OTPVerification = ({ email }: OTPProps) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const { verifyOTP, error: authError, clearError } = useAuth();
  const router = useRouter();

  const handleVerify = async () => {
    setVerificationError('');
    clearError();
    
    if (!otp) {
      setVerificationError('Please enter the OTP sent to your email');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await verifyOTP(email, otp);
      // Navigate to home on success
      router.replace('/(tabs)/search');
    } catch (error) {
      console.error('OTP verification error:', error);
      // Error will be handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Enter the code sent to {email}</Text>
      
      {verificationError ? <Text style={styles.errorText}>{verificationError}</Text> : null}
      {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
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
    </View>
  );
};

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  
  const router = useRouter();
  const { register, error: authError, clearError } = useAuth();

  const handleSignup = async () => {
    // Reset error messages
    setFormError('');
    clearError();
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      setFormError('All fields are required');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    // Password match validation
    if (password !== passwordConfirm) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Password strength validation
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register({ firstName, lastName, email, password });
      setShowOtpScreen(true);
    } catch (error) {
      console.error('Registration error:', error);
      // Error will be handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  if (showOtpScreen) {
    return <OTPVerification email={email} />;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={require('../../assets/images/wheaton.webp')} style={styles.logo} />
          <Text style={styles.title}>Create Account</Text>
          
          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
          
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFormError('');
              clearError();
            }}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setFormError('');
              clearError();
            }}
          />
          
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
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setFormError('');
              clearError();
            }}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={passwordConfirm}
            onChangeText={(text) => {
              setPasswordConfirm(text);
              setFormError('');
              clearError();
            }}
          />
          
          <TouchableOpacity 
            style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
            onPress={handleSignup}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 5,
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
    marginTop: 10,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
});

export default SignupScreen;