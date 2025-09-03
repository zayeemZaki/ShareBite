export type UserRole = 'restaurant' | 'shelter' | 'volunteer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
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
}
