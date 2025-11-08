import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';
import { RegisterCredentials, UserRole } from '../../types/auth';
import { useCustomAlert } from '../../hooks/useCustomAlert';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  isDarkMode?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  isDarkMode = false,
}) => {
  const { register, state } = useAuth();
  const { colors, spacing, typography, borderRadius } = useTheme();
  const { showErrorAlert, AlertComponent } = useCustomAlert();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    name: '',
    role: 'restaurant',
    phone: '',
    address: '',
    restaurantName: '',
    restaurantType: '',
    shelterName: '',
    shelterType: '',
    capacity: undefined,
    operatingHours: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const styles = getStyles(isDarkMode, colors, spacing, typography, borderRadius);

  const handleRegister = async () => {
    // Basic validation
    if (!credentials.email || !credentials.password || !credentials.name || !credentials.phone || !credentials.address) {
      showErrorAlert('Error', 'Please fill in all required fields');
      return;
    }

    // Role-specific validation
    if (credentials.role === 'restaurant') {
      if (!credentials.restaurantName || !credentials.restaurantType) {
        showErrorAlert('Error', 'Please fill in all restaurant details');
        return;
      }
    } else if (credentials.role === 'shelter') {
      if (!credentials.shelterName || !credentials.shelterType || !credentials.capacity) {
        showErrorAlert('Error', 'Please fill in all shelter details');
        return;
      }
    }

    if (credentials.password !== confirmPassword) {
      showErrorAlert('Error', 'Passwords do not match');
      return;
    }

    if (credentials.password.length < 6) {
      showErrorAlert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await register(credentials);
    } catch (error: any) {
      showErrorAlert('Registration Failed', error.message || 'Please try again');
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
          <Image
            source={require('../../../ShareBiteLogo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                credentials.role === 'restaurant' && styles.activeTab,
              ]}
              onPress={() => handleRoleSelect('restaurant')}
            >
              <Text
                style={[
                  styles.tabText,
                  credentials.role === 'restaurant' && styles.activeTabText,
                ]}
              >
                Restaurant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                credentials.role === 'shelter' && styles.activeTab,
              ]}
              onPress={() => handleRoleSelect('shelter')}
            >
              <Text
                style={[
                  styles.tabText,
                  credentials.role === 'shelter' && styles.activeTabText,
                ]}
              >
                Shelter
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Account Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Contact Person Name *"
            placeholderTextColor={colors.textTertiary}
            value={credentials.name}
            onChangeText={(name) => setCredentials({ ...credentials, name })}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor={colors.textTertiary}
            value={credentials.email}
            onChangeText={(email) => setCredentials({ ...credentials, email })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            placeholderTextColor={colors.textTertiary}
            value={credentials.phone}
            onChangeText={(phone) => setCredentials({ ...credentials, phone })}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor={colors.textTertiary}
            value={credentials.password}
            onChangeText={(password) => setCredentials({ ...credentials, password })}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            placeholderTextColor={colors.textTertiary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Text style={styles.sectionTitle}>
            {credentials.role === 'restaurant' ? 'Restaurant Details' : 'Shelter Details'}
          </Text>

          {credentials.role === 'restaurant' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Restaurant Name *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.restaurantName}
                onChangeText={(restaurantName) => setCredentials({ ...credentials, restaurantName })}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Restaurant Type (e.g., Italian, Fast Food) *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.restaurantType}
                onChangeText={(restaurantType) => setCredentials({ ...credentials, restaurantType })}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Restaurant Address *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.address}
                onChangeText={(address) => setCredentials({ ...credentials, address })}
                autoCapitalize="words"
                multiline
              />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Shelter Name *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.shelterName}
                onChangeText={(shelterName) => setCredentials({ ...credentials, shelterName })}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Shelter Type (e.g., Homeless Shelter, Food Bank) *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.shelterType}
                onChangeText={(shelterType) => setCredentials({ ...credentials, shelterType })}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Capacity (number of people) *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.capacity?.toString() || ''}
                onChangeText={(capacity) => setCredentials({ ...credentials, capacity: parseInt(capacity) || undefined })}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Operating Hours (e.g., 9 AM - 5 PM)"
                placeholderTextColor={colors.textTertiary}
                value={credentials.operatingHours}
                onChangeText={(operatingHours) => setCredentials({ ...credentials, operatingHours })}
              />

              <TextInput
                style={styles.input}
                placeholder="Shelter Address *"
                placeholderTextColor={colors.textTertiary}
                value={credentials.address}
                onChangeText={(address) => setCredentials({ ...credentials, address })}
                autoCapitalize="words"
                multiline
              />
            </>
          )}

          <Button
            title={state.isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            disabled={state.isLoading}
            style={styles.registerButton}
          />

          {state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Creating your account...</Text>
            </View>
          )}

          <Button
            title="Already have an account? Sign In"
            onPress={onSwitchToLogin}
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
    marginBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    padding: spacing.xxs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xs,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.fontWeights?.semibold || '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.white,
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
  sectionTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.fontWeights?.semibold || '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
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
  registerButton: {
    marginBottom: spacing.sm,
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
  switchButton: {
    marginTop: spacing.xs,
  },
});
