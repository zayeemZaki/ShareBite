import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ProfileService, RestaurantProfile } from '../../services/ProfileService';

export const ShelterNearbyRestaurants: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state: authState } = useAuth();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [range, setRange] = useState('5'); // default 5 miles
  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load all restaurants initially
  useEffect(() => {
    loadAllRestaurants();
  }, []);

  const loadAllRestaurants = async () => {
    try {
      setLoading(true);
      const allRestaurants = await ProfileService.getRestaurants();
      setRestaurants(allRestaurants);
      setSearchPerformed(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const searchRestaurants = async () => {
    if (!city.trim() && !stateValue.trim()) {
      Alert.alert('Search Required', 'Please enter a city or state to search');
      return;
    }

    try {
      setLoading(true);
      // For now, we'll get all restaurants and filter by city/state
      // In a real app, you'd implement geocoding to get coordinates
      const allRestaurants = await ProfileService.getRestaurants();
      
      const filtered = allRestaurants.filter(restaurant => {
        const cityMatch = city.trim() === '' || 
          (restaurant.city && restaurant.city.toLowerCase().includes(city.trim().toLowerCase()));
        const stateMatch = stateValue.trim() === '' || 
          (restaurant.state && restaurant.state.toLowerCase().includes(stateValue.trim().toLowerCase()));
        
        return cityMatch && stateMatch;
      });

      setRestaurants(filtered);
      setSearchPerformed(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to search restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Nearby Restaurants"
        currentScreen="ShelterNearbyRestaurants"
      />

      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={stateValue}
          onChangeText={setStateValue}
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Range (miles)"
          value={range}
          onChangeText={setRange}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchRestaurants}>
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading restaurants...</Text>
          </View>
        ) : !searchPerformed ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Use the search above to find restaurants</Text>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No restaurants found in your search area</Text>
          </View>
        ) : (
          restaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.restaurantCard}>
              <View style={styles.restaurantHeader}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>
                    {restaurant.restaurantName || restaurant.name}
                  </Text>
                  <Text style={styles.restaurantAddress}>
                    {restaurant.address && restaurant.city ? 
                      `${restaurant.address}, ${restaurant.city}` : 
                      restaurant.address || 'Address not provided'
                    }
                  </Text>
                  <Text style={styles.phoneText}>
                    {restaurant.phone || 'Phone not provided'}
                  </Text>
                </View>
              </View>
              
              {restaurant.phone && (
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(restaurant.phone!)}
                >
                  <Text style={styles.callButtonText}>📞 Call Restaurant</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
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
      padding: spacing.md,
    },
    filters: {
      flexDirection: 'row',
      padding: spacing.md,
      gap: spacing.sm,
    },
    searchButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      justifyContent: 'center',
      minWidth: 80,
    },
    searchButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      fontSize: typography.sizes.medium,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    restaurantCard: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows,
    },
    restaurantHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    restaurantInfo: {
      flex: 1,
    },
    restaurantName: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    restaurantAddress: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    phoneText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    cuisineText: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
    },
    distanceBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
    },
    distanceText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
    callButton: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
    },
    callButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
    },
  });
