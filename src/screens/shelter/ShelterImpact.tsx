import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FoodService, FoodItemRequest, FoodItem } from '../../services/FoodService';

interface ImpactStats {
  requestsSent: number;
  itemsReceived: number;
  estimatedMeals: number;
  activePartners: number;
}

export const ShelterImpact: React.FC = () => {
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  const { state } = useAuth();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [stats, setStats] = useState<ImpactStats>({
    requestsSent: 0,
    itemsReceived: 0,
    estimatedMeals: 0,
    activePartners: 0,
  });
  const [recentRequests, setRecentRequests] = useState<(FoodItemRequest & { foodItem?: FoodItem })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImpactData();
  }, []);

  const loadImpactData = async () => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      const requestsWithDetails = await FoodService.getShelterRequestsWithFoodDetails(state.user.id);
      
      // Calculate real statistics
      const receivedItems = requestsWithDetails.filter(req => req.status === 'picked_up');
      const approvedItems = requestsWithDetails.filter(req => req.status === 'approved');
      
      // Estimate meals served (simple heuristic)
      const estimatedMeals = receivedItems.reduce((total, req) => {
        const quantity = parseInt(req.foodItem?.quantity || '1');
        return total + (quantity * 2); // Assume each food item serves 2 people on average
      }, 0);

      // Count unique restaurants we've worked with
      const uniqueRestaurants = new Set(
        requestsWithDetails
          .filter(req => req.foodItem)
          .map(req => req.foodItem!.restaurantId)
      ).size;

      setStats({
        requestsSent: requestsWithDetails.length,
        itemsReceived: receivedItems.length,
        estimatedMeals,
        activePartners: uniqueRestaurants,
      });

      // Show recent activities (approved and received items)
      setRecentRequests(
        requestsWithDetails
          .filter(req => req.status === 'approved' || req.status === 'picked_up')
          .slice(0, 5)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load impact data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'Recently';
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getActivityText = (request: FoodItemRequest & { foodItem?: FoodItem }) => {
    if (request.status === 'picked_up') {
      return `Received ${request.foodItem?.title || 'food items'} from ${request.foodItem?.restaurantName || 'restaurant'}`;
    }
    return `Approved for ${request.foodItem?.title || 'food items'} from ${request.foodItem?.restaurantName || 'restaurant'}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderWithBurger
          title="Impact Dashboard"
          currentScreen="ShelterImpact"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading impact data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Impact Dashboard"
        currentScreen="ShelterImpact"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Impact</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📋</Text>
              <Text style={styles.statValue}>{stats.requestsSent}</Text>
              <Text style={styles.statLabel}>Requests Sent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🍽️</Text>
              <Text style={styles.statValue}>{stats.itemsReceived}</Text>
              <Text style={styles.statLabel}>Items Received</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statValue}>{stats.estimatedMeals}</Text>
              <Text style={styles.statLabel}>Estimated Meals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🤝</Text>
              <Text style={styles.statValue}>{stats.activePartners}</Text>
              <Text style={styles.statLabel}>Restaurant Partners</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Activities</Text>
          {recentRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No recent activities. Start requesting food items to see your impact!
              </Text>
            </View>
          ) : (
            recentRequests.map((request) => (
              <View key={request.id} style={styles.activityCard}>
                <Text style={styles.activityText}>{getActivityText(request)}</Text>
                <Text style={styles.activityDate}>
                  {formatDate(request.status === 'picked_up' ? request.pickedUpAt : request.reviewedAt)}
                </Text>
              </View>
            ))
          )}
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
      padding: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    loadingText: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      marginTop: spacing.sm,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      width: '48%',
      alignItems: 'center',
      ...shadows,
    },
    statIcon: {
      fontSize: 30,
      marginBottom: spacing.xs,
    },
    statValue: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    emptyState: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      alignItems: 'center',
      ...shadows,
    },
    emptyStateText: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    activityCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows,
    },
    activityText: {
      fontSize: typography.sizes.medium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    activityDate: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
    },
  });
