import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  useColorScheme,
  Image,
} from 'react-native';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenName } from '../../types/navigation';

interface HeaderWithBurgerProps {
  title: string;
  isDarkMode?: boolean;
  currentScreen?: ScreenName;
  showLogo?: boolean;
}

export const HeaderWithBurger: React.FC<HeaderWithBurgerProps> = ({
  title,
  isDarkMode = false,
  currentScreen,
  showLogo = false,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useAuth();
  const styles = getStyles(isDarkMode);

  const menuItems: { id: string; title: string; screen?: ScreenName; action?: () => void; textColor?: string }[] = [
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
    if (currentScreen === 'RestaurantDashboard') {
      // Go back to login by logging out
      logout();
    } else {
      // Go back to dashboard
      navigation.navigate('RestaurantDashboard');
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
      ) : currentScreen !== 'RestaurantDashboard' ? (
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

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#444' : '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  burgerButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: isDarkMode ? '#3c3c3c' : '#e8e8e8',
  },
  burgerIconContainer: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  burgerLine: {
    height: 2,
    backgroundColor: isDarkMode ? '#ffffff' : '#2c3e50',
    borderRadius: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: isDarkMode ? '#3c3c3c' : '#e8e8e8',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#2c3e50',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
    marginTop: 60,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? '#444' : '#e0e0e0',
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#444' : '#e0e0e0',
  },
  menuItemText: {
    fontSize: 16,
    color: isDarkMode ? '#ffffff' : '#2c3e50',
    fontWeight: '500',
  },
});
