import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';

export const NearbyShelters: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

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

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    filterSection: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      margin: spacing.md,
      ...shadows,
    },
    filterLabel: {
      fontSize: typography.sizes.regular,
      fontWeight: typography.fontWeightMedium,
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    filterInput: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginBottom: spacing.sm,
      fontSize: typography.sizes.regular,
      color: colors.textPrimary,
    },
    shelterCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      ...shadows,
    },
    shelterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    shelterInfo: {
      flex: 1,
    },
    shelterName: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    shelterAddress: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
    },
    capacityBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
    },
    capacityText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
    shelterDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    distanceText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
    },
    callButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 6 : 4,
      elevation: isDarkMode ? 6 : 3,
    },
    callButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.regular,
      fontWeight: typography.fontWeightMedium,
    },
    noteTitle: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    noteText: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    section: {
      padding: spacing.lg,
    },
    emptyState: {
      padding: spacing.xl,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      margin: spacing.md,
    },
    emptyText: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
