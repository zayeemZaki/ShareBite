import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withBorder?: boolean;
  borderColor?: string;
}

/**
 * ModernCard - A reusable card component with consistent styling
 * Includes optional left border accent for visual hierarchy
 */
export const ModernCard: React.FC<ModernCardProps> = ({ 
  children, 
  style, 
  withBorder = true,
  borderColor 
}) => {
  const { colors, borderRadius, spacing, shadows } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      ...shadows,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      ...(withBorder && {
        borderLeftWidth: 4,
        borderLeftColor: borderColor || colors.primary,
      }),
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
};
