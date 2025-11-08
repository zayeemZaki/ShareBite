import { useTheme } from '../context/ThemeContext';

/**
 * Hook to get all theme values needed for styling
 * Reduces boilerplate in components
 */
export const useThemedStyles = () => {
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  
  return {
    colors,
    typography,
    borderRadius,
    spacing,
    shadows,
    isDarkMode,
  };
};

/**
 * Common style utilities
 */
export const commonStyles = {
  // Shadow presets
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  shadowHeavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Flex utilities
  flexRow: {
    flexDirection: 'row' as const,
  },
  flexRowCenter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  flexRowBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  flexCenter: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};
