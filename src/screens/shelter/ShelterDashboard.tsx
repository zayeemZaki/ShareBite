import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FoodService, FoodItem, FoodItemRequest } from '../../services/FoodService';

export const ShelterDashboard: React.FC = () => {
  const { state } = useAuth();
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [requestedItems, setRequestedItems] = useState<(FoodItemRequest & { foodItem?: FoodItem })[]>([]);
  const [historyItems, setHistoryItems] = useState<(FoodItemRequest & { foodItem?: FoodItem })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'latest'>('latest');
  const [activeTab, setActiveTab] = useState<'available' | 'requested' | 'history'>('available');

  useEffect(() => {
    loadData();
  }, [state.user?.id, activeTab]);

  const loadData = async () => {
    if (activeTab === 'available') {
      loadAvailableFoodItems();
    } else if (activeTab === 'requested') {
      loadRequestedItems();
    } else if (activeTab === 'history') {
      loadHistoryItems();
    }
  };

  const loadAvailableFoodItems = async () => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      const items = await FoodService.getAvailableFoodItemsForShelter(state.user.id);
      setFoodItems(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load available food items');
    } finally {
      setLoading(false);
    }
  };

  const loadRequestedItems = async () => {
    try {
      setLoading(true);
      if (state.user?.id) {
        const requests = await FoodService.getShelterRequestsWithFoodDetails(state.user.id);
        // Filter out picked up items for the requested tab
        const activeRequests = requests.filter(req => req.status !== 'picked_up');
        setRequestedItems(activeRequests);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load requested items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadHistoryItems = async () => {
    try {
      setLoading(true);
      if (state.user?.id) {
        const requests = await FoodService.getShelterRequestsWithFoodDetails(state.user.id);
        // Filter only picked up items for the history tab
        const pickedUpRequests = requests.filter(req => req.status === 'picked_up');
        setHistoryItems(pickedUpRequests);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load history items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRequestFood = async (item: FoodItem) => {
    Alert.alert(
      'Request Food',
      `Do you want to request "${item.title}" from ${item.restaurantName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: async () => {
            try {
              if (state.user?.id && state.user?.name) {
                await FoodService.requestFoodItem(item.id, state.user.id, state.user.name);
                Alert.alert('Success', 'Food item requested successfully!');
                loadAvailableFoodItems(); // Refresh the list
              }
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to request food item');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return '#f39c12'; // Orange
      case 'approved': return '#27ae60';  // Green
      case 'declined': return '#e74c3c';  // Red
      case 'picked_up': return '#3498db'; // Blue
      default: return '#95a5a6';          // Gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested': return 'Requested';
      case 'approved': return 'Approved';
      case 'declined': return 'Declined';
      case 'picked_up': return 'Picked Up';
      default: return 'Unknown';
    }
  };

  const sortedFoodItems = [...foodItems].sort((a, b) => {
    if (sortBy === 'latest') {
      // Sort by creation time (newest first)
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
    }
    return 0;
  });

  const handleContactRestaurant = (restaurantId: string) => {
    // Implement contact restaurant logic here
    Alert.alert('Contact Restaurant', `Contacting restaurant (ID: ${restaurantId})`);
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title={`Welcome, ${state.user?.name}`}
        currentScreen="ShelterDashboard"
        showLogo={true}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requested' && styles.activeTab]}
          onPress={() => setActiveTab('requested')}
        >
          <Text style={[styles.tabText, activeTab === 'requested' && styles.activeTabText]}>
            Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'available' && (
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
      )}

      <ScrollView style={styles.content} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {activeTab === 'available' ? (
          // Available Food Items
          sortedFoodItems.map((item) => (
            <View key={item.id} style={[styles.foodCard, { backgroundColor: colors.surface }]}>
              <View style={styles.foodCardHeader}>
                <View style={styles.foodInfo}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.foodTitle, { color: isDarkMode ? '#ffffff' : colors.textPrimary }]}>{item.title}</Text>
                  </View>
                  <Text style={[styles.restaurantName, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>Restaurant: {item.restaurantName}</Text>
                  <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                    Posted: {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString() : 'Recently'}
                  </Text>
                  <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>Quantity: {item.quantity}</Text>
                </View>
                <View style={styles.sideActions}>
                  {item.isAvailable && (
                    <TouchableOpacity style={styles.requestButton} onPress={() => handleRequestFood(item)}>
                      <Text style={styles.requestEmoji}>➕</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.contactButton} onPress={() => handleContactRestaurant(item.restaurantId)}>
                    <Text style={styles.contactEmoji}>💬</Text>
                  </TouchableOpacity>
                  {item.expiryTime && (
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>
                        Expires: {new Date(item.expiryTime.seconds * 1000).toLocaleTimeString()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={[styles.foodDescription, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>{item.description}</Text>
            </View>
          ))
        ) : activeTab === 'requested' ? (
          // Requested Items (excluding picked up)
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading your requests...</Text>
            </View>
          ) : requestedItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No active requests</Text>
              <Text style={styles.emptySubtext}>Request some food items to see them here!</Text>
            </View>
          ) : (
            requestedItems.map((request) => (
              <View key={request.id} style={[styles.foodCard, { backgroundColor: colors.surface }]}>
                <View style={styles.foodCardHeader}>
                  <View style={styles.foodInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.foodTitle, { color: isDarkMode ? '#ffffff' : colors.textPrimary }]}>
                        {request.foodItem?.title || 'Unknown Item'}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.restaurantName, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                      Restaurant: {request.foodItem?.restaurantName || 'Unknown'}
                    </Text>
                    <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                      Requested: {request.requestedAt ? new Date(request.requestedAt.seconds * 1000).toLocaleString() : 'Recently'}
                    </Text>
                    {request.reviewedAt && (
                      <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                        Reviewed: {new Date(request.reviewedAt.seconds * 1000).toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={[styles.foodDescription, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                  {request.foodItem?.description || 'No description available'}
                </Text>
                {request.status === 'approved' && request.foodItem && (
                  <View style={styles.pickupInfo}>
                    <Text style={styles.pickupTitle}>📍 Pickup Information:</Text>
                    <Text style={styles.pickupText}>Address: {request.foodItem.restaurantAddress}</Text>
                    {request.foodItem.restaurantPhone && (
                      <Text style={styles.pickupText}>Phone: {request.foodItem.restaurantPhone}</Text>
                    )}
                    {request.foodItem.pickupInstructions && (
                      <Text style={styles.pickupText}>Instructions: {request.foodItem.pickupInstructions}</Text>
                    )}
                  </View>
                )}
              </View>
            ))
          )
        ) : (
          // History Items (picked up)
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading history...</Text>
            </View>
          ) : historyItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No history yet</Text>
              <Text style={styles.emptySubtext}>Completed pickups will appear here!</Text>
            </View>
          ) : (
            historyItems.map((request) => (
              <View key={request.id} style={[styles.foodCard, { backgroundColor: colors.surface }]}>
                <View style={styles.foodCardHeader}>
                  <View style={styles.foodInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.foodTitle, { color: isDarkMode ? '#ffffff' : colors.textPrimary }]}>
                        {request.foodItem?.title || 'Unknown Item'}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                        <Text style={styles.statusText}>✅ {getStatusText(request.status)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.restaurantName, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                      Restaurant: {request.foodItem?.restaurantName || 'Unknown'}
                    </Text>
                    <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                      Requested: {request.requestedAt ? new Date(request.requestedAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                    </Text>
                    {request.reviewedAt && (
                      <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                        Approved: {new Date(request.reviewedAt.seconds * 1000).toLocaleDateString()}
                      </Text>
                    )}
                    {request.pickedUpAt && (
                      <Text style={[styles.timePosted, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                        Picked Up: {new Date(request.pickedUpAt.seconds * 1000).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={[styles.foodDescription, { color: isDarkMode ? '#cccccc' : colors.textSecondary }]}>
                  {request.foodItem?.description || 'No description available'}
                </Text>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>📋 Pickup Summary:</Text>
                  <Text style={styles.historyText}>✅ Successfully picked up from {request.foodItem?.restaurantName || 'Unknown'}</Text>
                  <Text style={styles.historyText}>📅 Completed on {request.pickedUpAt ? new Date(request.pickedUpAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}</Text>
                </View>
              </View>
            ))
          )
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
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      margin: spacing.md,
      overflow: 'hidden',
      ...shadows,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      backgroundColor: colors.surface,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.surface,
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
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    emptySubtext: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
      marginLeft: spacing.sm,
    },
    statusText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
    pickupInfo: {
      backgroundColor: isDarkMode ? '#2c3e50' : '#ecf0f1',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    pickupTitle: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    pickupText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    historyInfo: {
      backgroundColor: isDarkMode ? '#1e3a28' : '#e8f5e8',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: '#27ae60',
    },
    historyTitle: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    historyText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
  });