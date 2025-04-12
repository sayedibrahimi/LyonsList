# LyonsList - Theme System

This document outlines the implementation of the dark mode and light mode theme system in the LyonsList app.

## Overview

The theme system provides a consistent way to style the UI components based on the user's preference (light or dark mode) or system settings. Users can toggle between themes in the Account screen.

## Core Components

### 1. Theme Context

Located in `context/ThemeContext.tsx`, the Theme Context manages the app's theme state. It provides:

- Current theme (`light` or `dark`)
- Theme mode (`light`, `dark`, or `system`)
- Helper methods to change the theme
- Theme persistence using AsyncStorage

### 2. Theme Hook

Located in `hooks/useTheme.ts`, this hook provides an easy way to access the theme context throughout the app.

### 3. Color Scheme Hook

Located in `hooks/useColorScheme.ts`, this overrides the default React Native hook to use our theme system.

### 4. Colors Constants

Located in `constants/Colors.ts`, this file defines color constants for both light and dark modes.

### 5. Themed Components

- `ThemedView`: A component that automatically applies the correct background color based on the current theme
- `ThemedText`: A component that automatically applies the correct text color based on the current theme

### 6. Theme Toggle Component

Located in `components/ThemeToggle.tsx`, this component allows users to toggle between themes.

## Usage

### 1. Accessing the Current Theme

```typescript
import { useTheme } from "../hooks/useTheme";

function MyComponent() {
  const { isDarkTheme, theme, themeMode } = useTheme();

  // Use isDarkTheme for conditional styling
  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <Text style={[styles.text, isDarkTheme && styles.darkText]}>
        Hello World
      </Text>
    </View>
  );
}
```

### 2. Using Themed Components

```typescript
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";

function MyComponent() {
  return (
    <ThemedView>
      <ThemedText>Automatically themed text</ThemedText>
    </ThemedView>
  );
}
```

### 3. Using the Theme Toggle

```typescript
import ThemeToggle from "../components/ThemeToggle";

function SettingsScreen() {
  return (
    <View>
      <ThemeToggle />
    </View>
  );
}
```

### 4. Using Dynamic Tab Styles

```typescript
import { createTabStyles } from "../styles/tabStyles";
import { useColorScheme } from "../hooks/useColorScheme";

function MyScreen() {
  const colorScheme = useColorScheme();
  const tabStyles = createTabStyles(colorScheme);

  return (
    <View style={tabStyles.container}>
      <Text style={tabStyles.headerTitle}>My Screen</Text>
    </View>
  );
}
```

## Design Guidelines

### Colors

All colors should come from the `Colors` object in `constants/Colors.ts`. This ensures consistency across the app and proper theming.

```typescript
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

function MyComponent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello World</Text>
    </View>
  );
}
```

### Styles

When defining styles that need to change with the theme:

1. Use conditional styles in your StyleSheet:

```typescript
const styles = StyleSheet.create({
  container: {
    // Base styles
  },
  darkContainer: {
    // Dark mode overrides
  },
});

// Usage
<View style={[styles.container, isDarkTheme && styles.darkContainer]} />;
```

2. Or use dynamic style creation:

```typescript
const createDynamicStyles = (isDark) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#1E2022" : "#fff",
      // Other styles
    },
  });

// Usage
const styles = createDynamicStyles(isDarkTheme);
<View style={styles.container} />;
```

## Theme Toggle in Account Screen

The theme toggle appears in the Account screen below the menu section and above the logout button. It provides:

1. A toggle switch for dark/light mode
2. A "Use Device Settings" option to follow the system theme
