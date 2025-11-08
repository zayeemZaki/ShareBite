export type UserRole = 'restaurant' | 'shelter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  // Restaurant-specific fields
  restaurantName?: string;
  restaurantType?: string;
  // Shelter-specific fields
  shelterName?: string;
  shelterType?: string;
  capacity?: number;
  operatingHours?: string;
  profileImage?: string;
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  // Restaurant-specific
  restaurantName?: string;
  restaurantType?: string;
  // Shelter-specific
  shelterName?: string;
  shelterType?: string;
  capacity?: number;
  operatingHours?: string;
}
