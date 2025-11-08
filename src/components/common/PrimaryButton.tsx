import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppColors } from '../../theme/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  icon,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
}) => {
  const { isDarkMode, borderRadius, spacing, typography } = useTheme();

  const getBackgroundColor = () => {
    if (disabled || loading) return AppColors.buttonDisabled;
    switch (variant) {
      case 'primary':
        return AppColors.accent;
      case 'secondary':
        return AppColors.buttonSecondary;
      case 'danger':
        return AppColors.buttonDanger;
      default:
        return AppColors.accent;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'medium':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.sizes.caption;
      case 'medium':
        return typography.sizes.bodyLarge;
      case 'large':
        return typography.sizes.h3;
      default:
        return typography.sizes.bodyLarge;
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      borderRadius: borderRadius.md,
      ...getPadding(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: disabled || loading ? 0 : 0.15,
      shadowRadius: 4,
      elevation: disabled || loading ? 0 : 3,
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : undefined,
      minHeight: size === 'small' ? 32 : size === 'large' ? 48 : 40,
      ...(variant === 'secondary' && {
        borderWidth: 1,
        borderColor: AppColors.accent,
      }),
    },
    iconCircle: {
      width: size === 'small' ? 18 : 20,
      height: size === 'small' ? 18 : 20,
      borderRadius: size === 'small' ? 9 : 10,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.xs,
    },
    icon: {
      fontSize: size === 'small' ? 10 : 12,
      color: variant === 'secondary' ? AppColors.accent : '#FFFFFF',
    },
    text: {
      fontSize: getFontSize(),
      fontWeight: typography.fontWeights?.medium || '500',
      color: disabled || loading 
        ? AppColors.mediumGrey 
        : variant === 'secondary' 
          ? AppColors.accent 
          : '#FFFFFF',
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? AppColors.accent : "#ffffff"} size="small" />
      ) : (
        <>
          {icon && (
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
