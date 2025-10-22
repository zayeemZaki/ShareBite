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
import { FoodService, FoodItem } from '../../services/FoodService';

export const RestaurantHistory: React.FC = () => {
  const { colors } = useTheme();
  const { state } = useAuth();
  const styles = getStyles(colors);

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

  const loadHistoryData = async () => {
    if (!state.user) return;
    
    try {
      setLoading(true);
      const items = await FoodService.getFoodItemsByRestaurant(state.user.id);
      setHistoryItems(items);
      
      // Calculate real stats from the data
      const deliveredItems = items.filter(item => 
        item.approvedRequest && item.approvedRequest.status === 'picked_up'
      );
      
      const totalWeight = deliveredItems.reduce((sum, item) => {
        // Estimate weight based on quantity (simple heuristic)
        const qty = parseInt(item.quantity) || 1;
        return sum + (qty * 0.5); // Assume 0.5 lbs per item average
      }, 0);

      // Calculate active months
      const firstItem = items[items.length - 1];
      const activeMonths = firstItem ? 
        Math.max(1, Math.ceil((Date.now() - firstItem.createdAt.seconds * 1000) / (1000 * 60 * 60 * 24 * 30))) : 0;

      setStats({
        totalItems: items.length,
        totalDelivered: deliveredItems.length,
        totalWeight: Math.round(totalWeight),
        activeMonths,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load history data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'Unknown date';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
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

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderWithBurger
          title="Restaurant History"
          currentScreen="RestaurantHistory"
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
      <HeaderWithBurger
        title="Restaurant History"
        currentScreen="RestaurantHistory"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Overall Impact</Text>
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
          <Text style={styles.sectionTitle}>🍽️ Food Items History</Text>
          {historyItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No food items shared yet. Start sharing to see your history!
              </Text>
            </View>
          ) : (
            historyItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.title}</Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} • {formatDate(item.createdAt)}
                  </Text>
                  {item.approvedRequest && (
                    <Text style={styles.itemShelter}>
                      Delivered to: {item.approvedRequest.shelterName}
                    </Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
                  <Text style={styles.statusText}>{getStatusText(item)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
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
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemShelter: {
    fontSize: 12,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
