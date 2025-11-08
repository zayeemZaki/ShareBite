// Professional, minimalist color palette for ShareBite
// Based on neutral design colors with a sophisticated deep teal accent
export const AppColors = {
  // Core Neutrals
  white: '#FFFFFF',           // Pure White - primary backgrounds
  offWhite: '#F5F5F7',        // Light Grey - secondary backgrounds, cards
  lightGrey: '#E5E5E7',       // Subtle Grey - borders, dividers
  mediumGrey: '#6E6E73',      // Medium Grey - secondary text, labels
  darkGrey: '#1D1D1F',        // Off-Black - primary text, headings
  
  // Accent Color - Deep Teal (used sparingly)
  accent: '#2C5F6F',          // Deep Teal - buttons, links, active states
  accentLight: '#3A7A8F',     // Lighter teal - hover states
  accentDark: '#1F4A57',      // Darker teal - pressed states
  
  // Semantic Colors (subtle, professional)
  success: '#2D7A4F',         // Deep Forest Green
  error: '#A84848',           // Muted Red
  warning: '#B8860B',         // Dark Goldenrod
  info: '#2C5F6F',            // Deep Teal (same as accent)
  
  // Neutral colors (light mode)
  light: {
    background: '#FFFFFF',    // Pure white
    surface: '#F5F5F7',       // Light grey for cards
    surfaceVariant: '#FAFAFA', // Subtle variation
    border: '#E5E5E7',        // Subtle border
    divider: '#E5E5E7',       // Divider lines
    textPrimary: '#1D1D1F',   // Off-black for text
    textSecondary: '#6E6E73', // Medium grey for labels
    textTertiary: '#9E9EA3',  // Light grey for hints
    shadow: '#000000',
  },
  
  // Neutral colors (dark mode)
  dark: {
    background: '#000000',    // Pure black (OLED-friendly)
    surface: '#1C1C1E',       // Dark grey surface
    surfaceVariant: '#2C2C2E', // Elevated surface
    border: '#38383A',        // Subtle border
    divider: '#38383A',       // Divider lines
    textPrimary: '#F5F5F7',   // Off-white for text
    textSecondary: '#98989D', // Medium grey for labels
    textTertiary: '#636366',  // Dark grey for hints
    shadow: '#000000',
  },
  
  // Status-specific semantic colors
  available: '#2D7A4F',       // Success green - food available
  approved: '#2D7A4F',        // Success green - request approved
  pending: '#B8860B',         // Warning gold - pending request
  declined: '#A84848',        // Error red - request declined
  expired: '#6E6E73',         // Medium grey - expired item
  pickedUp: '#2C5F6F',        // Accent teal - picked up
  
  // Button colors
  buttonPrimary: '#2C5F6F',   // Deep Teal
  buttonSecondary: '#F5F5F7', // Light grey (with teal border/text)
  buttonDanger: '#A84848',    // Muted red
  buttonDisabled: '#E5E5E7',  // Subtle grey
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Accent tints (for backgrounds, highlights)
  accentTint: 'rgba(44, 95, 111, 0.08)',
  successTint: 'rgba(45, 122, 79, 0.08)',
  errorTint: 'rgba(168, 72, 72, 0.08)',
  warningTint: 'rgba(184, 134, 11, 0.08)',
};

// Helper function to get themed colors based on dark mode
export const getThemedColors = (isDarkMode: boolean) => ({
  // Core colors
  white: AppColors.white,
  black: isDarkMode ? AppColors.dark.background : AppColors.darkGrey,
  
  // Accent colors with variants
  accent: AppColors.accent,
  accentLight: AppColors.accentLight,
  accentDark: AppColors.accentDark,
  accentTint: AppColors.accentTint,
  
  // Mode-specific colors
  background: isDarkMode ? AppColors.dark.background : AppColors.light.background,
  surface: isDarkMode ? AppColors.dark.surface : AppColors.light.surface,
  surfaceVariant: isDarkMode ? AppColors.dark.surfaceVariant : AppColors.light.surfaceVariant,
  border: isDarkMode ? AppColors.dark.border : AppColors.light.border,
  divider: isDarkMode ? AppColors.dark.divider : AppColors.light.divider,
  
  // Text colors
  textPrimary: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.textPrimary,
  textSecondary: isDarkMode ? AppColors.dark.textSecondary : AppColors.light.textSecondary,
  textTertiary: isDarkMode ? AppColors.dark.textTertiary : AppColors.light.textTertiary,
  
  // Overlay
  overlay: isDarkMode ? AppColors.overlayDark : AppColors.overlay,
  overlayLight: AppColors.overlayLight,
  shadow: AppColors.light.shadow,
  
  // Button colors
  buttonPrimary: AppColors.buttonPrimary,
  buttonPrimaryText: AppColors.white,
  buttonSecondary: AppColors.buttonSecondary,
  buttonSecondaryText: AppColors.accent,
  buttonSecondaryBorder: AppColors.accent,
  buttonDanger: AppColors.buttonDanger,
  buttonDangerText: AppColors.white,
  buttonDisabled: AppColors.buttonDisabled,
  buttonDisabledText: AppColors.mediumGrey,
  
  // Status colors
  success: AppColors.success,
  successTint: AppColors.successTint,
  error: AppColors.error,
  errorTint: AppColors.errorTint,
  warning: AppColors.warning,
  warningTint: AppColors.warningTint,
  info: AppColors.info,
  
  // Semantic colors for food/request status
  available: AppColors.available,
  approved: AppColors.approved,
  pending: AppColors.pending,
  declined: AppColors.declined,
  expired: AppColors.expired,
  pickedUp: AppColors.pickedUp,
  requested: AppColors.pending, // Alias for backward compatibility
});
