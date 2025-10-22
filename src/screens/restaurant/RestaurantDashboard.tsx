import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { FoodService, FoodItem, FoodItemRequest } from '../../services/FoodService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const RestaurantDashboard: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const navigation = useReactNavigation<NavigationProp>();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [historyItems, setHistoryItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const loadFoodItems = async () => {
    try {
      if (state.user?.id) {
        const items = await FoodService.getRestaurantFoodItemsWithRequests(state.user.id);
        
        if (activeTab === 'active') {
          // Filter active items (not picked up)
          const activeItems = items.filter(item => 
            !item.approvedRequest || item.approvedRequest.status !== 'picked_up'
          );
          setFoodItems(activeItems);
        } else {
          // Filter history items (picked up)
          const historyItems = items.filter(item => 
            item.approvedRequest && item.approvedRequest.status === 'picked_up'
          );
          setHistoryItems(historyItems);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load food items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, [state.user?.id, activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFoodItems();
  };

  const getStatusColor = (item: FoodItem) => {
    if (item.approvedRequest?.status === 'picked_up') return '#3498db'; // Blue
    if (item.approvedRequest?.status === 'approved') return '#27ae60'; // Green
    if (item.requests && item.requests.length > 0) return '#f39c12'; // Orange for pending requests
    return '#27ae60'; // Green for available
  };

  const getStatusText = (item: FoodItem) => {
    if (item.approvedRequest?.status === 'picked_up') return 'Picked Up';
    if (item.approvedRequest?.status === 'approved') return 'Approved';
    if (item.requests && item.requests.some(req => req.status === 'requested')) {
      const pendingCount = item.requests.filter(req => req.status === 'requested').length;
      return `${pendingCount} Request${pendingCount > 1 ? 's' : ''}`;
    }
    return 'Available';
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await FoodService.reviewRequest(requestId, 'approved');
      Alert.alert('Success', 'Request approved successfully!');
      loadFoodItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve request');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await FoodService.reviewRequest(requestId, 'declined');
      Alert.alert('Success', 'Request declined successfully!');
      loadFoodItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to decline request');
    }
  };

  const handleMarkPickedUp = async (requestId: string) => {
    Alert.alert(
      'Confirm Pickup',
      'Mark this item as picked up?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await FoodService.markAsPickedUp(requestId);
              Alert.alert('Success', 'Item marked as picked up!');
              loadFoodItems();
            } catch (error) {
              Alert.alert('Error', 'Failed to mark as picked up');
            }
          },
        },
      ]
    );
  };

  const handleCancelItem = async (foodItemId: string, itemTitle: string) => {
    Alert.alert(
      'Cancel Food Item',
      `Are you sure you want to cancel "${itemTitle}"? This action cannot be undone.`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await FoodService.deleteFoodItem(foodItemId);
              Alert.alert('Success', 'Food item cancelled successfully!');
              loadFoodItems();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel food item');
            }
          },
        },
      ]
    );
  };

  const showRequestOptions = (item: FoodItem) => {
    const pendingRequests = item.requests?.filter(req => req.status === 'requested') || [];
    const approvedRequest = item.requests?.find(req => req.status === 'approved');

    // If item has no requests, show cancel option
    if (!item.requests || item.requests.length === 0) {
      Alert.alert(
        'Food Item Options',
        `"${item.title}" - No requests yet`,
        [
          { text: 'Close', style: 'cancel' },
          {
            text: 'Cancel Item',
            style: 'destructive',
            onPress: () => handleCancelItem(item.id, item.title),
          },
        ]
      );
      return;
    }

    // If item has an approved request, show pickup confirmation
    if (approvedRequest && approvedRequest.status === 'approved') {
      Alert.alert(
        'Approved Request',
        `Request approved for ${approvedRequest.shelterName}`,
        [
          { text: 'Close', style: 'cancel' },
          {
            text: 'Mark Picked Up',
            onPress: () => handleMarkPickedUp(approvedRequest.id),
          },
        ]
      );
      return;
    }

    // If item has pending requests, show request management
    if (pendingRequests.length > 0) {
      const requestOptions = pendingRequests.map((request, index) => ({
        text: `${request.shelterName} (${new Date(request.requestedAt.seconds * 1000).toLocaleDateString()})`,
        onPress: () => {
          Alert.alert(
            'Review Request',
            `Request from ${request.shelterName}`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Decline',
                style: 'destructive',
                onPress: () => handleDeclineRequest(request.id),
              },
              {
                text: 'Approve',
                onPress: () => handleApproveRequest(request.id),
              },
            ]
          );
        },
      }));

      // Create options array with proper typing
      const baseOptions = [...requestOptions, { text: 'Cancel', style: 'cancel' as const }];
      
      // Add cancel item option if no requests are approved yet
      if (!item.requests.some(req => req.status === 'approved' || req.status === 'picked_up')) {
        const optionsWithCancel = [
          ...requestOptions,
          {
            text: 'Cancel Food Item',
            style: 'destructive' as const,
            onPress: () => handleCancelItem(item.id, item.title),
          },
          { text: 'Cancel', style: 'cancel' as const },
        ];
        
        Alert.alert(
          'Pending Requests',
          'Select a request to review:',
          optionsWithCancel
        );
      } else {
        Alert.alert(
          'Pending Requests',
          'Select a request to review:',
          baseOptions
        );
      }
      return;
    }

    // If item has declined requests only, show cancel option
    Alert.alert(
      'Food Item Options',
      `"${item.title}" - All requests have been declined`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Cancel Item',
          style: 'destructive',
          onPress: () => handleCancelItem(item.id, item.title),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title={`Welcome, ${state.user?.name}`}
        currentScreen="RestaurantDashboard"
        showLogo={true}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Items
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

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'active' ? '🍽️ Your Active Food Items' : '📋 Completed Items History'}
          </Text>
          
          {loading ? (
            <Text style={styles.loadingText}>
              {activeTab === 'active' ? 'Loading your food items...' : 'Loading history...'}
            </Text>
          ) : (activeTab === 'active' ? foodItems : historyItems).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {activeTab === 'active' ? 'No food items posted yet' : 'No completed items yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'active' ? 'Share some food to get started!' : 'Completed pickups will appear here!'}
              </Text>
            </View>
          ) : (
            (activeTab === 'active' ? foodItems : historyItems).map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity 
                  style={styles.itemInfo}
                  onPress={() => activeTab === 'active' ? showRequestOptions(item) : null}
                  disabled={activeTab === 'history'}
                >
                  <Text style={styles.itemName}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  <Text style={styles.itemExpiry}>
                    Expires: {new Date(item.expiryTime.seconds * 1000).toLocaleDateString()}
                  </Text>
                  {activeTab === 'active' && item.requests && item.requests.length > 0 && (
                    <Text style={styles.requestInfo}>
                      👥 {item.requests.filter(req => req.status === 'requested').length} pending, {' '}
                      {item.requests.filter(req => req.status === 'approved').length} approved, {' '}
                      {item.requests.filter(req => req.status === 'picked_up').length} picked up
                    </Text>
                  )}
                  {activeTab === 'history' && item.approvedRequest && (
                    <Text style={styles.requestInfo}>
                      ✅ Picked up by {item.approvedRequest.shelterName} on{' '}
                      {item.approvedRequest.pickedUpAt ? 
                        new Date(item.approvedRequest.pickedUpAt.seconds * 1000).toLocaleDateString() : 
                        'Unknown date'
                      }
                    </Text>
                  )}
                </TouchableOpacity>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
                  <Text style={styles.statusText}>
                    {activeTab === 'history' ? '✅ Completed' : getStatusText(item)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Button
            title="Post More Items"
            onPress={() => navigation.navigate('ShareFood')}
            style={styles.postButton}
          />
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
    section: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    itemCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...shadows,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    itemQuantity: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
    },
    itemDescription: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    itemExpiry: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    requestInfo: {
      fontSize: typography.sizes.small,
      color: colors.primary,
      marginTop: spacing.xs,
      fontWeight: typography.fontWeightMedium,
    },
    loadingText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: typography.sizes.medium,
      marginTop: spacing.lg,
    },
    emptyState: {
      alignItems: 'center',
      padding: spacing.xl,
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
    },
    statusText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
    postButton: {
      marginTop: spacing.sm,
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
  });
