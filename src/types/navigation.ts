export type ScreenName =
  | 'RestaurantDashboard'
  | 'ShareFood'
  | 'RestaurantHistory'
  | 'NearbyShelters'
  | 'AccountSettings'
  | 'ShelterDashboard'
  | 'ShelterImpact'
  | 'ShelterNearbyRestaurants'
  | 'VolunteerDashboard';

export type UserRole = 'restaurant' | 'shelter' | 'volunteer';

export interface NavigationState {
  currentScreen: ScreenName;
  history: ScreenName[];
}