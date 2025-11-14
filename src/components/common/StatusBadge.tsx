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
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: 999,
      minWidth: 90,
      maxWidth: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#FFFFFF',
      fontSize: typography.sizes.small || 12,
      fontWeight: typography.fontWeightBold || '700',
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{text}</Text>
    </View>
  );
};
