import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  subtitle,
  style 
}) => {
  const { isDarkMode, colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.xl,
    },
    iconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDarkMode ? 'rgba(139, 134, 128, 0.1)' : 'rgba(139, 134, 128, 0.08)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    icon: {
      fontSize: 48,
      opacity: 0.6,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: spacing.lg,
      maxWidth: 280,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
      <Text style={styles.subtitle} numberOfLines={3} ellipsizeMode="tail">{subtitle}</Text>
    </View>
  );
};
