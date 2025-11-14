import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Professional, minimalist theme based on neutral colors with deep teal accent
export const theme = {
  colors: {
    light: {
      // Accent - Deep Teal (used sparingly)
      primary: '#2C5F6F',
      primaryLight: '#3A7A8F',
      primaryDark: '#1F4A57',
      
      // Backgrounds
      background: '#FFFFFF',
      surface: '#F5F5F7',
      surfaceVariant: '#FAFAFA',
      
      // Text
      textPrimary: '#000000',
      textSecondary: '#4A4A4A',
      textTertiary: '#808080',
      
      // Borders & Dividers
      border: '#E5E5E7',
      divider: '#E5E5E7',
      
      // Status
      success: '#2D7A4F',
      error: '#A84848',
      warning: '#B8860B',
      info: '#2C5F6F',
      
      // Status tints (for backgrounds)
      successLight: '#EDF7F1',
      errorLight: '#F9EDED',
      warningLight: '#F9F5E8',
      
      // Buttons
      buttonPrimary: '#2C5F6F',
      buttonPrimaryText: '#FFFFFF',
      buttonSecondary: '#F5F5F7',
      buttonSecondaryText: '#2C5F6F',
      buttonSecondaryBorder: '#2C5F6F',
      buttonDisabled: '#E5E5E7',
      buttonDisabledText: '#9E9EA3',
    },
    dark: {
      // Accent - Deep Teal (lightened for dark mode)
      primary: '#3A7A8F',
      primaryLight: '#4A8FA4',
      primaryDark: '#2C5F6F',
      
      // Backgrounds
      background: '#000000',
      surface: '#1C1C1E',
      surfaceVariant: '#2C2C2E',
      
      // Text
      textPrimary: '#FFFFFF',
      textSecondary: '#AAAAB0',
      textTertiary: '#787880',
      
      // Borders & Dividers
      border: '#38383A',
      divider: '#38383A',
      
      // Status
      success: '#34A66A',
      error: '#C76060',
      warning: '#D4A722',
      info: '#3A7A8F',
      
      // Status tints (for dark backgrounds)
      successLight: '#1A3D2B',
      errorLight: '#3D2121',
      warningLight: '#3D3317',
      
      // Buttons
      buttonPrimary: '#3A7A8F',
      buttonPrimaryText: '#FFFFFF',
      buttonSecondary: '#2C2C2E',
      buttonSecondaryText: '#3A7A8F',
      buttonSecondaryBorder: '#3A7A8F',
      buttonDisabled: '#2C2C2E',
      buttonDisabledText: '#636366',
    },
  },
  typography: {
    fontFamily: {
      primary: 'System', // SF Pro on iOS, Roboto on Android
      heading: 'System',
      body: 'System',
    },
    sizes: {
      caption: 12,
      body: 14,
      bodyLarge: 16,
      h3: 18,
      h2: 24,
      h1: 32,
    },
    fontWeights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
    },
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const createStyles = (
  isDarkMode: boolean,
  styles: Record<string, ViewStyle | TextStyle | ImageStyle>
) => {
  const processedStyles: Record<string, any> = {};

  for (const [key, style] of Object.entries(styles)) {
    processedStyles[key] = style;
  }

  return StyleSheet.create(processedStyles);
};
