import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';

export const RestaurantHistory: React.FC = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const historyStats = [
    { label: 'Total Food Items Shared', value: '156' },
    { label: 'Total Families Helped', value: '892' },
    { label: 'Total Waste Reduced', value: '1,245 lbs' },
    { label: 'Active Since', value: 'Jan 2023' },
  ];

  const previousItems = [
    { id: '1', item: 'Pizza Slices', quantity: '24 slices', date: '2024-01-15', status: 'Delivered' },
    { id: '2', item: 'Fresh Salad', quantity: '15 bowls', date: '2024-01-14', status: 'Delivered' },
    { id: '3', item: 'Bread Loaves', quantity: '12 loaves', date: '2024-01-13', status: 'Delivered' },
    { id: '4', item: 'Pasta Dishes', quantity: '8 servings', date: '2024-01-12', status: 'Delivered' },
  ];

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
            {historyStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Previous Food Items Uploaded</Text>
          {previousItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.item}</Text>
                <Text style={styles.itemDetails}>{item.quantity} • {item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
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
