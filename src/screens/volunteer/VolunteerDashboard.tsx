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
import { useAuth } from '../../context/AuthContext';

export const VolunteerDashboard: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { state } = useAuth();
  const styles = getStyles(isDarkMode);

  const stats = [
    { label: 'Deliveries Made', value: '32' },
    { label: 'Miles Driven', value: '240' },
    { label: 'Active Pickups', value: '2' },
  ];

  const availablePickups = [
    {
      id: '1',
      restaurant: 'Mario\'s Kitchen',
      destination: 'Hope Shelter',
      items: 'Pizza slices (12)',
      distance: '2.3 miles',
      time: '15 min',
    },
    {
      id: '2',
      restaurant: 'Green Garden Café',
      destination: 'Community Center',
      items: 'Fresh salads (8)',
      distance: '1.8 miles',
      time: '12 min',
    },
  ];

  const recentDeliveries = [
    { id: '1', route: 'Downtown Deli → Family Shelter', status: 'Completed', time: '2 hours ago' },
    { id: '2', route: 'Pizza Palace → Youth Center', status: 'Completed', time: '5 hours ago' },
    { id: '3', route: 'Healthy Eats → Senior Center', status: 'In Progress', time: 'Now' },
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
          <Text style={styles.sectionTitle}>📊 Your Volunteer Stats</Text>
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
          <Text style={styles.sectionTitle}>🚗 Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Find Pickups"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="My Schedule"
              onPress={() => {}}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Available Pickups</Text>
          {availablePickups.map((pickup) => (
            <View key={pickup.id} style={styles.pickupCard}>
              <View style={styles.pickupHeader}>
                <Text style={styles.pickupRoute}>
                  {pickup.restaurant} → {pickup.destination}
                </Text>
                <View style={styles.distanceInfo}>
                  <Text style={styles.distance}>{pickup.distance}</Text>
                  <Text style={styles.time}>{pickup.time}</Text>
                </View>
              </View>
              <Text style={styles.pickupItems}>{pickup.items}</Text>
              <Button
                title="Accept Pickup"
                onPress={() => {}}
                style={styles.acceptButton}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Deliveries</Text>
          {recentDeliveries.map((delivery) => (
            <View key={delivery.id} style={styles.deliveryCard}>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryRoute}>{delivery.route}</Text>
                <Text style={styles.deliveryTime}>{delivery.time}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(delivery.status) }
              ]}>
                <Text style={styles.statusText}>{delivery.status}</Text>
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
    case 'Completed': return '#27ae60';
    case 'In Progress': return '#3498db';
    case 'Cancelled': return '#e74c3c';
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
    color: '#e67e22',
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
  pickupCard: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pickupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pickupRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  distanceInfo: {
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
  },
  time: {
    fontSize: 12,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
  },
  pickupItems: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
    marginBottom: 12,
  },
  acceptButton: {
    marginTop: 8,
  },
  deliveryCard: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 4,
  },
  deliveryTime: {
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
