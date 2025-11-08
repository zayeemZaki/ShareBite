import { ViewStyle, TextStyle } from 'react-native';
import { AppColors } from '../theme/colors';

/**
 * Common Shadow Styles
 */
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,
  
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  } as ViewStyle,
  
  extraHeavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
};

/**
 * Common Layout Styles
 */
export const layout = {
  flexRow: {
    flexDirection: 'row' as const,
  },
  
  flexRowCenter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  flexRowBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  
  flexCenter: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  flexColumn: {
    flexDirection: 'column' as const,
  },
  
  flex1: {
    flex: 1,
  },
};

/**
 * Common Button Styles
 */
export const buttonStyles = {
  primary: (isDarkMode: boolean) => ({
    backgroundColor: AppColors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 40,
    ...shadows.light,
  } as ViewStyle),
  
  secondary: (isDarkMode: boolean) => ({
    backgroundColor: AppColors.buttonSecondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: AppColors.accent,
    minHeight: 40,
    ...shadows.light,
  } as ViewStyle),
  
  danger: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'rgba(90, 56, 37, 0.15)' : 'rgba(90, 56, 37, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: isDarkMode ? 1.5 : 0,
    borderColor: isDarkMode ? 'rgba(90, 56, 37, 0.3)' : 'transparent',
  } as ViewStyle),
  
  text: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    textAlign: 'center' as const,
  } as TextStyle,
};

/**
 * Common Card Styles
 */
export const cardStyles = {
  base: (isDarkMode: boolean, surfaceColor: string) => ({
    backgroundColor: surfaceColor,
    borderRadius: 20,
    padding: 16,
    ...shadows.medium,
  } as ViewStyle),
  
  elevated: (isDarkMode: boolean, surfaceColor: string) => ({
    backgroundColor: surfaceColor,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.4 : 0.1,
    shadowRadius: isDarkMode ? 8 : 6,
    elevation: isDarkMode ? 8 : 4,
  } as ViewStyle),
};

/**
 * Common Input Styles
 */
export const inputStyles = {
  base: (isDarkMode: boolean, surfaceColor: string, borderColor: string) => ({
    backgroundColor: surfaceColor,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: borderColor,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  } as ViewStyle),
  
  focused: {
    borderColor: AppColors.accent,
    borderWidth: 2,
  } as ViewStyle,
};

/**
 * Common Badge Styles
 */
export const badgeStyles = {
  base: (backgroundColor: string) => ({
    backgroundColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center' as const,
  } as ViewStyle),
  
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold' as const,
  } as TextStyle,
};

/**
 * Common Icon Circle Styles
 */
export const iconCircleStyles = {
  small: (backgroundColor: string) => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle),
  
  medium: (backgroundColor: string) => ({
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle),
  
  large: (backgroundColor: string) => ({
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle),
  
  extraLarge: (backgroundColor: string) => ({
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle),
};

/**
 * Common Spacing Values
 */
export const commonSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

/**
 * Common Border Radius Values
 */
export const commonBorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};
