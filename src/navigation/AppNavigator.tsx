import React from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { RestaurantDashboard } from '../screens/restaurant/RestaurantDashboard';
import { ShelterDashboard } from '../screens/shelter/ShelterDashboard';
import { VolunteerDashboard } from '../screens/volunteer/VolunteerDashboard';
import { useAuth } from '../context/AuthContext';

export const AppNavigator: React.FC = () => {
  const { state } = useAuth();
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

  // Role-based navigation
  switch (state.user.role) {
    case 'restaurant':
      return <RestaurantDashboard />;
    case 'shelter':
      return <ShelterDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    default:
      return <AuthScreen />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
