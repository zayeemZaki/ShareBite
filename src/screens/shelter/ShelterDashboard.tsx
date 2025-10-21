import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface FoodItem {
  id: string;
  title: string;
  restaurantName: string;
  restaurantPic: string;
  timePosted: string;
  distance: number;
  description: string;
  isRequested?: boolean;
  timeLeft: number; // in minutes
}

export const ShelterDashboard: React.FC = () => {
  const { state } = useAuth();
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [sortBy, setSortBy] = useState<'distance' | 'latest'>('distance');

  // Mock fetch function to simulate fetching food items from restaurants nearby
  useEffect(() => {
    const fetchedItems: FoodItem[] = [
      {
        id: '1',
        title: '🍕 Pizza Slices',
        restaurantName: "Mario's Kitchen",
        restaurantPic: 'https://example.com/marios-kitchen.jpg',
        timePosted: '10 minutes ago',
        distance: 0.3,
        description: 'Fresh pizza slices available for pickup',
        isRequested: false,
        timeLeft: 45,
      },
      {
        id: '2',
        title: '🥗 Fresh Salad',
        restaurantName: 'Green Garden',
        restaurantPic: 'https://example.com/green-garden.jpg',
        timePosted: '30 minutes ago',
        distance: 0.5,
        description: 'Organic mixed greens with dressing',
        isRequested: true,
        timeLeft: 30,
      },
      {
        id: '3',
        title: '🍞 Bread Loaves',
        restaurantName: 'Baker\'s Delight',
        restaurantPic: 'https://example.com/bakers-delight.jpg',
        timePosted: '5 minutes ago',
        distance: 0.2,
        description: 'Freshly baked bread loaves',
        isRequested: false,
        timeLeft: 60,
      },
    ];
    setFoodItems(fetchedItems);
  }, []);

  const sortedFoodItems = [...foodItems].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance - b.distance;
    } else {
      // Assuming timePosted is a string like '10 minutes ago', parse to minutes
      const parseTime = (timeStr: string) => {
        const match = timeStr.match(/(\d+)\s+minutes?/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return parseTime(a.timePosted) - parseTime(b.timePosted);
    }
  });

  const handleRequestPickup = (itemId: string) => {
    // Implement request pickup logic here
    Alert.alert('Pickup Requested', `Pickup requested for item ${itemId}`);
  };

  const handleContactRestaurant = (restaurantName: string) => {
    // Implement contact restaurant logic here
    Alert.alert('Contact Restaurant', `Contacting ${restaurantName}`);
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title={`Welcome, ${state.user?.name}`}
        currentScreen="ShelterDashboard"
        showLogo={true}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <Button
            title="Distance"
            onPress={() => setSortBy('distance')}
            variant={sortBy === 'distance' ? 'primary' : 'secondary'}
            style={styles.sortButton}
          />
          <Button
            title="Latest"
            onPress={() => setSortBy('latest')}
            variant={sortBy === 'latest' ? 'primary' : 'secondary'}
            style={styles.sortButton}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {sortedFoodItems.map((item) => (
          <View key={item.id} style={[styles.foodCard, { backgroundColor: colors.surface }]}>
            <View style={styles.foodCardHeader}>
              <Image source={{ uri: item.restaurantPic }} style={styles.restaurantPic} />
              <View style={styles.foodInfo}>
                <View style={styles.titleRow}>
                  <Text style={[styles.foodTitle, { color: isDarkMode ? '#ffffff' : colors.textPrimary }]}>{item.title}</Text>
                </View>
                <Text style={[styles.restaurantName, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>{item.restaurantName}</Text>
                <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>{item.timePosted}</Text>
                <Text style={[styles.distance, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>{item.distance} miles away</Text>
              </View>
              <View style={styles.sideActions}>
                {!item.isRequested && (
                  <TouchableOpacity style={styles.requestButton} onPress={() => handleRequestPickup(item.id)}>
                    <Text style={styles.requestEmoji}>➕</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.contactButton} onPress={() => handleContactRestaurant(item.restaurantName)}>
                  <Text style={styles.contactEmoji}>💬</Text>
                </TouchableOpacity>
                <View style={styles.timerBox}>
                  <Text style={styles.timerText}>{item.timeLeft} min</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.foodDescription, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>{item.description}</Text>
            {item.isRequested && (
              <View style={styles.requestedBadgeContainer}>
                <Text style={styles.requestedBadgeText}>REQUESTED</Text>
              </View>
            )}
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
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      margin: spacing.md,
      ...shadows,
    },
    sortLabel: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginRight: spacing.sm,
    },
    sortButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    sortButton: {
      minWidth: 80,
      paddingHorizontal: spacing.sm,
    },
    foodCard: {
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows,
    },
    foodCardHeader: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    restaurantPic: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.sm,
      marginRight: spacing.md,
    },
    foodInfo: {
      flex: 1,
    },
    foodTitle: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightBold,
      marginBottom: spacing.xs,
    },
    restaurantName: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      marginBottom: spacing.xs,
    },
    timePosted: {
      fontSize: typography.sizes.small,
      marginBottom: spacing.xs,
    },
    distance: {
      fontSize: typography.sizes.small,
    },
    foodDescription: {
      fontSize: typography.sizes.medium,
      marginBottom: spacing.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },

    sideActions: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing.sm,
    },
    requestButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xs,
      ...shadows,
    },
    requestEmoji: {
      fontSize: 20,
      color: colors.surface,
    },
    contactButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows,
    },
    contactEmoji: {
      fontSize: 20,
      color: colors.surface,
    },
    timerBox: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.sm,
      backgroundColor: '#d9534f', // Bootstrap danger red
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
      ...shadows,
    },
    timerText: {
      color: colors.surface,
      fontWeight: typography.fontWeightBold,
      fontSize: typography.sizes.small,
    },
    requestedBadgeContainer: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: '#28a745',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    requestedBadgeText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: typography.sizes.small,
    },
  });
