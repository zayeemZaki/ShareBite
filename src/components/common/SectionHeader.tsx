import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SectionHeaderProps {
  title: string;
  count?: number;
  subtitle?: string;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  count, 
  subtitle,
  style 
}) => {
  const { colors, typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    leftSection: {
      flex: 1,
    },
    title: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      marginTop: spacing.xs / 2,
    },
    count: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      backgroundColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      overflow: 'hidden',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {count !== undefined && <Text style={styles.count}>{count}</Text>}
    </View>
  );
};
