import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  useColorScheme,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const AccountSettings: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { state, logout } = useAuth();
  const styles = getStyles(isDarkMode);

  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [phone, setPhone] = useState(state.user?.phone || '');
  const [address, setAddress] = useState(state.user?.address || '');

  const handleSave = () => {
    // TODO: Implement save functionality
    Alert.alert('Success', 'Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // TODO: Implement delete account functionality
          Alert.alert('Account Deleted', 'Your account has been deleted.');
          logout();
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Account Settings"
        isDarkMode={isDarkMode}
        currentScreen="AccountSettings"
      />

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
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
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
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
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
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
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
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
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

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginBottom: 16,
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
