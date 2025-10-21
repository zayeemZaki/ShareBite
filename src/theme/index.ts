import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const theme = {
  colors: {
    light: {
      primary: '#6366f1', // vibrant indigo
      secondary: '#ec4899', // pink
      accent: '#f59e0b', // amber
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceVariant: '#e2e8f0',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      textTertiary: '#94a3b8',
      border: '#e2e8f0',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      successLight: '#d1fae5',
      warningLight: '#fef3c7',
      dangerLight: '#fee2e2',
      gradientStart: '#6366f1',
      gradientEnd: '#ec4899',
    },
    dark: {
      primary: '#818cf8', // lighter indigo for dark
      secondary: '#f472b6', // lighter pink
      accent: '#fbbf24', // lighter amber
      background: '#0f172a',
      surface: '#1e293b',
      surfaceVariant: '#334155',
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textTertiary: '#94a3b8',
      border: '#334155',
      error: '#f87171',
      success: '#34d399',
      warning: '#fbbf24',
      info: '#60a5fa',
      successLight: '#065f46',
      warningLight: '#92400e',
      dangerLight: '#991b1b',
      gradientStart: '#818cf8',
      gradientEnd: '#f472b6',
    },
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    sizes: {
      small: 12,
      regular: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 24,
    },
    fontWeightRegular: '400' as const,
    fontWeightMedium: '500' as const,
    fontWeightBold: '700' as const,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  gradients: {
    primary: ['#6366f1', '#8b5cf6'],
    secondary: ['#ec4899', '#f97316'],
    accent: ['#f59e0b', '#eab308'],
    surface: ['#f8fafc', '#e2e8f0'],
  },
};

export const createStyles = (
  isDarkMode: boolean,
  styles: Record<string, ViewStyle | TextStyle | ImageStyle>
) => {
  const processedStyles: Record<string, any> = {};

  for (const [key, style] of Object.entries(styles)) {
    processedStyles[key] = style;
  }

  return StyleSheet.create(processedStyles);
};
