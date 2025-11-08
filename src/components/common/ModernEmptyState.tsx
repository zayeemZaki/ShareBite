import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { LucideIcon } from 'lucide-react-native';

interface ModernEmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  style?: ViewStyle;
  iconSize?: number;
}

/**
 * ModernEmptyState - A reusable empty state component with Lucide icons
 * Used to show when lists or sections have no data
 */
export const ModernEmptyState: React.FC<ModernEmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  subtitle,
  style,
  iconSize = 40
}) => {
  const { isDarkMode, colors, spacing, typography, borderRadius } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
      paddingHorizontal: spacing.lg,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: typography.sizes.h3,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: spacing.md,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Icon size={iconSize} color={colors.textSecondary} strokeWidth={2} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};
