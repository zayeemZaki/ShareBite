import React, { useState, useEffect } from 'react';
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
import { ProfileService, ShelterProfile } from '../../services/ProfileService';

export const ShelterAccountSettings: React.FC = () => {
  const { state, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors, typography, spacing, borderRadius } = useTheme();

  const styles = getStyles(isDarkMode, colors, typography, spacing, borderRadius);

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
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!state.user?.id) return;

    try {
      setLoading(true);
      
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
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile changes');
    } finally {
      setLoading(false);
    }
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
            // Handle account deletion logic here
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
        currentScreen="ShelterAccountSettings"
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
              style={[styles.input, { backgroundColor: colors.surfaceVariant }]}
              value={email}
              editable={false}
              placeholder="Email cannot be changed"
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shelter Information</Text>

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
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter street address"
              multiline
              numberOfLines={2}
              placeholderTextColor={colors.textSecondary}
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
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us about your shelter and the people you serve..."
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <Button
            title={loading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={loading}
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
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    halfWidth: {
      flex: 1,
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