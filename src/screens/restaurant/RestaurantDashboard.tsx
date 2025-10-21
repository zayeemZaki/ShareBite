import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';

export const RestaurantDashboard: React.FC = () => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const navigation = useNavigation();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const currentItems = [
    { id: '1', item: 'Pizza Slices', quantity: '12 slices', status: 'Available' },
    { id: '2', item: 'Fresh Salad', quantity: '5 bowls', status: 'Available' },
    { id: '3', item: 'Bread Loaves', quantity: '8 loaves', status: 'Available' },
  ];

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title={`Welcome, ${state.user?.name}`}
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

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    itemCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...shadows,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    itemQuantity: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
    },
    statusText: {
      color: colors.surface,
      fontSize: typography.sizes.small,
      fontWeight: typography.fontWeightMedium,
    },
    postButton: {
      marginTop: spacing.sm,
    },
  });
