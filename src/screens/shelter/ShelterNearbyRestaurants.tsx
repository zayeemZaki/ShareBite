import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ProfileService, RestaurantProfile } from '../../services/ProfileService';
import { handleCall, handleEmail, showErrorAlert } from '../../utils';

export const ShelterNearbyRestaurants: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [range, setRange] = useState('10'); // default 10 km

  const loadRestaurants = async () => {
    try {
      // Get shelter's current location from their profile
      const shelterProfile = await ProfileService.getUserProfile(state.user?.id || '');
      
      if (shelterProfile?.latitude && shelterProfile?.longitude) {
        const nearbyRestaurants = await ProfileService.getRestaurants({
          lat: shelterProfile.latitude,
          lng: shelterProfile.longitude,
          radiusKm: Number(range) || 10 // Convert to km
        });
        setRestaurants(nearbyRestaurants);
      } else {
        // If no location, just get all restaurants
        const allRestaurants = await ProfileService.getRestaurants();
        setRestaurants(allRestaurants);
      }
    } catch (error) {
      showErrorAlert('Error', 'Failed to load restaurants');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [state.user?.id, range]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRestaurants();
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const cityMatch = city.trim() === '' || 
      (restaurant.city && restaurant.city.toLowerCase().includes(city.trim().toLowerCase()));
    const stateMatch = stateFilter.trim() === '' || 
      (restaurant.state && restaurant.state.toLowerCase().includes(stateFilter.trim().toLowerCase()));
    
    return cityMatch && stateMatch;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Nearby Restaurants"
        showLogo={true}
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
            <Text style={styles.emptyText}>Loading restaurants...</Text>
          </View>
        ) : filteredRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No restaurants found matching the criteria.</Text>
          </View>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.modernRestaurantCard}>
              <View style={styles.modernCardHeader}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.modernRestaurantName}>{restaurant.restaurantName || restaurant.name}</Text>
                  <View style={styles.addressRow}>
                    <Text style={styles.modernRestaurantAddress}>
                      {restaurant.address && restaurant.city 
                        ? `${restaurant.address}, ${restaurant.city}` 
                        : restaurant.address || restaurant.city || 'Address not provided'
                      }
                    </Text>
                  </View>
                </View>
              </View>

              {restaurant.description && (
                <View style={styles.descriptionRow}>
                  <Text style={styles.descriptionText} numberOfLines={2}>
                    {restaurant.description}
                  </Text>
                </View>
              )}

              {restaurant.businessHours && (
                <View style={styles.hoursRow}>
                  <Text style={styles.hoursLabel}>Hours:</Text>
                  <Text style={styles.modernHoursInfo}>
                    {restaurant.businessHours.open} - {restaurant.businessHours.close}
                  </Text>
                </View>
              )}

              <View style={styles.modernContactButtons}>
                {restaurant.phone && (
                  <TouchableOpacity
                    style={styles.modernContactButton}
                    onPress={() => handleCall(restaurant.phone!)}
                  >
                    <Text style={styles.modernContactButtonText}>Call</Text>
                  </TouchableOpacity>
                )}
                {(restaurant.contactEmail || restaurant.email) && (
                  <TouchableOpacity
                    style={styles.modernContactButton}
                    onPress={() => handleEmail(restaurant.contactEmail || restaurant.email!)}
                  >
                    <Text style={styles.modernContactButtonText}>Email</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.helpSection}>
          <Text style={styles.noteTitle}>About Food Requests</Text>
          <Text style={styles.noteText}>
            • Browse available food items from restaurants in the Home tab{'\n'}
            • Request food items by tapping on them{'\n'}
            • Wait for restaurant approval before picking up{'\n'}
            • Contact restaurants directly for special requests or questions
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
    modernRestaurantCard: {
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
    restaurantInfo: {
      flex: 1,
    },
    modernRestaurantName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
    },
    addressRow: {
      marginTop: spacing.xxs,
    },
    modernRestaurantAddress: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    descriptionRow: {
      marginBottom: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.md,
    },
    descriptionText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    hoursRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.md,
    },
    hoursLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    modernHoursInfo: {
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
