import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ProfileService, ShelterProfile } from '../../services/ProfileService';
import { getCapacityColor, getCapacityText, handleCall, handleEmail, showErrorAlert } from '../../utils';

export const NearbyShelters: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [shelters, setShelters] = useState<ShelterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [range, setRange] = useState('10'); // default 10 km

  const loadShelters = async () => {
    try {
      // Get restaurant's current location from their profile
      const restaurantProfile = await ProfileService.getUserProfile(state.user?.id || '');
      
      if (restaurantProfile?.latitude && restaurantProfile?.longitude) {
        const nearbyShelters = await ProfileService.getShelters({
          lat: restaurantProfile.latitude,
          lng: restaurantProfile.longitude,
          radiusKm: Number(range) || 10 // Convert to km
        });
        setShelters(nearbyShelters);
      } else {
        // If no location, just get all shelters
        const allShelters = await ProfileService.getShelters();
        setShelters(allShelters);
      }
    } catch (error) {
      showErrorAlert('Error', 'Failed to load shelters');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, [state.user?.id, range]);

  const onRefresh = () => {
    setRefreshing(true);
    loadShelters();
  };

  const filteredShelters = shelters.filter(shelter => {
    const cityMatch = city.trim() === '' || 
      (shelter.city && shelter.city.toLowerCase().includes(city.trim().toLowerCase()));
    const stateMatch = stateFilter.trim() === '' || 
      (shelter.state && shelter.state.toLowerCase().includes(stateFilter.trim().toLowerCase()));
    
    return cityMatch && stateMatch;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Nearby Shelters"
        showLogo={true}
        showShareButton={true}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>City</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />
          <Text style={styles.filterLabel}>State</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter state"
            value={stateFilter}
            onChangeText={setStateFilter}
          />
          <Text style={styles.filterLabel}>Range (km)</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter range in kilometers"
            keyboardType="numeric"
            value={range}
            onChangeText={setRange}
          />
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading shelters...</Text>
          </View>
        ) : filteredShelters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No shelters found matching the criteria.</Text>
          </View>
        ) : (
          filteredShelters.map((shelter) => (
            <View key={shelter.id} style={styles.modernShelterCard}>
              <View style={styles.modernCardHeader}>
                <View style={styles.shelterInfo}>
                  <Text style={styles.modernShelterName}>{shelter.shelterName || shelter.name}</Text>
                  <View style={styles.addressRow}>
                    <Text style={styles.modernShelterAddress}>
                      {shelter.address && shelter.city 
                        ? `${shelter.address}, ${shelter.city}` 
                        : shelter.address || shelter.city || 'Address not provided'
                      }
                    </Text>
                  </View>
                </View>
                <View style={[styles.modernCapacityBadge, { backgroundColor: getCapacityColor(shelter.capacity) }]}>
                  <Text style={styles.modernCapacityText}>{getCapacityText(shelter.capacity)}</Text>
                </View>
              </View>

              {shelter.capacity && (
                <View style={styles.capacityRow}>
                  <Text style={styles.capacityLabel}>Capacity:</Text>
                  <Text style={styles.modernCapacityInfo}>
                    {shelter.capacity} people
                  </Text>
                </View>
              )}

              <View style={styles.modernContactButtons}>
                {shelter.phone && (
                  <TouchableOpacity
                    style={styles.modernContactButton}
                    onPress={() => handleCall(shelter.phone!)}
                  >
                    <Text style={styles.modernContactButtonText}>Call</Text>
                  </TouchableOpacity>
                )}
                {(shelter.contactEmail || shelter.email) && (
                  <TouchableOpacity
                    style={styles.modernContactButton}
                    onPress={() => handleEmail(shelter.contactEmail || shelter.email!)}
                  >
                    <Text style={styles.modernContactButtonText}>Email</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.helpSection}>
          <Text style={styles.noteTitle}>How to Help</Text>
          <Text style={styles.noteText}>
            • Contact shelters directly to coordinate food donations{'\n'}
            • Check their current capacity before delivering{'\n'}
            • Ensure food is properly packaged and within safe consumption dates{'\n'}
            • Consider transportation logistics for larger donations
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    filterSection: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      margin: spacing.lg,
      ...shadows,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterLabel: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: spacing.xs,
      color: colors.textPrimary,
      letterSpacing: 0.2,
    },
    filterInput: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : colors.background,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.md,
      fontSize: 15,
      color: colors.textPrimary,
    },
    shelterCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      ...shadows,
    },
    shelterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    shelterInfo: {
      flex: 1,
    },
    shelterName: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    shelterAddress: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
    },
    capacityBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
    },
    capacityText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
    shelterDetails: {
      marginTop: spacing.sm,
    },
    contactButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    contactButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 6 : 4,
      elevation: isDarkMode ? 6 : 3,
    },
    contactButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.regular,
      fontWeight: typography.fontWeightMedium,
    },
    capacityInfo: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    distanceText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
    },
    callButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 6 : 4,
      elevation: isDarkMode ? 6 : 3,
    },
    callButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.regular,
      fontWeight: typography.fontWeightMedium,
    },
    section: {
      padding: spacing.lg,
    },
    helpSection: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      margin: spacing.lg,
      marginTop: spacing.xl,
      ...shadows,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    emptyState: {
      padding: spacing.xl * 2,
      alignItems: 'center',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.xl,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      margin: spacing.lg,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    // Modern styles
    modernShelterCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      ...shadows,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    modernCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    modernShelterName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
    },
    addressRow: {
      marginTop: spacing.xxs,
    },
    modernShelterAddress: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    modernCapacityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
      minWidth: 70,
      alignItems: 'center',
    },
    modernCapacityText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    capacityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.md,
    },
    capacityIcon: {
      fontSize: 16,
      marginRight: spacing.sm,
    },
    capacityLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    modernCapacityInfo: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '700',
    },
    modernContactButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    modernContactButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.xl,
      ...shadows,
      elevation: 2,
    },
    modernContactButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    noteTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.md,
      letterSpacing: 0.2,
    },
    noteText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
