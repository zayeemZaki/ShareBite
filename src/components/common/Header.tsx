import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  title: string;
  showLogout?: boolean;
  onBack?: () => void;
  isDarkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogout = false,
  onBack,
}) => {
  const { logout } = useAuth();
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}

      {/* App Logo on the left */}
      <Image
        source={require('../../../ShareBiteLogo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{title}</Text>
      
      {showLogout && (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...shadows,
      borderRadius: borderRadius.md,
    },
    logo: {
      width: 40,
      height: 40,
      marginRight: spacing.sm,
    },
    title: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 4 : 2,
      elevation: isDarkMode ? 4 : 2,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
    },
    logoutButton: {
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.error,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 4 : 2,
      elevation: isDarkMode ? 4 : 2,
    },
    logoutButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
  });
