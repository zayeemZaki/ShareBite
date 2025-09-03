import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { UserRole } from '../../types/auth';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  const roles = [
    {
      value: 'restaurant' as UserRole,
      title: '🍽️ Restaurant',
      description: 'Share surplus food from your restaurant',
    },
    {
      value: 'shelter' as UserRole,
      title: '🏠 Shelter',
      description: 'Request food for your shelter residents',
    },
    {
      value: 'volunteer' as UserRole,
      title: '🚗 Volunteer',
      description: 'Help deliver food from restaurants to shelters',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I am a...</Text>
      {roles.map((role) => (
        <TouchableOpacity
          key={role.value}
          style={[
            styles.roleOption,
            selectedRole === role.value && styles.selectedRole,
          ]}
          onPress={() => onRoleSelect(role.value)}
        >
          <Text style={[
            styles.roleTitle,
            selectedRole === role.value && styles.selectedRoleTitle,
          ]}>
            {role.title}
          </Text>
          <Text style={[
            styles.roleDescription,
            selectedRole === role.value && styles.selectedRoleDescription,
          ]}>
            {role.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleOption: {
    borderWidth: 2,
    borderColor: isDarkMode ? '#444' : '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
  },
  selectedRole: {
    borderColor: '#3498db',
    backgroundColor: '#3498db10',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 4,
  },
  selectedRoleTitle: {
    color: '#3498db',
  },
  roleDescription: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
  },
  selectedRoleDescription: {
    color: isDarkMode ? '#3498db' : '#2980b9',
  },
});
