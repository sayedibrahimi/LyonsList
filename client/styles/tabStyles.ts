// styles/tabStyles.ts
// Purpose: This code defines a set of styles for a tab component in a React Native application. It uses the `StyleSheet` API from React Native to create styles that can be applied to various elements within the tab, such as the header, content area, input fields, buttons, and placeholder content. The styles are designed to adapt based on the current color scheme (light or dark) of the application.
// Description: The `createTabStyles` function generates styles based on the provided color scheme (light or dark). It uses the `Colors` object to get the appropriate colors for the background, text, and other elements. The styles include properties for padding, margin, border, and background color, ensuring that the tab component looks consistent and visually appealing across different themes. The styles are then exported for use in other components.
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing, fontSize } from './theme';
import { getStatusBarHeight } from '../utils/statusBarHelper';

// Get the status bar height
const statusBarHeight = getStatusBarHeight();

// Function to create dynamic tab styles based on the color scheme
export const createTabStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? statusBarHeight : StatusBar.currentHeight || 0,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colorScheme === 'dark' ? colors.surface : colors.background,
    },
    headerTitle: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.text,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
      backgroundColor: colors.background,
    },
    input: {
      width: '100%',
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      backgroundColor: colorScheme === 'dark' ? colors.surface : colors.background,
      color: colors.text,
    },
    button: {
      width: '100%',
      padding: spacing.md,
      backgroundColor: colors.tint,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: spacing.sm,
    },
    buttonText: {
      color: '#fff',
      fontSize: fontSize.md,
      fontWeight: 'bold',
    },
    placeholderContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
      marginVertical: spacing.lg,
      backgroundColor: colorScheme === 'dark' ? colors.surface : '#f0f0f0',
      borderRadius: 10,
      minHeight: 200,
    },
    placeholderText: {
      fontSize: fontSize.lg,
      color: colors.secondaryText,
    },
  });
};

// For backward compatibility, export default light mode styles
export const tabStyles = createTabStyles('light');