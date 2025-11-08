import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppColors } from '../../theme/colors';

interface OutlineButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  title,
  onPress,
  icon,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  style,
}) => {
  const { isDarkMode, borderRadius, spacing } = useTheme();

  const getBorderColor = () => {
    switch (variant) {
      case 'primary':
        return AppColors.accent;
      case 'secondary':
        return AppColors.mediumGrey;
      case 'danger':
        return AppColors.error;
      default:
        return AppColors.accent;
    }
  };

  const getTextColor = () => {
    if (disabled) return AppColors.mediumGrey;
    return getBorderColor();
  };

  const getBackgroundColor = () => {
    if (disabled) return 'transparent';
    const color = getBorderColor();
    return isDarkMode
      ? color.replace('#', 'rgba(').replace(/(.{2})(.{2})(.{2})/, '$1, $2, $3, 0.15)')
      : color.replace('#', 'rgba(').replace(/(.{2})(.{2})(.{2})/, '$1, $2, $3, 0.1)');
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: disabled ? AppColors.buttonDisabled : getBorderColor(),
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : undefined,
      height: 48,
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      color: getTextColor(),
      marginLeft: icon ? spacing.sm : 0,
    },
    icon: {
      fontSize: 18,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
