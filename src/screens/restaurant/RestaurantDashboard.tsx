import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { FoodService, FoodItem, FoodItemRequest } from '../../services/FoodService';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import { 
  getFoodItemStatusColor,
  getFoodItemStatusText,
  isExpired,
  sortFoodItems,
  formatDate,
  formatShortDate,
} from '../../utils';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const RestaurantDashboard: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const navigation = useReactNavigation<NavigationProp>();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);
  const { showSuccessAlert, showErrorAlert, showConfirmAlert, AlertComponent } = useCustomAlert();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);

  const loadFoodItems = async () => {
    try {
      if (state.user?.id) {
        const items = await FoodService.getRestaurantFoodItemsWithRequests(state.user.id);
        
        // Filter out picked up items
        const activeItems = items.filter(item => 
          !item.approvedRequest || item.approvedRequest.status !== 'picked_up'
        );

        // Sort items using utility function
        const sortedItems = sortFoodItems(activeItems);
        
        setFoodItems(sortedItems);
      }
    } catch (error) {
      showErrorAlert('Error', 'Failed to load food items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, [state.user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFoodItems();
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await FoodService.reviewRequest(requestId, 'approved');
      showSuccessAlert('Success', 'Request approved successfully!');
      loadFoodItems();
    } catch (error) {
      showErrorAlert('Error', 'Failed to approve request');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await FoodService.reviewRequest(requestId, 'declined');
      showSuccessAlert('Success', 'Request declined successfully!');
      loadFoodItems();
    } catch (error) {
      showErrorAlert('Error', 'Failed to decline request');
    }
  };

  const handleMarkPickedUp = async (requestId: string) => {
    showConfirmAlert(
      'Confirm Pickup',
      'Mark this item as picked up?',
      async () => {
        try {
          await FoodService.markAsPickedUp(requestId);
          showSuccessAlert('Success', 'Item marked as picked up!');
          loadFoodItems();
        } catch (error) {
          showErrorAlert('Error', 'Failed to mark as picked up');
        }
      },
      'CONFIRM',
      'CANCEL'
    );
  };

  const handleCancelItem = async (foodItemId: string, itemTitle: string) => {
    showConfirmAlert(
      'Cancel Food Item',
      `Are you sure you want to cancel "${itemTitle}"? This action cannot be undone.`,
      async () => {
        try {
          await FoodService.deleteFoodItem(foodItemId);
          showSuccessAlert('Success', 'Food item cancelled successfully!');
          loadFoodItems();
        } catch (error) {
          showErrorAlert('Error', 'Failed to cancel food item');
        }
      },
      'YES, CANCEL',
      'NO'
    );
  };

  const showRequestOptions = (item: FoodItem) => {
    setSelectedFoodItem(item);
    setRequestModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header
        title={`Welcome, ${state.user?.name}`}
        showLogo={true}
        showShareButton={true}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          
          {loading ? (
            <Text style={styles.loadingText}>
              Loading your food items...
            </Text>
          ) : foodItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No Active Items</Text>
              <Text style={styles.emptySubtext}>
                Share your surplus food with local shelters
              </Text>
            </View>
          ) : (
            foodItems.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.foodItemCard,
                  { 
                    marginTop: index === 0 ? 0 : spacing.sm,
                  }
                ]}
                onPress={() => showRequestOptions(item)}
                activeOpacity={0.7}
              >
                <View style={styles.itemCardHeader}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.foodItemTitle}>{item.title}</Text>
                    <View style={[styles.modernStatusBadge, { backgroundColor: getFoodItemStatusColor(item) }]}>
                      <Text style={styles.modernStatusText}>{getFoodItemStatusText(item)}</Text>
                    </View>
                  </View>
                  <Text style={styles.foodItemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>

                <View style={styles.itemCardMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Quantity:</Text>
                    <Text style={styles.metaText}>{item.quantity}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Expires:</Text>
                    <Text style={styles.metaText}>
                      {formatShortDate(item.expiryTime)}
                    </Text>
                  </View>
                  {item.requests && item.requests.length > 0 && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Requests:</Text>
                      <Text style={styles.metaText}>
                        {item.requests.filter(req => req.status === 'requested').length}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemCardFooter}>
                  <Text style={styles.tapToManage}>Tap to manage</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Request Management Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={requestModalVisible}
        onRequestClose={() => setRequestModalVisible(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRequestModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContainer}
            activeOpacity={1}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Requests</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setRequestModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedFoodItem && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Food Item Info */}
                <View style={styles.modalFoodInfo}>
                  <Text style={styles.modalFoodTitle}>{selectedFoodItem.title}</Text>
                  <Text style={styles.modalFoodMeta}>
                    {selectedFoodItem.quantity} • Expires {formatDate(selectedFoodItem.expiryTime)}
                  </Text>
                </View>

                {/* Check if no requests */}
                {(!selectedFoodItem.requests || selectedFoodItem.requests.length === 0) && (
                  <View style={styles.noRequestsContainer}>
                    <Text style={styles.noRequestsIcon}>📭</Text>
                    <Text style={styles.noRequestsText}>No Requests Yet</Text>
                    <Text style={styles.noRequestsSubtext}>
                      Shelters will see your item and can request it
                    </Text>
                    <TouchableOpacity
                      style={styles.modalCancelItemButton}
                      onPress={() => {
                        setRequestModalVisible(false);
                        handleCancelItem(selectedFoodItem.id, selectedFoodItem.title);
                      }}
                    >
                      <Text style={styles.modalCancelItemText}>Cancel Item</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Check if has approved request */}
                {selectedFoodItem.approvedRequest && selectedFoodItem.approvedRequest.status === 'approved' && (
                  <View style={styles.approvedRequestContainer}>
                    <View style={styles.approvedBadge}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Check size={14} color={colors.surface} strokeWidth={2.5} />
                        <Text style={styles.approvedBadgeText}>APPROVED</Text>
                      </View>
                    </View>
                    <Text style={styles.approvedShelterName}>{selectedFoodItem.approvedRequest.shelterName}</Text>
                    <Text style={styles.approvedDate}>
                      Approved on {formatDate(selectedFoodItem.approvedRequest.requestedAt)}
                    </Text>
                    <TouchableOpacity
                      style={styles.markPickedUpButton}
                      onPress={() => {
                        setRequestModalVisible(false);
                        handleMarkPickedUp(selectedFoodItem.approvedRequest!.id);
                      }}
                    >
                      <Text style={styles.markPickedUpText}>Mark as Picked Up</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Pending Requests */}
                {selectedFoodItem.requests && selectedFoodItem.requests.filter(req => req.status === 'requested').length > 0 && (
                  <View style={styles.pendingRequestsSection}>
                    <Text style={styles.pendingRequestsTitle}>Pending Requests ({selectedFoodItem.requests.filter(req => req.status === 'requested').length})</Text>
                    {selectedFoodItem.requests
                      .filter(req => req.status === 'requested')
                      .map((request) => (
                        <View key={request.id} style={styles.requestCard}>
                          <View style={styles.requestCardHeader}>
                            <Text style={styles.requestShelterName}>{request.shelterName}</Text>
                            <Text style={styles.requestDate}>
                              {formatShortDate(request.requestedAt)}
                            </Text>
                          </View>
                          <View style={styles.requestActions}>
                            <TouchableOpacity
                              style={styles.declineButton}
                              onPress={() => {
                                setRequestModalVisible(false);
                                handleDeclineRequest(request.id);
                              }}
                            >
                              <Text style={styles.declineButtonText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.approveButton}
                              onPress={() => {
                                setRequestModalVisible(false);
                                handleApproveRequest(request.id);
                              }}
                            >
                              <Text style={styles.approveButtonText}>Approve</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                  </View>
                )}

                {/* Declined Requests Info */}
                {selectedFoodItem.requests && 
                 selectedFoodItem.requests.filter(req => req.status === 'requested').length === 0 &&
                 selectedFoodItem.requests.filter(req => req.status === 'declined').length > 0 &&
                 !selectedFoodItem.approvedRequest && (
                  <View style={styles.declinedInfoContainer}>
                    <Text style={styles.declinedInfoText}>
                      All requests have been declined
                    </Text>
                    <TouchableOpacity
                      style={styles.modalCancelItemButton}
                      onPress={() => {
                        setRequestModalVisible(false);
                        handleCancelItem(selectedFoodItem.id, selectedFoodItem.title);
                      }}
                    >
                      <Text style={styles.modalCancelItemText}>Cancel Item</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {AlertComponent}
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
    // Section
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: 0.2,
    },
    sectionCount: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      minWidth: 32,
      textAlign: 'center',
    },
    // Food Item Card
    foodItemCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    itemCardHeader: {
      marginBottom: spacing.md,
    },
    itemTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    foodItemTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
      marginRight: spacing.sm,
      letterSpacing: 0.2,
    },
    modernStatusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
    },
    modernStatusText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    foodItemDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
    },
    itemCardMeta: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginBottom: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    metaLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    metaText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '700',
    },
    itemCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    tapToManage: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    arrowIcon: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '700',
    },
    // Empty State
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl * 2.5,
      paddingHorizontal: spacing.lg,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: borderRadius.xl,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      letterSpacing: 0.2,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    // Loading
    loadingText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: typography.sizes.medium,
      marginTop: spacing.xl,
    },
    // Spacing
    bottomSpacing: {
      height: spacing.xl,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: borderRadius.xxl,
      borderTopRightRadius: borderRadius.xxl,
      maxHeight: height * 0.85,
      minHeight: height * 0.85,
      borderTopWidth: 3,
      borderTopColor: colors.primary,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: 0.3,
    },
    modalCloseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalCloseText: {
      fontSize: 20,
      color: colors.textSecondary,
      fontWeight: '700',
    },
    modalContent: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    modalFoodInfo: {
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: spacing.lg,
    },
    modalFoodTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    modalFoodMeta: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    // No Requests
    noRequestsContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    noRequestsIcon: {
      fontSize: 48,
      marginBottom: spacing.lg,
      opacity: 0.5,
    },
    noRequestsText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    noRequestsSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    modalCancelItemButton: {
      backgroundColor: isDarkMode ? 'rgba(90, 56, 37, 0.2)' : 'rgba(90, 56, 37, 0.08)',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.xl,
      borderWidth: 1.5,
      borderColor: colors.error,
    },
    modalCancelItemText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.error,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    // Approved Request
    approvedRequestContainer: {
      backgroundColor: isDarkMode ? 'rgba(107, 68, 35, 0.15)' : 'rgba(107, 68, 35, 0.08)',
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.lg,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    approvedBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      marginBottom: spacing.md,
    },
    approvedBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 1,
    },
    approvedShelterName: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
    },
    approvedDate: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
    },
    markPickedUpButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.xl,
      ...shadows,
      elevation: 4,
    },
    markPickedUpText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    // Pending Requests
    pendingRequestsSection: {
      marginBottom: spacing.lg,
    },
    pendingRequestsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    requestCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    requestCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    requestShelterName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: 0.2,
    },
    requestDate: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    requestActions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    declineButton: {
      flex: 1,
      backgroundColor: isDarkMode ? 'rgba(90, 56, 37, 0.2)' : 'rgba(90, 56, 37, 0.08)',
      paddingVertical: spacing.md,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.error,
    },
    declineButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.error,
      letterSpacing: 0.3,
    },
    approveButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      ...shadows,
      elevation: 3,
    },
    approveButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    // Declined Info
    declinedInfoContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    declinedInfoText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
  });
