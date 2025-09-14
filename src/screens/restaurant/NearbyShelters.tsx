import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useColorScheme,
  TextInput,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';

export const NearbyShelters: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [range, setRange] = useState('5'); // default 5 miles

  const shelters = [
    {
      id: '1',
      name: 'Community Food Bank',
      address: '123 Main St, Downtown',
      contact: '+1 (555) 123-4567',
      distance: 0.5,
      capacity: 'High',
      city: 'Downtown',
      state: 'CA',
    },
    {
      id: '2',
      name: 'Hope Center',
      address: '456 Oak Ave, Midtown',
      contact: '+1 (555) 234-5678',
      distance: 1.2,
      capacity: 'Medium',
      city: 'Midtown',
      state: 'CA',
    },
    {
      id: '3',
      name: 'Shelter for All',
      address: '789 Pine Rd, Uptown',
      contact: '+1 (555) 345-6789',
      distance: 2.1,
      capacity: 'Low',
      city: 'Uptown',
      state: 'CA',
    },
    {
      id: '4',
      name: 'Food Share Network',
      address: '321 Elm St, Riverside',
      contact: '+1 (555) 456-7890',
      distance: 3.0,
      capacity: 'High',
      city: 'Riverside',
      state: 'CA',
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

  const filteredShelters = shelters.filter(shelter => {
    const cityMatch = city.trim() === '' || shelter.city.toLowerCase().includes(city.trim().toLowerCase());
    const stateMatch = state.trim() === '' || shelter.state.toLowerCase().includes(state.trim().toLowerCase());
    const rangeNum = Number(range);
    const rangeMatch = isNaN(rangeNum) || shelter.distance <= rangeNum;
    return cityMatch && stateMatch && rangeMatch;
  });

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Nearby Shelters"
        isDarkMode={isDarkMode}
        currentScreen="NearbyShelters"
      />

      <ScrollView style={styles.content}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>City</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />
          <Text style={styles.filterLabel}>State</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter state"
            value={state}
            onChangeText={setState}
          />
          <Text style={styles.filterLabel}>Range (miles)</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter range in miles"
            keyboardType="numeric"
            value={range}
            onChangeText={setRange}
          />
        </View>

        {filteredShelters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No shelters found matching the criteria.</Text>
          </View>
        ) : (
          filteredShelters.map((shelter) => (
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
                <Text style={styles.distanceText}>📍 {shelter.distance} miles away</Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(shelter.contact)}
                >
                  <Text style={styles.callButtonText}>📞 Call: {shelter.contact}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

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
  filterSection: {
    padding: 20,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f0f0',
    borderRadius: 12,
    margin: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: isDarkMode ? '#ffffff' : '#2c3e50',
  },
  filterInput: {
    backgroundColor: isDarkMode ? '#3c3c3c' : '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
    color: isDarkMode ? '#ffffff' : '#2c3e50',
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
  section: {
    padding: 20,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: isDarkMode ? '#555' : '#ecf0f1',
    borderStyle: 'dashed',
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    color: isDarkMode ? '#bdc3c7' : '#95a5a6',
    textAlign: 'center',
    lineHeight: 22,
  },
});
