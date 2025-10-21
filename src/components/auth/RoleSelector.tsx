import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { UserRole } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  roleOption: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  selectedRole: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  selectedRoleTitle: {
    color: colors.primary,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedRoleDescription: {
    color: colors.primary,
  },
});
