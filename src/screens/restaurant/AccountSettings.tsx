import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ProfileService, RestaurantProfile } from '../../services/ProfileService';
import { showErrorAlert, showSuccessAlert, showDestructiveAlert } from '../../utils';

export const AccountSettings: React.FC = () => {
  const { state, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors, typography, spacing, borderRadius, shadows } = useTheme();

  const styles = getStyles(isDarkMode, colors, typography, spacing, borderRadius, shadows);

  // Form state
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [phone, setPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  
  // Business hours state
  const [openTime, setOpenTime] = useState('9:00 AM');
  const [closeTime, setCloseTime] = useState('9:00 PM');
  const [showTimePicker, setShowTimePicker] = useState<'open' | 'close' | null>(null);

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
      const profile = await ProfileService.getUserProfile(state.user.id) as RestaurantProfile;
      
      if (profile) {
        setPhone(profile.phone || '');
        setRestaurantName(profile.restaurantName || '');
        setAddress(profile.address || '');
        setCity(profile.city || '');
        setZipCode(profile.zipCode || '');
        setDescription(profile.description || '');
        setWebsite(profile.website || '');
        
        if (profile.businessHours) {
          setOpenTime(profile.businessHours.open || '9:00 AM');
          setCloseTime(profile.businessHours.close || '9:00 PM');
        }
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
      
      const updates: Partial<RestaurantProfile> = {
        id: state.user.id,
        email: state.user.email,
        name,
        role: 'restaurant' as const,
        phone: phone.trim(),
        restaurantName: restaurantName.trim(),
        address: address.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),
        description: description.trim(),
        website: website.trim(),
        isActive: true,
      };

      // Set business hours
      updates.businessHours = {
        open: openTime,
        close: closeTime,
        daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      };

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
  }, [name, phone, restaurantName, address, city, zipCode, description, website, openTime, closeTime]);

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

  // Generate time options for picker
  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const minutes = ['00', '30'];
    const periods = ['AM', 'PM'];
    
    periods.forEach(period => {
      hours.forEach(hour => {
        minutes.forEach(minute => {
          times.push(`${hour}:${minute} ${period}`);
        });
      });
    });
    
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <View style={styles.container}>
            <Header
        title="Settings"
        showLogo={true}
        showShareButton={true}
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
              <Text style={styles.label}>Restaurant Name</Text>
              <TextInput
                style={styles.input}
                value={restaurantName}
                onChangeText={setRestaurantName}
                placeholder="Enter restaurant name"
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
              <Text style={styles.label}>Business Hours</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker('open')}
                >
                  <Text style={styles.timeLabel}>Open</Text>
                  <Text style={styles.timeValue}>{openTime}</Text>
                </TouchableOpacity>
                <Text style={styles.timeSeparator}>to</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker('close')}
                >
                  <Text style={styles.timeLabel}>Close</Text>
                  <Text style={styles.timeValue}>{closeTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="https://yourrestaurant.com"
                keyboardType="url"
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
                placeholder="Tell us about your restaurant and the type of food you serve..."
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

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimePicker(null)}
        >
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>
                Select {showTimePicker === 'open' ? 'Opening' : 'Closing'} Time
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                <Text style={styles.timePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.timePickerScroll}>
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    (showTimePicker === 'open' ? openTime : closeTime) === time && styles.timeOptionSelected
                  ]}
                  onPress={() => {
                    if (showTimePicker === 'open') {
                      setOpenTime(time);
                    } else {
                      setCloseTime(time);
                    }
                    setShowTimePicker(null);
                  }}
                >
                  <Text style={[
                    styles.timeOptionText,
                    (showTimePicker === 'open' ? openTime : closeTime) === time && styles.timeOptionTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    timeButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    },
    timeLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontWeight: '600',
    },
    timeValue: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '700',
    },
    timeSeparator: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    timePickerContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      maxHeight: '60%',
      ...shadows,
    },
    timePickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    timePickerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    timePickerDone: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    timePickerScroll: {
      maxHeight: 300,
    },
    timeOption: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    timeOptionSelected: {
      backgroundColor: isDarkMode ? 'rgba(107, 68, 35, 0.2)' : 'rgba(107, 68, 35, 0.1)',
    },
    timeOptionText: {
      fontSize: 16,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    timeOptionTextSelected: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
