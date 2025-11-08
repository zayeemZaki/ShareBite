import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ProfileService, ShelterProfile } from '../../services/ProfileService';
import { showErrorAlert, showSuccessAlert, showDestructiveAlert } from '../../utils';

export const ShelterAccountSettings: React.FC = () => {
  const { state, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors, typography, spacing, borderRadius, shadows } = useTheme();

  const styles = getStyles(isDarkMode, colors, typography, spacing, borderRadius, shadows);

  // Form state
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [phone, setPhone] = useState('');
  const [shelterName, setShelterName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Auto-save timeout
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load current profile data
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    if (!state.user?.id) return;
    
    try {
      setLoading(true);
      const profile = await ProfileService.getUserProfile(state.user.id) as ShelterProfile;
      
      if (profile) {
        setPhone(profile.phone || '');
        setShelterName(profile.shelterName || '');
        setAddress(profile.address || '');
        setCity(profile.city || '');
        setZipCode(profile.zipCode || '');
        setDescription(profile.description || '');
        setCapacity(profile.capacity?.toString() || '');
        setContactEmail(profile.contactEmail || '');
      }
    } catch (error) {
      showErrorAlert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!state.user?.id) return;

    try {
      setIsSaving(true);
      
      const updates: Partial<ShelterProfile> = {
        id: state.user.id,
        email: state.user.email,
        name,
        role: 'shelter' as const,
        phone: phone.trim(),
        shelterName: shelterName.trim(),
        address: address.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),
        description: description.trim(),
        contactEmail: contactEmail.trim(),
        isActive: true,
      };

      // Parse capacity if provided
      if (capacity.trim()) {
        const capacityNum = parseInt(capacity.trim());
        if (!isNaN(capacityNum) && capacityNum > 0) {
          updates.capacity = capacityNum;
        }
      }

      await ProfileService.updateUserProfile(state.user.id, updates);
    } catch (error) {
      showErrorAlert('Error', 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save function with debounce
  const autoSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 1500); // Save 1.5 seconds after user stops typing
  };

  // Watch for changes and trigger auto-save
  useEffect(() => {
    if (state.user?.id) {
      autoSave();
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [name, phone, shelterName, address, city, zipCode, description, capacity, contactEmail]);

  const handleDeleteAccount = () => {
    showDestructiveAlert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      () => {
        showSuccessAlert('Account Deleted', 'Your account has been deleted.');
        logout();
      }
    );
  };

  return (
    <View style={styles.container}>
            <Header
        title="Settings"
        showLogo={true}
      />

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
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
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
                placeholder="Email cannot be changed"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
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
              <Text style={styles.label}>Shelter Name</Text>
              <TextInput
                style={styles.input}
                value={shelterName}
                onChangeText={setShelterName}
                placeholder="Enter shelter name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter street address"
                placeholderTextColor={colors.textSecondary}
                autoComplete="street-address"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="City"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>ZIP Code</Text>
                <TextInput
                  style={styles.input}
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="ZIP"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacity (Number of People)</Text>
              <TextInput
                style={styles.input}
                value={capacity}
                onChangeText={setCapacity}
                placeholder="e.g., 50"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Email</Text>
              <TextInput
                style={styles.input}
                value={contactEmail}
                onChangeText={setContactEmail}
                placeholder="contact@yourshelter.org"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, styles.largeTextArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us about your shelter and the people you serve..."
                multiline
                numberOfLines={5}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.preferenceRow}
              onPress={toggleDarkMode}
            >
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>Appearance</Text>
                <Text style={styles.preferenceValue}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Text style={styles.preferenceArrow}>›</Text>
            </TouchableOpacity>
          </View>
          {isSaving && (
            <Text style={styles.savingText}>Saving preferences...</Text>
          )}
        </View>

        <View style={styles.actionsWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, spacing: any, borderRadius: any, shadows: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    themeToggle: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...shadows,
      elevation: 1,
    },
    themeToggleContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    themeToggleText: {
      color: colors.primary,
      fontWeight: '700',
      fontSize: 15,
      letterSpacing: 0.3,
    },
    savingText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontStyle: 'italic',
    },
    sectionWrapper: {
      marginTop: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.md,
      letterSpacing: 0.2,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      letterSpacing: 0.2,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: 15,
      color: colors.textPrimary,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    },
    disabledInput: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      opacity: 0.7,
    },
    helperText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      fontStyle: 'italic',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
      paddingTop: spacing.md,
    },
    largeTextArea: {
      height: 120,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    preferenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
    },
    preferenceContent: {
      flex: 1,
    },
    preferenceLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    preferenceValue: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    preferenceArrow: {
      fontSize: 24,
      color: colors.textSecondary,
      marginLeft: spacing.sm,
    },
    actionsWrapper: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      alignItems: 'center',
    },
    logoutButton: {
      backgroundColor: colors.error,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.sm,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
    },
    logoutButtonText: {
      color: '#ffffff',
      fontSize: typography.sizes.bodyLarge,
      fontWeight: typography.fontWeights?.semibold || '600',
      textAlign: 'center',
      lineHeight: 22,
    },
    dangerButton: {
      backgroundColor: isDarkMode ? 'rgba(90, 56, 37, 0.8)' : colors.error,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.error,
    },
    dangerButtonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    bottomSpacing: {
      height: spacing.xl * 2,
    },
  });