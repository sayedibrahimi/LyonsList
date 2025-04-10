// components/ThemedText.tsx
// Purpose: This file defines a ThemedText component that applies text color based on the current theme (light or dark) in a React Native application. It uses the useTheme hook to determine the current theme and applies the appropriate text color.
// Description: The ThemedText component is a wrapper around the React Native Text component. It accepts additional props for light and dark text colors, allowing customization. The component uses the useTheme hook to determine the current theme and applies the appropriate text color. This ensures that the text color adapts to the user's theme preference or system settings.
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { isDarkTheme } = useTheme();
  
  const defaultTextColor = isDarkTheme
    ? Colors.dark.text
    : Colors.light.text;
  
  const color = isDarkTheme
    ? (darkColor || defaultTextColor)
    : (lightColor || defaultTextColor);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? [styles.link, { color: isDarkTheme ? '#4a9eff' : '#0a7ea4' }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
