import React from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { RestaurantDashboard } from '../screens/restaurant/RestaurantDashboard';
import { ShelterDashboard } from '../screens/shelter/ShelterDashboard';
import { VolunteerDashboard } from '../screens/volunteer/VolunteerDashboard';
import { ShareFood } from '../screens/restaurant/ShareFood';
import { RestaurantHistory } from '../screens/restaurant/RestaurantHistory';
import { AccountSettings } from '../screens/restaurant/AccountSettings';
import { NearbyShelters } from '../screens/restaurant/NearbyShelters';
import { useAuth } from '../context/AuthContext';
import { NavigationProvider, useNavigation } from '../context/NavigationContext';

const RoleBasedNavigator: React.FC = () => {
  const { state } = useAuth();
  const { currentScreen } = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  if (state.isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    return <AuthScreen />;
  }

  // Role-based navigation with screen routing
  switch (state.user.role) {
    case 'restaurant':
      switch (currentScreen) {
        case 'ShareFood':
          return <ShareFood />;
        case 'RestaurantHistory':
          return <RestaurantHistory />;
        case 'AccountSettings':
          return <AccountSettings />;
        case 'NearbyShelters':
          return <NearbyShelters />;
        default:
          return <RestaurantDashboard />;
      }
    case 'shelter':
      return <ShelterDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    default:
      return <AuthScreen />;
  }
};

export const AppNavigator: React.FC = () => {
  const { state } = useAuth();
  
  // Determine initial screen based on user role
  const getInitialScreen = () => {
    if (!state.isAuthenticated || !state.user) return 'RestaurantDashboard';
    
    switch (state.user.role) {
      case 'restaurant':
        return 'RestaurantDashboard';
      case 'shelter':
        return 'ShelterDashboard';
      case 'volunteer':
        return 'VolunteerDashboard';
      default:
        return 'RestaurantDashboard';
    }
  };

  return (
    <NavigationProvider initialScreen={getInitialScreen()}>
      <RoleBasedNavigator />
    </NavigationProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
