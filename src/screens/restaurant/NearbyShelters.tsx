import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ProfileService, ShelterProfile } from '../../services/ProfileService';

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
      Alert.alert('Error', 'Failed to load shelters');
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

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('No Phone Number', 'This shelter has not provided a phone number.');
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      Alert.alert('No Email', 'This shelter has not provided an email address.');
    }
  };

  const getCapacityColor = (capacity?: number) => {
    if (!capacity) return '#95a5a6';
    if (capacity >= 100) return '#27ae60'; // High capacity
    if (capacity >= 50) return '#f39c12';  // Medium capacity
    return '#e74c3c'; // Low capacity
  };

  const getCapacityText = (capacity?: number) => {
    if (!capacity) return 'Unknown';
    if (capacity >= 100) return 'High';
    if (capacity >= 50) return 'Medium';
    return 'Low';
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
      <HeaderWithBurger
        title="Nearby Shelters"
        currentScreen="NearbyShelters"
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
            <View key={shelter.id} style={styles.shelterCard}>
              <View style={styles.shelterHeader}>
                <View style={styles.shelterInfo}>
                  <Text style={styles.shelterName}>{shelter.shelterName || shelter.name}</Text>
                  <Text style={styles.shelterAddress}>
                    {shelter.address && shelter.city 
                      ? `${shelter.address}, ${shelter.city}` 
                      : shelter.address || shelter.city || 'Address not provided'
                    }
                  </Text>
                </View>
                <View style={[styles.capacityBadge, { backgroundColor: getCapacityColor(shelter.capacity) }]}>
                  <Text style={styles.capacityText}>{getCapacityText(shelter.capacity)}</Text>
                </View>
              </View>

              <View style={styles.shelterDetails}>
                <View style={styles.contactButtons}>
                  {shelter.phone && (
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleCall(shelter.phone!)}
                    >
                      <Text style={styles.contactButtonText}>📞 Call</Text>
                    </TouchableOpacity>
                  )}
                  {(shelter.contactEmail || shelter.email) && (
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleEmail(shelter.contactEmail || shelter.email!)}
                    >
                      <Text style={styles.contactButtonText}>� Email</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {shelter.capacity && (
                <Text style={styles.capacityInfo}>
                  Capacity: {shelter.capacity} people
                </Text>
              )}
            </View>
          ))
        )}

        <View style={styles.section}>
          <Text style={styles.noteTitle}>💡 How to Help</Text>
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
      borderRadius: borderRadius.md,
      margin: spacing.md,
      ...shadows,
    },
    filterLabel: {
      fontSize: typography.sizes.regular,
      fontWeight: typography.fontWeightMedium,
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    filterInput: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginBottom: spacing.sm,
      fontSize: typography.sizes.regular,
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
    noteTitle: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    noteText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    section: {
      padding: spacing.lg,
    },
    emptyState: {
      padding: spacing.xl,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      margin: spacing.md,
    },
    emptyText: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
