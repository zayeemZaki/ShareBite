import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

export const RestaurantDashboard: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { state } = useAuth();
  const navigation = useNavigation();
  const styles = getStyles(isDarkMode);

  const currentItems = [
    { id: '1', item: 'Pizza Slices', quantity: '12 slices', status: 'Available' },
    { id: '2', item: 'Fresh Salad', quantity: '5 bowls', status: 'Available' },
    { id: '3', item: 'Bread Loaves', quantity: '8 loaves', status: 'Available' },
  ];

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title={`Welcome, ${state.user?.name}`}
        isDarkMode={isDarkMode}
        currentScreen="RestaurantDashboard"
        showLogo={true}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Current Listed Food Items</Text>
          {currentItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.item}</Text>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#f39c12' }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
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
  itemCard: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
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
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 4,
  },
  itemQuantity: {
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
  postButton: {
    marginTop: 12,
  },
});
