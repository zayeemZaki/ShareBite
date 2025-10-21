import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AccountSettings: React.FC = () => {
  const { state, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors, typography, spacing, borderRadius } = useTheme();

  const styles = getStyles(isDarkMode, colors, typography, spacing, borderRadius);

  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [phone, setPhone] = useState(state.user?.phone || '');
  const [address, setAddress] = useState(state.user?.address || '');

  const handleSave = () => {
    Alert.alert('Success', 'Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Account Settings"
        currentScreen="AccountSettings"
      />

      {/* 🌙 Toggle Button */}
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleDarkMode}
      >
        <Text style={styles.themeToggleText}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your restaurant address"
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, spacing: any, borderRadius: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    themeToggle: {
      padding: spacing.sm,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
    },
    themeToggleText: {
      color: colors.textPrimary,
      fontWeight: typography.fontWeightMedium,
    },
    section: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    inputGroup: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      fontSize: typography.sizes.medium,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    saveButton: {
      marginBottom: spacing.md,
    },
    dangerButton: {
      backgroundColor: colors.error,
      padding: spacing.lg,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: '#ffffff',
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightBold,
    },
  });
