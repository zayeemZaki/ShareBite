import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useColorScheme,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';

export const NearbyShelters: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  const shelters = [
    {
      id: '1',
      name: 'Community Food Bank',
      address: '123 Main St, Downtown',
      contact: '+1 (555) 123-4567',
      distance: '0.5 miles',
      capacity: 'High',
    },
    {
      id: '2',
      name: 'Hope Center',
      address: '456 Oak Ave, Midtown',
      contact: '+1 (555) 234-5678',
      distance: '1.2 miles',
      capacity: 'Medium',
    },
    {
      id: '3',
      name: 'Shelter for All',
      address: '789 Pine Rd, Uptown',
      contact: '+1 (555) 345-6789',
      distance: '2.1 miles',
      capacity: 'Low',
    },
    {
      id: '4',
      name: 'Food Share Network',
      address: '321 Elm St, Riverside',
      contact: '+1 (555) 456-7890',
      distance: '3.0 miles',
      capacity: 'High',
    },
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'High': return '#27ae60';
      case 'Medium': return '#f39c12';
      case 'Low': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Nearby Shelters"
        isDarkMode={isDarkMode}
        currentScreen="NearbyShelters"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Food Shelters Near You</Text>
          <Text style={styles.subtitle}>
            Connect with local shelters to share your surplus food and help those in need.
          </Text>
        </View>

        {shelters.map((shelter) => (
          <View key={shelter.id} style={styles.shelterCard}>
            <View style={styles.shelterHeader}>
              <View style={styles.shelterInfo}>
                <Text style={styles.shelterName}>{shelter.name}</Text>
                <Text style={styles.shelterAddress}>{shelter.address}</Text>
              </View>
              <View style={[styles.capacityBadge, { backgroundColor: getCapacityColor(shelter.capacity) }]}>
                <Text style={styles.capacityText}>{shelter.capacity}</Text>
              </View>
            </View>

            <View style={styles.shelterDetails}>
              <Text style={styles.distanceText}>📍 {shelter.distance} away</Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(shelter.contact)}
              >
                <Text style={styles.callButtonText}>📞 Call: {shelter.contact}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.noteTitle}>💡 How to Help</Text>
          <Text style={styles.noteText}>
            • Contact shelters directly to coordinate food donations{'\n'}
            • Check their current capacity before delivering{'\n'}
            • Ensure food is properly packaged and within safe consumption dates{'\n'}
            • Consider transportation logistics for larger donations
          </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
    marginBottom: 16,
  },
  shelterCard: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  shelterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  shelterInfo: {
    flex: 1,
  },
  shelterName: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 4,
  },
  shelterAddress: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
  },
  capacityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  capacityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  shelterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
  },
  callButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: isDarkMode ? '#bdc3c7' : '#7f8c8d',
    lineHeight: 20,
  },
});
