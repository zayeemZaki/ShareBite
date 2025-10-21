import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';

export const ShelterNearbyRestaurants: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [range, setRange] = useState('5'); // default 5 miles

  const restaurants = [
    {
      id: '1',
      name: "Mario's Kitchen",
      address: '123 Main St, Downtown',
      contact: '+1 (555) 123-4567',
      distance: 0.5,
      cuisine: 'Italian',
      city: 'Downtown',
      state: 'CA',
    },
    {
      id: '2',
      name: 'Green Garden',
      address: '456 Oak Ave, Midtown',
      contact: '+1 (555) 234-5678',
      distance: 1.2,
      cuisine: 'Healthy',
      city: 'Midtown',
      state: 'CA',
    },
    {
      id: '3',
      name: "Baker's Delight",
      address: '789 Pine Rd, Uptown',
      contact: '+1 (555) 345-6789',
      distance: 2.1,
      cuisine: 'Bakery',
      city: 'Uptown',
      state: 'CA',
    },
    {
      id: '4',
      name: 'Food Share Network',
      address: '321 Elm St, Riverside',
      contact: '+1 (555) 456-7890',
      distance: 3.0,
      cuisine: 'Various',
      city: 'Riverside',
      state: 'CA',
    },
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const cityMatch = city.trim() === '' || restaurant.city.toLowerCase().includes(city.trim().toLowerCase());
    const stateMatch = state.trim() === '' || restaurant.state.toLowerCase().includes(state.trim().toLowerCase());
    const rangeNum = Number(range);
    const rangeMatch = isNaN(rangeNum) || restaurant.distance <= rangeNum;
    return cityMatch && stateMatch && rangeMatch;
  });

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
          value={state}
          onChangeText={setState}
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
      </View>

      <ScrollView style={styles.content}>
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
                <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
              </View>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{restaurant.distance} mi</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(restaurant.contact)}
            >
              <Text style={styles.callButtonText}>Call Restaurant</Text>
            </TouchableOpacity>
          </View>
        ))}
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
