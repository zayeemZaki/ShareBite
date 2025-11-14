import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface HeadingProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  style?: TextStyle;
  centered?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  variant = 'h1',
  style,
  centered = false,
}) => {
  const { colors, typography } = useTheme();

  const getFontSize = () => {
    switch (variant) {
      case 'h1': return 28;
      case 'h2': return 24;
      case 'h3': return 20;
      case 'h4': return 18;
      default: return 28;
    }
  };

  const styles = StyleSheet.create({
    heading: {
      fontSize: getFontSize(),
      fontWeight: typography.fontWeightBold || '700',
      color: colors.textPrimary,
      textAlign: centered ? 'center' : 'left',
      lineHeight: getFontSize() * 1.3,
    },
  });

  return (
    <Text 
      style={[styles.heading, style]} 
      numberOfLines={style?.numberOfLines || (variant === 'h1' ? 2 : 3)}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
};

interface BodyTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  style?: TextStyle;
  centered?: boolean;
}

export const BodyText: React.FC<BodyTextProps> = ({ 
  children, 
  variant = 'primary',
  style,
  centered = false,
}) => {
  const { colors, typography } = useTheme();

  const getColor = () => {
    switch (variant) {
      case 'primary': return colors.textPrimary;
      case 'secondary': return colors.textSecondary;
      case 'tertiary': return colors.textSecondary;
      default: return colors.textPrimary;
    }
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: typography.sizes.regular || 14,
      color: getColor(),
      textAlign: centered ? 'center' : 'left',
      lineHeight: (typography.sizes.regular || 14) * 1.4,
    },
  });

  return (
    <Text 
      style={[styles.text, style]}
      numberOfLines={style?.numberOfLines}
      ellipsizeMode={style?.ellipsizeMode || 'tail'}
    >
      {children}
    </Text>
  );
};
