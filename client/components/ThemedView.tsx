// components/ThemedView.tsx
// Purpose: This file defines a ThemedView component that applies a background color based on the current theme (light or dark) in a React Native application. It uses the useTheme hook to determine the current theme and applies the appropriate background color.
// Description: The ThemedView component is a wrapper around the React Native View component. It accepts additional props for light and dark background colors, allowing customization. The component uses the useTheme hook to determine the current theme and applies the appropriate background color. This ensures that the view's background color adapts to the user's theme preference or system settings.
import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { isDarkTheme } = useTheme();
  
  const defaultBackgroundColor = isDarkTheme 
    ? Colors.dark.background 
    : Colors.light.background;
  
  const backgroundColor = isDarkTheme 
    ? (darkColor || defaultBackgroundColor)
    : (lightColor || defaultBackgroundColor);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}