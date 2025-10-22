import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'error';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
}) => {
  const { colors, borderRadius, spacing, typography, shadows } = useTheme();

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      ...shadows,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
        };
      default:
        return baseStyle; // primary will use gradient
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseText: TextStyle = {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseText,
          color: colors.primary,
        };
      case 'error':
      case 'primary':
      default:
        return {
          ...baseText,
          color: colors.surface,
        };
    }
  };

  const buttonStyle = getButtonStyle();
  const textStyleFinal = getTextStyle();

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        variant === 'primary' && !disabled && { backgroundColor: colors.primary },
        disabled && { backgroundColor: colors.textTertiary, borderColor: colors.textTertiary },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={[
        textStyleFinal,
        disabled && { color: colors.textSecondary },
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
