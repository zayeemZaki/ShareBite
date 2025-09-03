import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

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
  isDarkMode = false,
}) => {
  const { logout } = useAuth();

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {showLogout && (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#444' : '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 4,
  },
  logoutButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
  },
});
