import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../navigation/ReactAppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface HeaderWithBurgerProps {
  title: string;
  isDarkMode?: boolean;
  currentScreen?: keyof RootStackParamList;
  showLogo?: boolean;
}

export const HeaderWithBurger: React.FC<HeaderWithBurgerProps> = ({
  title,
  currentScreen,
  showLogo = false,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useReactNavigation<NavigationProp>();
  const { logout } = useAuth();
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const { state } = useAuth();
  const userRole = state.user?.role;
  const dashboardScreen: keyof RootStackParamList = userRole === 'shelter' ? 'ShelterDashboard' : 'RestaurantDashboard';

  const menuItems: { id: string; title: string; screen?: keyof RootStackParamList; action?: () => void; textColor?: string }[] = userRole === 'shelter' ? [
    { id: '1', title: '🏠 Dashboard', screen: 'ShelterDashboard' },
    { id: '2', title: '📊 Impact', screen: 'ShelterImpact' },
    { id: '3', title: '🏪 Nearby Restaurants', screen: 'ShelterNearbyRestaurants' },
    { id: '4', title: '⚙️ Settings', screen: 'AccountSettings' },
    { id: '5', title: 'Logout', action: logout, textColor: '#e74c3c' },
  ] : [
    { id: '1', title: '🏠 Dashboard', screen: 'RestaurantDashboard' },
    { id: '2', title: '📊 History', screen: 'RestaurantHistory' },
    { id: '3', title: '🏢 Nearby Shelters', screen: 'NearbyShelters' },
    { id: '4', title: '⚙️ Settings', screen: 'AccountSettings' },
    { id: '5', title: 'Logout', action: logout, textColor: '#e74c3c' },
  ];

  const handleMenuItemPress = (item: typeof menuItems[0]) => {
    setMenuVisible(false);
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action) {
      item.action();
    }
  };

  const handleGoBack = () => {
    if (currentScreen === dashboardScreen) {
      // Go back to login by logging out
      logout();
    } else {
      // Go back to dashboard
      navigation.navigate(dashboardScreen);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.burgerButton}
      >
        <View style={styles.burgerIconContainer}>
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
          <View style={styles.burgerLine} />
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {showLogo ? (
        <Image
          source={require('../../../ShareBiteLogo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : currentScreen !== dashboardScreen ? (
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            {'⬅️ Back'}
          </Text>
        </TouchableOpacity>
      ) : null}

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <Text style={[styles.menuItemText, item.textColor ? { color: item.textColor } : {}]}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...shadows,
      borderRadius: borderRadius.md,
    },
    burgerButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 6 : 4,
      elevation: isDarkMode ? 6 : 3,
    },
    burgerIconContainer: {
      width: 20,
      height: 14,
      justifyContent: 'space-between',
    },
    burgerLine: {
      height: 2,
      backgroundColor: colors.textPrimary,
      borderRadius: 1,
    },
    logo: {
      width: 40,
      height: 40,
      marginHorizontal: spacing.sm,
    },
    title: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: isDarkMode ? 6 : 4,
      elevation: isDarkMode ? 6 : 3,
    },
    backButtonText: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
    },
    overlay: {
      flex: 1,
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-start',
      paddingTop: 10,
    },
    menuContainer: {
      backgroundColor: isDarkMode ? '#1e1e1e' : colors.surface,
      marginTop: spacing.lg,
      marginHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemText: {
      fontSize: typography.sizes.medium,
      color: isDarkMode ? '#e0e0e0' : colors.textPrimary,
      fontWeight: typography.fontWeightMedium,
      paddingVertical: 6,
    },
  });
