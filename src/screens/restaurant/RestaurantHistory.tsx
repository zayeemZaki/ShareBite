import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FoodService, FoodItem } from '../../services/FoodService';
import { formatDate } from '../../utils';

export const RestaurantHistory: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const [historyItems, setHistoryItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalDelivered: 0,
    totalWeight: 0,
    activeMonths: 0,
  });

  useEffect(() => {
    loadHistoryData();
  }, []);

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

  const groupItemsByDate = (items: FoodItem[]) => {
    const groups: { [key: string]: FoodItem[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': [],
      'Older': []
    };
    
    items.forEach(item => {
      const group = getDateGroup(item.createdAt);
      groups[group].push(item);
    });
    
    return groups;
  };

  const loadHistoryData = async () => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      // Use the method that includes request details
      const items = await FoodService.getRestaurantFoodItemsWithRequests(state.user.id);
      
      // Sort by creation date, newest first
      const sortedItems = items.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      
      setHistoryItems(sortedItems);
      
      // Calculate real stats from the data
      const deliveredItems = items.filter(item => 
        item.approvedRequest && item.approvedRequest.status === 'picked_up'
      );
      
      const totalWeight = deliveredItems.reduce((sum, item) => {
        // Estimate weight based on quantity (simple heuristic)
        const qty = parseInt(item.quantity) || 1;
        return sum + (qty * 0.5); // Assume 0.5 lbs per item average
      }, 0);

      // Calculate active months from first item created
      const oldestItem = items.reduce((oldest, item) => {
        if (!oldest || (item.createdAt?.seconds || 0) < (oldest.createdAt?.seconds || 0)) {
          return item;
        }
        return oldest;
      }, items[0]);
      
      const activeMonths = oldestItem?.createdAt ? 
        Math.max(1, Math.ceil((Date.now() - oldestItem.createdAt.seconds * 1000) / (1000 * 60 * 60 * 24 * 30))) : 0;

      setStats({
        totalItems: items.length,
        totalDelivered: deliveredItems.length,
        totalWeight: Math.round(totalWeight),
        activeMonths,
      });
    } catch (error) {
      console.error('Error loading history data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (item: FoodItem) => {
    if (item.approvedRequest?.status === 'picked_up') return colors.success;
    if (item.approvedRequest?.status === 'approved') return colors.warning;
    if (item.requests && item.requests.length > 0) return colors.info;
    return colors.textTertiary;
  };

  const getStatusText = (item: FoodItem) => {
    if (item.approvedRequest?.status === 'picked_up') return 'Delivered';
    if (item.approvedRequest?.status === 'approved') return 'Approved';
    if (item.requests && item.requests.length > 0) return 'Requested';
    return 'Available';
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
                {items.map((item) => (
                  <View key={item.id} style={styles.modernItemCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.modernItemName}>{item.title || 'Untitled'}</Text>
                      <View style={[styles.modernStatusBadge, { backgroundColor: getStatusColor(item) }]}>
                        <Text style={styles.modernStatusText}>{getStatusText(item)}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.modernItemDescription} numberOfLines={2}>
                      {item.description || 'No description'}
                    </Text>
                    
                    <View style={styles.modernMetaRow}>
                      <View style={styles.modernMetaItem}>
                        <Text style={styles.modernMetaLabel}>Quantity:</Text>
                        <Text style={styles.modernMetaText}>{item.quantity || 'N/A'}</Text>
                      </View>
                      <View style={styles.modernMetaItem}>
                        <Text style={styles.modernMetaLabel}>Created:</Text>
                        <Text style={styles.modernMetaText}>
                          {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                        </Text>
                      </View>
                    </View>

                    {item.approvedRequest && item.approvedRequest.status === 'picked_up' && (
                      <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryText}>
                          Delivered to {item.approvedRequest.shelterName || 'shelter'}
                        </Text>
                        {item.approvedRequest.pickedUpAt && (
                          <Text style={styles.deliveryDate}>
                            {formatDate(item.approvedRequest.pickedUpAt)}
                          </Text>
                        )}
                      </View>
                    )}
                    {item.approvedRequest && item.approvedRequest.status === 'approved' && (
                      <View style={styles.pendingInfo}>
                        <Text style={styles.pendingText}>
                          Awaiting pickup by {item.approvedRequest.shelterName || 'shelter'}
                        </Text>
                      </View>
                    )}
                    {item.requests && item.requests.length > 0 && !item.approvedRequest && (
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestText}>
                          {item.requests.filter(r => r.status === 'requested').length} pending request(s)
                        </Text>
                      </View>
                    )}
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
        <Header
          title="Restaurant History"
          showLogo={true}
          showShareButton={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="History"
        showLogo={true}
        showShareButton={true}
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Overall Impact</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Food Items Shared</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalDelivered}</Text>
              <Text style={styles.statLabel}>Successfully Delivered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalWeight} lbs</Text>
              <Text style={styles.statLabel}>Waste Reduced</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.activeMonths}mo</Text>
              <Text style={styles.statLabel}>Active Since</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Items History</Text>
          {historyItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No food items shared yet. Start sharing to see your history!
              </Text>
            </View>
          ) : (
            <View>
              {renderHistoryGroups()}
            </View>
          )}
        </View>
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
  modernItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  modernMetaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
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
  deliveryInfo: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: isDarkMode ? 'rgba(107, 68, 35, 0.15)' : 'rgba(107, 68, 35, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.success,
  },
  deliveryText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  deliveryDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  pendingInfo: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: isDarkMode ? 'rgba(166, 124, 82, 0.15)' : 'rgba(166, 124, 82, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  pendingText: {
    fontSize: 13,
    color: colors.warning,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  requestInfo: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: isDarkMode ? 'rgba(139, 134, 128, 0.15)' : 'rgba(139, 134, 128, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.info,
  },
  requestText: {
    fontSize: 13,
    color: colors.info,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
