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
  const { login, state } = useAuth();
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
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const fillDemoCredentials = (role: 'restaurant' | 'shelter' | 'volunteer') => {
    const demoCredentials = {
      restaurant: { email: 'restaurant@test.com', password: 'password' },
      shelter: { email: 'shelter@test.com', password: 'password' },
      volunteer: { email: 'volunteer@test.com', password: 'password' },
    };
    setCredentials(demoCredentials[role]);
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

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Access:</Text>
            <View style={styles.demoButtons}>
              <Button
                title="Restaurant"
                onPress={() => fillDemoCredentials('restaurant')}
                variant="secondary"
                style={styles.demoButton}
              />
              <Button
                title="Shelter"
                onPress={() => fillDemoCredentials('shelter')}
                variant="secondary"
                style={styles.demoButton}
              />
              <Button
                title="Volunteer"
                onPress={() => fillDemoCredentials('volunteer')}
                variant="secondary"
                style={styles.demoButton}
              />
            </View>
          </View>

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
  demoSection: {
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoButton: {
    flex: 1,
  },
  switchButton: {
    marginTop: 8,
  },
});
