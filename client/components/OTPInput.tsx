// client/components/OTPInput.tsx
// Purpose: A React Native component for OTP input with auto-focus, paste support, and backspace handling.
// Description: This component allows users to input a one-time password (OTP) with a specified length. It handles auto-focusing on the next input, pasting multiple digits, and backspace navigation. The component also supports auto-fill from SMS on iOS and Android devices.
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Platform, 
  TouchableOpacity, 
  Text,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';

interface OTPInputProps {
  length?: number;
  onCodeFilled: (code: string) => void;
  autofocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  onCodeFilled,
  autofocus = true
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
    
    // Auto focus on the first input when component mounts
    if (autofocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [length, autofocus]);
  
  const handleChangeText = (text: string, index: number) => {
    // Only accept single digits
    if (!/^\d*$/.test(text)) return;
    
    const newCode = [...code];
    
    // Handle pasting multiple digits
    if (text.length > 1) {
      // User pasted a string of digits
      const pastedText = text.slice(0, length);
      const newCodeArray = pastedText.split('').slice(0, length);
      
      // Fill the code array
      for (let i = 0; i < length; i++) {
        newCode[i] = i < newCodeArray.length ? newCodeArray[i] : '';
      }
      
      setCode(newCode);
      
      // If the pasted code filled all inputs, call onCodeFilled directly
      if (pastedText.length >= length) {
        console.log('DIRECTLY calling onCodeFilled with:', pastedText.slice(0, length));
        onCodeFilled(pastedText.slice(0, length));
        Keyboard.dismiss();
      } else if (pastedText.length > 0) {
        // Focus the next input after the pasted text
        const nextIndex = Math.min(index + pastedText.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
      }
      
      return;
    }
    
    // Handle single digit input
    newCode[index] = text;
    setCode(newCode);
    
    // Auto focus on next input if a digit was entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === length - 1) {
      // Last digit entered, check if the code is complete
      const fullCode = newCode.join('');
      if (fullCode.length === length) {
        console.log('DIRECTLY calling onCodeFilled with completed code:', fullCode);
        onCodeFilled(fullCode);
        Keyboard.dismiss();
      }
    }
  };
  
  const handleKeyPress = (event: any, index: number) => {
    // Handle backspace to navigate to previous input
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // If current input is empty and backspace is pressed, focus on previous input
      inputRefs.current[index - 1]?.focus();
      
      // Also clear the previous input's value
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleFocus = (index: number) => {
    // On some devices, when you focus on an input, it doesn't select its text automatically
    // This ensures the input's content is selected when focused
    inputRefs.current[index]?.setNativeProps({
      selection: { start: 0, end: 1 }
    });
  };
  
  const clearAll = () => {
    setCode(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {Array(length).fill(0).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            value={code[index]}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            textContentType="oneTimeCode" // iOS auto-fill from SMS
            autoComplete="sms-otp" // Android auto-fill from SMS
          />
        ))}
      </View>
      <TouchableOpacity 
        onPress={clearAll} 
        style={styles.clearButton}
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    backgroundColor: '#f9f9f9',
  },
  clearButton: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  clearButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
});

export default OTPInput;