export type ScreenName = 
  | 'RestaurantDashboard' 
  | 'ShareFood' 
  | 'ShelterDashboard' 
  | 'VolunteerDashboard';

export type UserRole = 'restaurant' | 'shelter' | 'volunteer';

export interface NavigationState {
  currentScreen: ScreenName;
  history: ScreenName[];
}