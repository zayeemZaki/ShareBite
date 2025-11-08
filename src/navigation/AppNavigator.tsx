import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Home, Building2, History, Settings, MapPin } from 'lucide-react-native';

import { AuthScreen } from '../screens/auth/AuthScreen';
import { RestaurantDashboard } from '../screens/restaurant/RestaurantDashboard';
import { ShareFood } from '../screens/restaurant/ShareFood';
import { RestaurantHistory } from '../screens/restaurant/RestaurantHistory';
import { NearbyShelters } from '../screens/restaurant/NearbyShelters';
import { AccountSettings } from '../screens/restaurant/AccountSettings';
import { ShelterDashboard } from '../screens/shelter/ShelterDashboard';
import { ShelterHistory } from '../screens/shelter/ShelterHistory';
import { ShelterNearbyRestaurants } from '../screens/shelter/ShelterNearbyRestaurants';
import { ShelterAccountSettings } from '../screens/shelter/ShelterAccountSettings';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type RootStackParamList = {
  Auth: undefined;
  RestaurantTabs: undefined;
  ShelterTabs: undefined;
  ShareFood: undefined;
};

export type RestaurantTabParamList = {
  Dashboard: undefined;
  NearbyShelters: undefined;
  History: undefined;
  Settings: undefined;
};

export type ShelterTabParamList = {
  Dashboard: undefined;
  Nearby: undefined;
  History: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const RestaurantTab = createBottomTabNavigator<RestaurantTabParamList>();
const ShelterTab = createBottomTabNavigator<ShelterTabParamList>();

// Icon component for tab bar
const TabIcon: React.FC<{ 
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; 
  focused: boolean; 
  color: string;
}> = ({ icon: Icon, focused, color }) => (
  <Icon size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
);

// Restaurant Bottom Tabs
const RestaurantTabs: React.FC = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <RestaurantTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <RestaurantTab.Screen
        name="Dashboard"
        component={RestaurantDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={Home} focused={focused} color={color} />,
        }}
      />
      <RestaurantTab.Screen
        name="NearbyShelters"
        component={NearbyShelters}
        options={{
          tabBarLabel: 'Shelters',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={Building2} focused={focused} color={color} />,
        }}
      />
      <RestaurantTab.Screen
        name="History"
        component={RestaurantHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={History} focused={focused} color={color} />,
        }}
      />
      <RestaurantTab.Screen
        name="Settings"
        component={AccountSettings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={Settings} focused={focused} color={color} />,
        }}
      />
    </RestaurantTab.Navigator>
  );
};

// Shelter Bottom Tabs
const ShelterTabs: React.FC = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <ShelterTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <ShelterTab.Screen
        name="Dashboard"
        component={ShelterDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={Home} focused={focused} color={color} />,
        }}
      />
      <ShelterTab.Screen
        name="Nearby"
        component={ShelterNearbyRestaurants}
        options={{
          tabBarLabel: 'Nearby',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={MapPin} focused={focused} color={color} />,
        }}
      />
      <ShelterTab.Screen
        name="History"
        component={ShelterHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={History} focused={focused} color={color} />,
        }}
      />
      <ShelterTab.Screen
        name="Settings"
        component={ShelterAccountSettings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused, color }) => <TabIcon icon={Settings} focused={focused} color={color} />,
        }}
      />
    </ShelterTab.Navigator>
  );
};

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
          <Stack.Screen 
            name="RestaurantTabs" 
            component={RestaurantTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen 
            name="ShelterTabs" 
            component={ShelterTabs}
            options={{ headerShown: false }}
          />
        )}
        {state.isAuthenticated && state.user && state.user.role === 'restaurant' && (
          <Stack.Screen 
            name="ShareFood" 
            component={ShareFood}
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }}
          />
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
