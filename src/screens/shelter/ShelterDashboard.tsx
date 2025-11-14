import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { MapPin, Package, Clock, Check, AlertTriangle, FileText, Calendar, Store } from 'lucide-react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FoodService, FoodItem, FoodItemRequest } from '../../services/FoodService';
import { useCustomAlert } from '../../hooks/useCustomAlert';

const { width } = Dimensions.get('window');

export const ShelterDashboard: React.FC = () => {
  const { state } = useAuth();
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);
  const { showSuccessAlert, showErrorAlert, showConfirmAlert, showInfoAlert, AlertComponent } = useCustomAlert();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [requestedItems, setRequestedItems] = useState<(FoodItemRequest & { foodItem?: FoodItem })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'latest'>('latest');
  const [activeTab, setActiveTab] = useState<'available' | 'requested'>('available');

  const isExpired = (expiryTime: any): boolean => {
    if (!expiryTime) return false;
    const expiryDate = new Date(expiryTime.seconds * 1000);
    return expiryDate < new Date();
  };

  useEffect(() => {
    loadData();
  }, [state.user?.id, activeTab]);

  const loadData = async () => {
    if (activeTab === 'available') {
      loadAvailableFoodItems();
    } else if (activeTab === 'requested') {
      loadRequestedItems();
    }
  };

  const loadAvailableFoodItems = async () => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      const items = await FoodService.getAvailableFoodItemsForShelter(state.user.id);
      setFoodItems(items);
    } catch (error) {
      showErrorAlert('Error', 'Failed to load available food items');
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
      showErrorAlert('Error', 'Failed to load requested items');
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
    showConfirmAlert(
      'Request Food',
      `Do you want to request "${item.title}" from ${item.restaurantName}?`,
      async () => {
        try {
          if (state.user?.id && state.user?.name) {
            await FoodService.requestFoodItem(item.id, state.user.id, state.user.name);
            showSuccessAlert('Success', 'Food item requested successfully!');
            loadAvailableFoodItems(); // Refresh the list
          }
        } catch (error) {
          showErrorAlert('Error', error instanceof Error ? error.message : 'Failed to request food item');
        }
      },
      'REQUEST',
      'CANCEL'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return colors.warning;      // Warning
      case 'approved': return colors.success;       // Success
      case 'declined': return colors.error;         // Error
      case 'picked_up': return colors.primary;      // Accent
      default: return colors.textSecondary;         // Grey
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
    const aExpired = isExpired(a.expiryTime);
    const bExpired = isExpired(b.expiryTime);
    
    // Expired items go to bottom
    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;
    
    // Among non-expired, sort by preference
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
    showInfoAlert('Contact Restaurant', `Contacting restaurant (ID: ${restaurantId})`);
  };

  const requestCounts = {
    available: sortedFoodItems.length,
    requested: requestedItems.length,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title={`Welcome, ${state.user?.name}`}
          showLogo={true}
        />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>


        {/* Modern Tab Selector */}
        <View style={styles.modernTabContainer}>
          <TouchableOpacity
            style={[styles.modernTab, activeTab === 'available' && styles.modernTabActive]}
            onPress={() => setActiveTab('available')}
            activeOpacity={0.8}
          >
            <View style={styles.modernTabContent}>
              <Package size={18} color={activeTab === 'available' ? colors.surface : colors.textSecondary} strokeWidth={2} />
              <View>
                <Text style={[styles.modernTabText, activeTab === 'available' && styles.modernTabTextActive]}>
                  Available
                </Text>
                <Text style={[styles.modernTabCount, activeTab === 'available' && styles.modernTabCountActive]}>
                  {requestCounts.available} items
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modernTab, activeTab === 'requested' && styles.modernTabActive]}
            onPress={() => setActiveTab('requested')}
            activeOpacity={0.8}
          >
            <View style={styles.modernTabContent}>
              <FileText size={18} color={activeTab === 'requested' ? colors.surface : colors.textSecondary} strokeWidth={2} />
              <View>
                <Text style={[styles.modernTabText, activeTab === 'requested' && styles.modernTabTextActive]}>
                  My Requests
                </Text>
                <Text style={[styles.modernTabCount, activeTab === 'requested' && styles.modernTabCountActive]}>
                  {requestCounts.requested} requests
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === 'available' && (
          <View style={styles.sortSection}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'latest' && styles.sortChipActive]}
                onPress={() => setSortBy('latest')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color={sortBy === 'latest' ? colors.surface : colors.textSecondary} strokeWidth={2} />
                  <Text style={[styles.sortChipText, sortBy === 'latest' && styles.sortChipTextActive]}>
                    Latest
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'distance' && styles.sortChipActive]}
                onPress={() => setSortBy('distance')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color={sortBy === 'distance' ? colors.surface : colors.textSecondary} strokeWidth={2} />
                  <Text style={[styles.sortChipText, sortBy === 'distance' && styles.sortChipTextActive]}>
                    Distance
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'available' ? (
          // Available Food Items
          <View style={styles.itemsContainer}>
            {sortedFoodItems.length === 0 ? (
              <View style={styles.emptyStateModern}>
                <View style={styles.emptyIconContainer}>
                  <Package size={40} color={colors.textSecondary} strokeWidth={2} />
                </View>
                <Text style={styles.emptyTextModern}>No Available Items</Text>
                <Text style={styles.emptySubtextModern}>
                  Check back soon for new food items from local restaurants
                </Text>
              </View>
            ) : (
              sortedFoodItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.modernFoodCard, { marginTop: index === 0 ? 0 : spacing.md }]}
                  onPress={() => handleRequestFood(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.modernFoodTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                      {isExpired(item.expiryTime) ? (
                        <View style={[styles.availableBadge, { backgroundColor: colors.error }]}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <AlertTriangle size={12} color={colors.surface} strokeWidth={2.5} />
                            <Text style={styles.availableText}>Expired</Text>
                          </View>
                        </View>
                      ) : item.isAvailable ? (
                        <View style={styles.availableBadge}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Check size={12} color={colors.surface} strokeWidth={2.5} />
                            <Text style={styles.availableText}>Available</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Store size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.modernRestaurantName}>{item.restaurantName}</Text>
                    </View>
                  </View>

                  <Text style={styles.modernDescription} numberOfLines={3} ellipsizeMode="tail">
                    {item.description}
                  </Text>

                  <View style={styles.modernMetaRow}>
                    <View style={styles.modernMetaItem}>
                      <Text style={styles.modernMetaText}>Qty: {item.quantity}</Text>
                    </View>
                    <View style={styles.modernMetaDivider} />
                    <View style={styles.modernMetaItem}>
                      <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.modernMetaText}>
                        {new Date(item.expiryTime.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                    <View style={styles.modernMetaDivider} />
                    <View style={styles.modernMetaItem}>
                      <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.modernMetaText}>
                        {new Date(item.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.tapToRequest}>Tap to request this item</Text>
                    <Text style={styles.footerArrow}>→</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          // Requested Items (excluding picked up)
          <View style={styles.itemsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading your requests...</Text>
              </View>
            ) : requestedItems.length === 0 ? (
              <View style={styles.emptyStateModern}>
                <View style={styles.emptyIconContainer}>
                  <FileText size={40} color={colors.textSecondary} strokeWidth={2} />
                </View>
                <Text style={styles.emptyTextModern}>No Active Requests</Text>
                <Text style={styles.emptySubtextModern}>
                  Request food items from the Available tab to see them here
                </Text>
              </View>
            ) : (
                requestedItems.map((request, index) => (
                <View 
                  key={request.id} 
                  style={[styles.modernFoodCard, { marginTop: index === 0 ? 0 : spacing.md }]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.modernFoodTitle} numberOfLines={1} ellipsizeMode="tail">
                        {request.foodItem?.title || 'Unknown Item'}
                      </Text>
                      <View style={[styles.modernStatusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                        <Text style={styles.modernStatusText}>{getStatusText(request.status)}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Store size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.modernRestaurantName}>
                        {request.foodItem?.restaurantName || 'Unknown'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modernDescription} numberOfLines={3} ellipsizeMode="tail">
                    {request.foodItem?.description || 'No description available'}
                  </Text>

                  <View style={styles.modernMetaRow}>
                    <View style={styles.modernMetaItem}>
                      <Text style={styles.modernMetaText}>
                        {request.requestedAt ? new Date(request.requestedAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
                      </Text>
                    </View>
                    {request.reviewedAt && (
                      <>
                        <View style={styles.modernMetaDivider} />
                        <View style={styles.modernMetaItem}>
                          <Check size={14} color={colors.success} strokeWidth={2} />
                          <Text style={styles.modernMetaText}>Reviewed</Text>
                        </View>
                      </>
                    )}
                  </View>

                  {request.status === 'approved' && request.foodItem && (
                    <View style={styles.modernPickupInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs }}>
                        <MapPin size={16} color={colors.success} strokeWidth={2} />
                        <Text style={styles.modernPickupTitle}>Pickup Details</Text>
                      </View>
                      <Text style={styles.modernPickupText}>{request.foodItem.restaurantAddress}</Text>
                      {request.foodItem.restaurantPhone && (
                        <Text style={styles.modernPickupText}>{request.foodItem.restaurantPhone}</Text>
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        <View style={[styles.bottomSpacing, { height: Platform.OS === 'ios' ? 100 : 85 }]} />
      </ScrollView>

        {AlertComponent}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
      backgroundColor: colors.primary,
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
      backgroundColor: colors.error,
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
      backgroundColor: colors.success,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    requestedBadgeText: {
      color: colors.surface,
      fontWeight: typography.fontWeights?.semibold || '600',
      fontSize: typography.sizes.caption,
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
      backgroundColor: colors.surfaceVariant,
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
      backgroundColor: colors.successLight,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
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
    // Modern Hero Section Styles
    heroSection: {
      marginBottom: spacing.lg,
    },
    heroCard: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      ...shadows,
    },
    heroGreeting: {
      fontSize: typography.sizes.h1,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.surface,
      marginBottom: spacing.xs,
    },
    heroSubtext: {
      fontSize: typography.sizes.bodyLarge,
      color: colors.surface,
      opacity: 0.9,
      marginBottom: spacing.lg,
    },
    // Modern Tab Styles
    modernTabContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      borderRadius: borderRadius.xl,
      padding: 4,
      marginBottom: spacing.lg,
    },
    modernTab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
    },
    modernTabActive: {
      backgroundColor: colors.primary,
      ...shadows,
    },
    modernTabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    modernTabText: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textSecondary,
      marginRight: spacing.xs,
    },
    modernTabTextActive: {
      color: colors.surface,
    },
    modernTabCount: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.md,
      minWidth: 24,
      alignItems: 'center',
    },
    modernTabCountActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    // Sort Section Styles
    sortSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    sortChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.xl,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    sortChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sortChipText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      fontWeight: typography.fontWeightMedium,
    },
    sortChipTextActive: {
      color: colors.surface,
    },
    // Modern Food Card Styles
    itemsContainer: {
      paddingBottom: spacing.md,
    },
    modernFoodCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    cardHeader: {
      marginBottom: spacing.md,
    },
    cardTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    modernFoodTitle: {
      fontSize: typography.sizes.xl || 18,
      fontWeight: typography.fontWeightBold || '700',
      color: colors.textPrimary,
      flex: 1,
      marginRight: spacing.md,
      maxWidth: '70%',
    },
    availableBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
    availableText: {
      color: colors.surface,
      fontSize: typography.sizes.caption,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    modernStatusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
    modernStatusText: {
      color: colors.surface,
      fontSize: typography.sizes.caption,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    modernRestaurantName: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      fontWeight: typography.fontWeightMedium,
    },
    modernDescription: {
      fontSize: typography.sizes.regular || 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.md,
      flexShrink: 1,
      width: '100%',
    },
    modernMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    },
    modernMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modernMetaIcon: {
      fontSize: 14,
      marginRight: spacing.xs,
    },
    modernMetaText: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
    },
    modernMetaDivider: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textSecondary,
      opacity: 0.3,
      marginHorizontal: spacing.sm,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    },
    tapToRequest: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    footerArrow: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    modernPickupInfo: {
      backgroundColor: colors.successLight,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: colors.success,
    },
    modernPickupTitle: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    modernPickupText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    // Modern Empty State
    emptyStateModern: {
      alignItems: 'center',
      paddingVertical: spacing.xxl * 2,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    emptyTextModern: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    emptySubtextModern: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.xl,
    },
    bottomSpacing: {
      height: spacing.xl,
    },
  });