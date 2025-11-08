import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = true }) => {
  const { isDarkMode, colors, borderRadius, spacing } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...(elevated && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDarkMode ? 0.4 : 0.1,
        shadowRadius: isDarkMode ? 8 : 6,
        elevation: isDarkMode ? 8 : 4,
      }),
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
};
