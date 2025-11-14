import { AppColors } from '../theme/colors';

/**
 * Design Tokens - Single source of truth for all design values
 */

// Typography - Professional, clean system
export const typography = {
  // Font family - Inter for maximum professionalism
  // Falls back to system fonts: SF Pro (iOS), Roboto (Android)
  fontFamily: {
    primary: 'System', // Will use platform defaults: Inter-like fonts
    heading: 'System',
    body: 'System',
  },
  
  // Font sizes - Clear hierarchy
  fontSizes: {
    caption: 12,      // Small labels, captions
    body: 14,         // Default body text
    bodyLarge: 16,    // Emphasized body text, buttons
    h3: 18,           // Card titles, small headers
    h2: 24,           // Section headers
    h1: 32,           // Screen titles, main headings
  },
  
  // Font weights - Use Medium/Semibold for hierarchy
  fontWeights: {
    regular: '400' as const,  // Body text
    medium: '500' as const,   // Button text, emphasized text
    semibold: '600' as const, // Headings, titles
  },
  
  // Line heights - Optimized for readability
  lineHeights: {
    tight: 1.2,    // Headings
    normal: 1.5,   // Body text
    relaxed: 1.6,  // Comfortable reading
  },
};

// Spacing - 8pt Grid System for consistency
export const spacing = {
  xxs: 4,   // 0.5 unit - minimal spacing
  xs: 8,    // 1 unit - tight spacing
  sm: 16,   // 2 units - compact spacing
  md: 24,   // 3 units - comfortable spacing
  lg: 32,   // 4 units - generous spacing
  xl: 40,   // 5 units - large spacing
  xxl: 48,  // 6 units - extra large spacing
  xxxl: 64, // 8 units - section spacing
};

// Border Radius - Subtle, modern rounding
export const borderRadius = {
  none: 0,
  xs: 4,    // Small elements (chips, tags)
  sm: 8,    // Buttons, inputs
  md: 12,   // Cards, containers
  lg: 16,   // Large cards, modals
  xl: 24,   // Extra large containers
  full: 999, // Circular elements
};

// Colors - Professional palette with deep teal accent
export const colors = {
  // Core colors
  white: AppColors.white,
  black: AppColors.darkGrey,
  
  // Accent color (Deep Teal)
  accent: AppColors.accent,
  accentLight: AppColors.accentLight,
  accentDark: AppColors.accentDark,
  
  // Status colors
  success: AppColors.success,
  error: AppColors.error,
  warning: AppColors.warning,
  info: AppColors.info,
  
  // Neutral greys - Professional scale with improved contrast
  grey50: '#FAFAFA',
  grey100: '#F5F5F7',
  grey200: '#E5E5E7',
  grey300: '#D1D1D6',
  grey400: '#C7C7CC',
  grey500: '#808080',
  grey600: '#4A4A4A',
  grey700: '#3A3A3C',
  grey800: '#2A2A2C',
  grey900: '#000000',
  
  // Transparent overlays
  overlay: AppColors.overlay,
  overlayLight: AppColors.overlayLight,
  overlayDark: AppColors.overlayDark,
  
  // Tints for backgrounds/highlights
  accentTint: AppColors.accentTint,
  successTint: AppColors.successTint,
  errorTint: AppColors.errorTint,
  warningTint: AppColors.warningTint,
};

// Shadows - Subtle, minimal depth (prefer borders when possible)
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Subtle lift - for cards
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  // Clear separation - for floating elements
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  // Elevated - for modals, popovers
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Z-index
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
};

// Animation durations (in milliseconds)
export const animations = {
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  slowest: 500,
};

// Breakpoints (for responsive design if needed)
export const breakpoints = {
  xs: 320,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Icon sizes - Consistent with Lucide defaults
export const iconSizes = {
  xs: 16,   // Compact areas
  sm: 20,   // Small buttons, inline text
  md: 24,   // Standard UI icons (Lucide default)
  lg: 32,   // Featured icons
  xl: 48,   // Large illustrations
  xxl: 64,  // Hero icons
};

// Button sizes - Minimum 48px height for touch targets
export const buttonSizes = {
  sm: {
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  md: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  lg: {
    height: 56,
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 16,
    fontWeight: '500' as const,
  },
};

export const designTokens = {
  typography,
  spacing,
  borderRadius,
  colors,
  shadows,
  zIndex,
  animations,
  breakpoints,
  iconSizes,
  buttonSizes,
};

export default designTokens;
