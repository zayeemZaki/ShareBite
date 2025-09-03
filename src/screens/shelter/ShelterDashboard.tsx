import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { FoodCard } from '../../components/FoodCard';
import { useAuth } from '../../context/AuthContext';

export const ShelterDashboard: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { state } = useAuth();
  const styles = getStyles(isDarkMode);

  const stats = [
    { label: 'Food Received', value: '18' },
    { label: 'People Fed', value: '120' },
    { label: 'Active Requests', value: '3' },
  ];

  const availableFood = [
    {
      id: '1',
      title: '🍕 Pizza Slices',
      details: '8 slices • 0.3 miles away',
      description: 'Fresh pizza from Mario\'s Kitchen',
    },
    {
      id: '2',
      title: '🥗 Fresh Salad',
      details: '5 bowls • 0.5 miles away',
      description: 'Organic mixed greens with dressing',
    },
  ];

  const recentRequests = [
    { id: '1', item: 'Breakfast items', quantity: 'For 50 people', status: 'Pending' },
    { id: '2', item: 'Dinner meals', quantity: 'For 30 people', status: 'Fulfilled' },
    { id: '3', item: 'Fresh produce', quantity: 'Any amount', status: 'Pending' },
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
          <Text style={styles.sectionTitle}>📊 Shelter Statistics</Text>
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
          <Text style={styles.sectionTitle}>🍽️ Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Request Food"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="View My Requests"
              onPress={() => {}}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥘 Available Food Near You</Text>
          {availableFood.map(item => (
            <FoodCard key={item.id} item={item} isDarkMode={isDarkMode} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Requests</Text>
          {recentRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestItem}>{request.item}</Text>
                <Text style={styles.requestQuantity}>{request.quantity}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(request.status) }
              ]}>
                <Text style={styles.statusText}>{request.status}</Text>
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
    case 'Pending': return '#f39c12';
    case 'Fulfilled': return '#27ae60';
    case 'Rejected': return '#e74c3c';
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
    color: '#27ae60',
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
  requestCard: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
  },
  requestItem: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 4,
  },
  requestQuantity: {
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
