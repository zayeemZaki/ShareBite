import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof theme.colors.light;
  typography: typeof theme.typography;
  spacing: typeof theme.spacing;
  borderRadius: typeof theme.borderRadius;
  shadows: typeof theme.shadows.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
      }
    };

    loadThemePreference();
  }, []);

  const toggleDarkMode = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
    }
  };

  const colors = isDarkMode ? theme.colors.dark : theme.colors.light;
  const shadows = isDarkMode ? theme.shadows.dark : theme.shadows.light;

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    colors,
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
