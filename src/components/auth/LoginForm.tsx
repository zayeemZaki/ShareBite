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
import { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  isDarkMode?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  isDarkMode = false,
}) => {
  const { login, resetPassword, state } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const styles = getStyles(isDarkMode);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(credentials);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    try {
      await resetPassword(credentials.email);
      Alert.alert(
        'Password Reset',
        'Password reset email sent! Check your inbox and follow the instructions.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send password reset email');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back to ShareBite</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

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

          <Button
            title={state.isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={state.isLoading}
            style={styles.loginButton}
          />

          <Button
            title="Forgot Password?"
            onPress={handleForgotPassword}
            variant="secondary"
            style={styles.forgotPasswordButton}
          />

          <Button
            title="Don't have an account? Sign Up"
            onPress={onSwitchToRegister}
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
  loginButton: {
    marginBottom: 24,
  },
  forgotPasswordButton: {
    marginBottom: 24,
  },
  switchButton: {
    marginTop: 8,
  },
});
