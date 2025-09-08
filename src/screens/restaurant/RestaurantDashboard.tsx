import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

export const RestaurantDashboard: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { state } = useAuth();
  const navigation = useNavigation();
  const styles = getStyles(isDarkMode);

  const stats = [
    { label: 'Food Items Shared', value: '24' },
    { label: 'Families Fed', value: '150' },
    { label: 'Waste Reduced', value: '45 lbs' },
  ];

  const recentShares = [
    { id: '1', item: 'Pizza Slices', quantity: '12 slices', status: 'Claimed' },
    { id: '2', item: 'Fresh Salad', quantity: '5 bowls', status: 'Available' },
    { id: '3', item: 'Bread Loaves', quantity: '8 loaves', status: 'Delivered' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={`Welcome, ${state.user?.name}`}
        showLogout={true}
        isDarkMode={isDarkMode}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Impact!</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Quick Actions!</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Share New Fooood"
              onPress={() => navigation.navigate('ShareFood')}
              style={styles.actionButton}
            />
            <Button
              title="View My Listings"
              onPress={() => {}}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Shares</Text>
          {recentShares.map((share) => (
            <View key={share.id} style={styles.shareCard}>
              <View style={styles.shareInfo}>
                <Text style={styles.shareItem}>{share.item}</Text>
                <Text style={styles.shareQuantity}>{share.quantity}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(share.status) }
              ]}>
                <Text style={styles.statusText}>{share.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available': return '#f39c12';
    case 'Claimed': return '#3498db';
    case 'Delivered': return '#27ae60';
    default: return '#95a5a6';
  }
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
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
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498db',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  shareCard: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareInfo: {
    flex: 1,
  },
  shareItem: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 4,
  },
  shareQuantity: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
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
