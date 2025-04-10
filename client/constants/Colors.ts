// client/constants/Colors.ts
// Purpose: This file defines a set of color constants used throughout the application. It includes primary brand colors and specific colors for light and dark modes, as well as shared status/alert colors.
// Description: The `Colors` object contains two main properties: `light` and `dark`, each of which holds color values for text, background, surface, tint, border, icon, and tab icons. Additionally, it includes shared status colors for success, error, warning, and info messages. This structure allows for easy access to color values based on the current theme (light or dark) and ensures consistency across the application.
// Primary brand colors
const brandBlue = '#007BFF';
const brandLightBlue = '#4a9eff';

// Light mode specific colors
const lightBackground = '#fff';
const lightSurfaceColor = '#f8f9fa';
const lightTextColor = '#11181C';
const lightSecondaryTextColor = '#687076';
const lightBorderColor = '#E4E7EB';
const lightIconColor = '#687076';

// Dark mode specific colors
const darkBackground = '#151718';
const darkSurfaceColor = '#1E2022';
const darkTextColor = '#ECEDEE';
const darkSecondaryTextColor = '#9BA1A6';
const darkBorderColor = '#2A2F33';
const darkIconColor = '#9BA1A6';

// Shared status/alert colors (same for both modes)
const successColor = '#28a745';
const errorColor = '#dc3545';
const warningColor = '#ffc107';
const infoColor = '#17a2b8';

export const Colors = {
  light: {
    text: lightTextColor,
    secondaryText: lightSecondaryTextColor,
    background: lightBackground,
    surface: lightSurfaceColor,
    tint: brandBlue,
    border: lightBorderColor,
    icon: lightIconColor,
    tabIconDefault: lightIconColor,
    tabIconSelected: brandBlue,
    
    // Status colors
    success: successColor,
    error: errorColor,
    warning: warningColor,
    info: infoColor,
  },
  dark: {
    text: darkTextColor,
    secondaryText: darkSecondaryTextColor,
    background: darkBackground,
    surface: darkSurfaceColor,
    tint: brandLightBlue,
    border: darkBorderColor,
    icon: darkIconColor,
    tabIconDefault: darkIconColor,
    tabIconSelected: brandLightBlue,
    
    // Status colors
    success: successColor,
    error: errorColor,
    warning: warningColor,
    info: infoColor,
  },
};
