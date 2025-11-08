/**
 * ShareBite Professional Design System
 * Complete reference of all design tokens
 * 
 * Use this as a quick reference when building new components
 */

// ============================================
// COLORS
// ============================================

export const COLORS = {
  // Core Neutrals
  WHITE: '#FFFFFF',
  OFF_WHITE: '#F5F5F7',
  LIGHT_GREY: '#E5E5E7',
  MEDIUM_GREY: '#6E6E73',
  DARK_GREY: '#1D1D1F',
  
  // Accent (Deep Teal)
  ACCENT: '#2C5F6F',
  ACCENT_LIGHT: '#3A7A8F',
  ACCENT_DARK: '#1F4A57',
  
  // Semantic
  SUCCESS: '#2D7A4F',
  ERROR: '#A84848',
  WARNING: '#B8860B',
  INFO: '#2C5F6F',
};

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  // Font Sizes
  CAPTION: 12,
  BODY: 14,
  BODY_LARGE: 16,
  H3: 18,
  H2: 24,
  H1: 32,
  
  // Font Weights
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  
  // Line Heights
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.6,
};

// ============================================
// SPACING (8pt Grid)
// ============================================

export const SPACING = {
  XXS: 4,   // 0.5 unit
  XS: 8,    // 1 unit
  SM: 16,   // 2 units
  MD: 24,   // 3 units
  LG: 32,   // 4 units
  XL: 40,   // 5 units
  XXL: 48,  // 6 units
  XXXL: 64, // 8 units
};

// ============================================
// BORDER RADIUS
// ============================================

export const RADIUS = {
  NONE: 0,
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  FULL: 999,
};

// ============================================
// ICON SIZES
// ============================================

export const ICON_SIZES = {
  XS: 16,
  SM: 20,
  MD: 24,   // Recommended default
  LG: 32,
  XL: 48,
};

// ============================================
// BUTTON HEIGHTS
// ============================================

export const BUTTON_HEIGHTS = {
  SM: 40,
  MD: 48,   // Recommended default
  LG: 56,
};

// ============================================
// SHADOWS
// ============================================

export const SHADOWS = {
  NONE: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  MD: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  LG: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

// ============================================
// COMMON COMPONENT STYLES
// ============================================

export const COMPONENT_STYLES = {
  // Primary Button
  BUTTON_PRIMARY: {
    backgroundColor: COLORS.ACCENT,
    height: BUTTON_HEIGHTS.MD,
    paddingHorizontal: SPACING.MD,
    borderRadius: RADIUS.SM,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  BUTTON_PRIMARY_TEXT: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.BODY_LARGE,
    fontWeight: TYPOGRAPHY.MEDIUM,
  },
  
  // Secondary Button
  BUTTON_SECONDARY: {
    backgroundColor: COLORS.OFF_WHITE,
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
    height: BUTTON_HEIGHTS.MD,
    paddingHorizontal: SPACING.MD,
    borderRadius: RADIUS.SM,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  BUTTON_SECONDARY_TEXT: {
    color: COLORS.ACCENT,
    fontSize: TYPOGRAPHY.BODY_LARGE,
    fontWeight: TYPOGRAPHY.MEDIUM,
  },
  
  // Card
  CARD: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    padding: SPACING.SM,
    ...SHADOWS.SM,
  },
  
  // Input Field
  INPUT: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: RADIUS.SM,
    height: BUTTON_HEIGHTS.MD,
    paddingHorizontal: SPACING.SM,
    fontSize: TYPOGRAPHY.BODY_LARGE,
    color: COLORS.DARK_GREY,
  },
  INPUT_FOCUSED: {
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
  },
  
  // Text Styles
  H1: {
    fontSize: TYPOGRAPHY.H1,
    fontWeight: TYPOGRAPHY.SEMIBOLD,
    color: COLORS.DARK_GREY,
    lineHeight: TYPOGRAPHY.H1 * TYPOGRAPHY.TIGHT,
  },
  H2: {
    fontSize: TYPOGRAPHY.H2,
    fontWeight: TYPOGRAPHY.SEMIBOLD,
    color: COLORS.DARK_GREY,
    lineHeight: TYPOGRAPHY.H2 * TYPOGRAPHY.TIGHT,
  },
  H3: {
    fontSize: TYPOGRAPHY.H3,
    fontWeight: TYPOGRAPHY.MEDIUM,
    color: COLORS.DARK_GREY,
    lineHeight: TYPOGRAPHY.H3 * TYPOGRAPHY.NORMAL,
  },
  BODY: {
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.REGULAR,
    color: COLORS.DARK_GREY,
    lineHeight: TYPOGRAPHY.BODY * TYPOGRAPHY.NORMAL,
  },
  BODY_SECONDARY: {
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.REGULAR,
    color: COLORS.MEDIUM_GREY,
    lineHeight: TYPOGRAPHY.BODY * TYPOGRAPHY.NORMAL,
  },
  CAPTION: {
    fontSize: TYPOGRAPHY.CAPTION,
    fontWeight: TYPOGRAPHY.REGULAR,
    color: COLORS.MEDIUM_GREY,
    lineHeight: TYPOGRAPHY.CAPTION * TYPOGRAPHY.NORMAL,
  },
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// Example 1: Using in a component
import { COLORS, SPACING, RADIUS, COMPONENT_STYLES } from './DESIGN_TOKENS';

const MyButton = () => (
  <TouchableOpacity style={COMPONENT_STYLES.BUTTON_PRIMARY}>
    <Text style={COMPONENT_STYLES.BUTTON_PRIMARY_TEXT}>Click Me</Text>
  </TouchableOpacity>
);

// Example 2: Creating custom styles
const customCard = {
  ...COMPONENT_STYLES.CARD,
  padding: SPACING.MD,
  marginBottom: SPACING.SM,
};

// Example 3: Typography
<Text style={COMPONENT_STYLES.H1}>Main Heading</Text>
<Text style={COMPONENT_STYLES.BODY}>Body text goes here</Text>
<Text style={COMPONENT_STYLES.CAPTION}>Small caption text</Text>

// Example 4: Colors
<View style={{ backgroundColor: COLORS.OFF_WHITE }}>
  <Text style={{ color: COLORS.DARK_GREY }}>Dark text on light background</Text>
</View>

// Example 5: Spacing (8pt grid)
<View style={{ 
  padding: SPACING.SM,      // 16px
  marginBottom: SPACING.MD, // 24px
  gap: SPACING.XS           // 8px
}}>

*/
