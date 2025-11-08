import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Package, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react-native';
import { Header } from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FoodService, FoodItemRequest, FoodItem } from '../../services/FoodService';
import { formatDate } from '../../utils';

export const ShelterHistory: React.FC = () => {
  const { state } = useAuth();
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [historyItems, setHistoryItems] = useState<(FoodItemRequest & { foodItem?: FoodItem })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalPickedUp: 0,
    totalMeals: 0,
    activeMonths: 0,
  });

  useEffect(() => {
    loadHistory();
  }, [state.user?.id]);

  const getDateGroup = (timestamp: any) => {
    if (!timestamp?.seconds) return 'Older';
    
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return 'This Week';
    if (diffDays <= 30) return 'This Month';
    return 'Older';
  };

  const groupItemsByDate = (items: (FoodItemRequest & { foodItem?: FoodItem })[]) => {
    const groups: { [key: string]: (FoodItemRequest & { foodItem?: FoodItem })[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': [],
      'Older': []
    };
    
    items.forEach(item => {
      const group = getDateGroup(item.pickedUpAt);
      groups[group].push(item);
    });
    
    return groups;
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      if (state.user?.id) {
        const allRequests = await FoodService.getShelterRequestsWithFoodDetails(state.user.id);
        // Only show picked up items in history
        const pickedUpItems = allRequests.filter(req => req.status === 'picked_up');
        
        // Sort by pickup date, newest first
        const sortedItems = pickedUpItems.sort((a, b) => {
          const aTime = a.pickedUpAt?.seconds || 0;
          const bTime = b.pickedUpAt?.seconds || 0;
          return bTime - aTime;
        });
        
        setHistoryItems(sortedItems);

        // Calculate stats
        const totalMeals = pickedUpItems.reduce((sum, item) => {
          const qty = parseInt(item.foodItem?.quantity || '1');
          return sum + qty;
        }, 0);

        // Calculate active months from first request
        const oldestItem = allRequests.reduce((oldest, item) => {
          if (!oldest || (item.requestedAt?.seconds || 0) < (oldest.requestedAt?.seconds || 0)) {
            return item;
          }
          return oldest;
        }, allRequests[0]);
        
        const activeMonths = oldestItem?.requestedAt ? 
          Math.max(1, Math.ceil((Date.now() - oldestItem.requestedAt.seconds * 1000) / (1000 * 60 * 60 * 24 * 30))) : 0;

        setStats({
          totalRequests: allRequests.length,
          totalPickedUp: pickedUpItems.length,
          totalMeals,
          activeMonths,
        });
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const renderHistoryGroups = () => {
    const groupedItems = groupItemsByDate(historyItems);
    const orderedGroups = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];
    
    return (
      <>
        {orderedGroups
          .filter(groupName => groupedItems[groupName].length > 0)
          .map(groupName => {
            const items = groupedItems[groupName];
            
            return (
              <View key={groupName} style={styles.dateGroup}>
                <Text style={styles.dateGroupTitle}>{groupName}</Text>
                {items.map((request) => (
                  <View key={request.id} style={styles.modernItemCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.modernItemName}>
                        {request.foodItem?.title || 'Unknown Item'}
                      </Text>
                      <View style={styles.modernStatusBadge}>
                        <CheckCircle size={12} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.modernStatusText}>Completed</Text>
                      </View>
                    </View>
                    
                    <View style={styles.restaurantRow}>
                      <Package size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.modernRestaurantName}>
                        {request.foodItem?.restaurantName || 'Unknown'}
                      </Text>
                    </View>

                    {request.foodItem?.description && (
                      <Text style={styles.modernItemDescription} numberOfLines={2}>
                        {request.foodItem.description}
                      </Text>
                    )}

                    <View style={styles.modernMetaRow}>
                      {request.foodItem?.quantity && (
                        <View style={styles.modernMetaItem}>
                          <Text style={styles.modernMetaLabel}>Qty:</Text>
                          <Text style={styles.modernMetaText}>{request.foodItem.quantity}</Text>
                        </View>
                      )}
                      <View style={styles.modernMetaDivider} />
                      <View style={styles.modernMetaItem}>
                        <Clock size={12} color={colors.textSecondary} strokeWidth={2} />
                        <Text style={styles.modernMetaText}>
                          {request.pickedUpAt ? formatDate(request.pickedUpAt) : 'Unknown date'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="History" showLogo={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="History" showLogo={true} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Overall Impact</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color={colors.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{stats.totalRequests}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={24} color={colors.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{stats.totalPickedUp}</Text>
              <Text style={styles.statLabel}>Picked Up</Text>
            </View>
            <View style={styles.statCard}>
              <Package size={24} color={colors.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{stats.totalMeals}</Text>
              <Text style={styles.statLabel}>Meals Received</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color={colors.primary} strokeWidth={2} />
              <Text style={styles.statValue}>{stats.activeMonths}mo</Text>
              <Text style={styles.statLabel}>Active Since</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup History</Text>
          {historyItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No completed pickups yet. Request food items from the Home tab!
              </Text>
            </View>
          ) : (
            <View>
              {renderHistoryGroups()}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    letterSpacing: 0.2,
  },
  dateGroup: {
    marginBottom: spacing.xl,
  },
  dateGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
    paddingLeft: spacing.xs,
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Modern Card Styles
  modernItemCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  modernItemName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
    letterSpacing: 0.2,
  },
  modernStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
  },
  modernStatusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  modernRestaurantName: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  modernItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  modernMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    borderRadius: borderRadius.md,
  },
  modernMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  modernMetaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modernMetaText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  modernMetaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    opacity: 0.3,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
