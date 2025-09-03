import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Temporary in-memory storage
let storedUser: User | null = null;

// Mock authentication functions - replace with real API calls
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  const mockUsers: Record<string, User> = {
    'restaurant@test.com': {
      id: '1',
      email: 'restaurant@test.com',
      name: 'Mario\'s Kitchen',
      role: 'restaurant',
    },
    'shelter@test.com': {
      id: '2',
      email: 'shelter@test.com',
      name: 'Hope Shelter',
      role: 'shelter',
    },
    'volunteer@test.com': {
      id: '3',
      email: 'volunteer@test.com',
      name: 'John Volunteer',
      role: 'volunteer',
    },
  };

  const user = mockUsers[credentials.email];
  if (!user || credentials.password !== 'password') {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

const mockRegister = async (credentials: RegisterCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Date.now().toString(),
    email: credentials.email,
    name: credentials.name,
    role: credentials.role,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      // Use in-memory storage temporarily
      if (storedUser) {
        dispatch({ type: 'SET_USER', payload: storedUser });
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await mockLogin(credentials);
      // Use in-memory storage temporarily
      storedUser = user;
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await mockRegister(credentials);
      // Use in-memory storage temporarily
      storedUser = user;
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Use in-memory storage temporarily
      storedUser = null;
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
