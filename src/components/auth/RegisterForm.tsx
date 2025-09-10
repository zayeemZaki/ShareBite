import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { RoleSelector } from './RoleSelector';
import { RegisterCredentials, UserRole } from '../../types/auth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  isDarkMode?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  isDarkMode = false,
}) => {
  const { register, state } = useAuth();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    name: '',
    role: 'restaurant',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const styles = getStyles(isDarkMode);

  const handleRegister = async () => {
    if (!credentials.email || !credentials.password || !credentials.name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (credentials.password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (credentials.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await register(credentials);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setCredentials({ ...credentials, role });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Join ShareBite</Text>
          <Text style={styles.subtitle}>Create your account to start sharing</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={isDarkMode ? '#95a5a6' : '#7f8c8d'}
            value={credentials.name}
            onChangeText={(name) => setCredentials({ ...credentials, name })}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? '#95a5a6' : '#7f8c8d'}
            value={credentials.email}
            onChangeText={(email) => setCredentials({ ...credentials, email })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? '#95a5a6' : '#7f8c8d'}
            value={credentials.password}
            onChangeText={(password) => setCredentials({ ...credentials, password })}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={isDarkMode ? '#95a5a6' : '#7f8c8d'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <RoleSelector
            selectedRole={credentials.role}
            onRoleSelect={handleRoleSelect}
          />

          <Button
            title={state.isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            disabled={state.isLoading}
            style={styles.registerButton}
          />

          <Button
            title="Already have an account? Sign In"
            onPress={onSwitchToLogin}
            variant="secondary"
            style={styles.switchButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
  },
  registerButton: {
    marginBottom: 16,
  },
  switchButton: {
    marginTop: 8,
  },
});
