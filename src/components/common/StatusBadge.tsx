import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface StatusBadgeProps {
  text: string;
  backgroundColor: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ text, backgroundColor, style }) => {
  const { borderRadius, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    badge: {
      backgroundColor,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 999,
      minWidth: 80,
      alignItems: 'center',
    },
    text: {
      color: '#FFFFFF',
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightBold,
    },
  });

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
