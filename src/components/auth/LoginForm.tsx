import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';
import { LoginCredentials } from '../../types/auth';
import { useCustomAlert } from '../../hooks/useCustomAlert';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  isDarkMode?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  isDarkMode = false,
}) => {
  const { login, resetPassword, state } = useAuth();
  const { colors, spacing, typography, borderRadius } = useTheme();
  const { showSuccessAlert, showErrorAlert, AlertComponent } = useCustomAlert();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const styles = getStyles(isDarkMode, colors, spacing, typography, borderRadius);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      showErrorAlert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(credentials);
    } catch (error: any) {
      showErrorAlert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      showErrorAlert('Error', 'Please enter your email address first');
      return;
    }

    try {
      await resetPassword(credentials.email);
      showSuccessAlert(
        'Password Reset',
        'Password reset email sent! Check your inbox and follow the instructions.'
      );
    } catch (error: any) {
      showErrorAlert('Error', error.message || 'Failed to send password reset email');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Image
            source={require('../../../ShareBiteLogo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            value={credentials.email}
            onChangeText={(email) => setCredentials({ ...credentials, email })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
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

          {state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          )}

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
      {AlertComponent}
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, spacing: any, typography: any, borderRadius: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: spacing.md,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.fontWeights?.semibold || '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    fontSize: typography.sizes.bodyLarge,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    minHeight: 48,
  },
  loginButton: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  forgotPasswordButton: {
    marginBottom: spacing.md,
  },
  switchButton: {
    marginTop: spacing.xs,
  },
});
