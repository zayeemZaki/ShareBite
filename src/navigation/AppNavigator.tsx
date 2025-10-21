import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthScreen } from '../screens/auth/AuthScreen';
import { RestaurantDashboard } from '../screens/restaurant/RestaurantDashboard';
import { ShareFood } from '../screens/restaurant/ShareFood';
import { RestaurantHistory } from '../screens/restaurant/RestaurantHistory';
import { NearbyShelters } from '../screens/restaurant/NearbyShelters';
import { AccountSettings } from '../screens/restaurant/AccountSettings';
import { ShelterDashboard } from '../screens/shelter/ShelterDashboard';
import { ShelterImpact } from '../screens/shelter/ShelterImpact';
import { ShelterNearbyRestaurants } from '../screens/shelter/ShelterNearbyRestaurants';
import { ShelterAccountSettings } from '../screens/shelter/ShelterAccountSettings';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type RootStackParamList = {
  Auth: undefined;
  RestaurantDashboard: undefined;
  ShareFood: undefined;
  RestaurantHistory: undefined;
  NearbyShelters: undefined;
  AccountSettings: undefined;
  ShelterDashboard: undefined;
  ShelterImpact: undefined;
  ShelterNearbyRestaurants: undefined;
  ShelterAccountSettings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { state } = useAuth();
  const { colors, isDarkMode } = useTheme();

  if (state.isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: 'normal',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: 'bold',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        {!state.isAuthenticated || !state.user ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : state.user.role === 'restaurant' ? (
          <>
            <Stack.Screen 
              name="RestaurantDashboard" 
              component={RestaurantDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ShareFood" 
              component={ShareFood}
              options={{ title: 'Share Food' }}
            />
            <Stack.Screen 
              name="RestaurantHistory" 
              component={RestaurantHistory}
              options={{ title: 'History' }}
            />
            <Stack.Screen 
              name="NearbyShelters" 
              component={NearbyShelters}
              options={{ title: 'Nearby Shelters' }}
            />
            <Stack.Screen 
              name="AccountSettings" 
              component={AccountSettings}
              options={{ title: 'Account Settings' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="ShelterDashboard" 
              component={ShelterDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ShelterImpact" 
              component={ShelterImpact}
              options={{ title: 'Impact Dashboard' }}
            />
            <Stack.Screen 
              name="ShelterNearbyRestaurants" 
              component={ShelterNearbyRestaurants}
              options={{ title: 'Nearby Restaurants' }}
            />
            <Stack.Screen 
              name="ShelterAccountSettings" 
              component={ShelterAccountSettings}
              options={{ title: 'Account Settings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
