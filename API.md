# 🔌 ShareBite API Documentation

This document describes the current authentication system and provides guidance for future backend integration.

## 🔐 Current Authentication System

ShareBite currently uses a **mock authentication system** for demonstration purposes. This allows you to test all features without a backend server.

### Mock User Accounts

| Role | Email | Password | User Data |
|------|-------|----------|-----------|
| 🏪 Restaurant | `restaurant@test.com` | `password` | Mario's Kitchen |
| 🏠 Shelter | `shelter@test.com` | `password` | Hope Shelter |
| 🚗 Volunteer | `volunteer@test.com` | `password` | John Volunteer |

### Authentication Flow

```typescript
// Current mock implementation
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // 1. Simulate API delay
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  
  // 2. Validate credentials against mock users
  const user = mockUsers[credentials.email];
  if (!user || credentials.password !== 'password') {
    throw new Error('Invalid credentials');
  }
  
  // 3. Return user data
  return user;
};
```

## 📊 Data Types

### Authentication Types

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'restaurant' | 'shelter' | 'volunteer';
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
  role: 'restaurant' | 'shelter' | 'volunteer';
}
```

### Food Item Types

```typescript
export interface FoodItem {
  id: string;
  title: string;
  details: string;
  description: string;
}
```

## 🔄 State Management

### AuthContext

The authentication state is managed using React Context:

```typescript
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}
```

### Usage Example

```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { state, login, logout } = useAuth();
  
  if (state.isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!state.isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return <Dashboard user={state.user} onLogout={logout} />;
};
```

## 🚀 Future Backend Integration

### Recommended API Structure

When implementing a real backend, consider this RESTful API structure:

#### Authentication Endpoints

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "restaurant"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "restaurant"
}
```

```http
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "restaurant"
    }
  }
}
```

#### Food Management Endpoints

```http
GET /api/food/available
Authorization: Bearer <token>
Query Parameters:
  - lat: number (latitude)
  - lng: number (longitude)
  - radius: number (in km)
  - type: string (optional filter)

Response:
{
  "success": true,
  "data": {
    "food_items": [
      {
        "id": "food_123",
        "title": "Pizza Slices",
        "description": "Fresh pizza from Mario's Kitchen",
        "quantity": "8 slices",
        "restaurant_id": "rest_456",
        "restaurant_name": "Mario's Kitchen",
        "location": {
          "lat": 40.7128,
          "lng": -74.0060,
          "address": "123 Main St, New York, NY"
        },
        "expires_at": "2025-09-04T18:00:00Z",
        "created_at": "2025-09-03T15:30:00Z"
      }
    ]
  }
}
```

```http
POST /api/food/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fresh Salad",
  "description": "Organic mixed greens",
  "quantity": "5 bowls",
  "expires_at": "2025-09-04T20:00:00Z"
}
```

```http
POST /api/food/{food_id}/claim
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickup_time": "2025-09-03T17:00:00Z",
  "notes": "Will arrive with volunteer driver"
}
```

#### User Management Endpoints

```http
GET /api/users/profile
Authorization: Bearer <token>

PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "address": "456 Oak Ave, City, State"
}
```

#### Delivery Management Endpoints

```http
GET /api/deliveries/available
Authorization: Bearer <token>
Role: volunteer

GET /api/deliveries/my-deliveries
Authorization: Bearer <token>

POST /api/deliveries/{delivery_id}/accept
Authorization: Bearer <token>
Role: volunteer

PUT /api/deliveries/{delivery_id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "picked_up" | "in_transit" | "delivered",
  "notes": "Optional status update notes"
}
```

### Authentication Implementation

#### JWT Token Storage

Replace the current in-memory storage with secure token storage:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store token
const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Retrieve token
const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Remove token
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
```

#### API Client Setup

```typescript
class ApiClient {
  private baseURL = 'https://api.sharebite.com';
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await storeToken(token);
  }

  async clearToken() {
    this.token = null;
    await removeToken();
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(credentials: LoginCredentials) {
    const response = await this.request<{user: User; token: string}>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    
    await this.setToken(response.token);
    return response.user;
  }

  async register(credentials: RegisterCredentials) {
    const response = await this.request<{user: User; token: string}>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    
    await this.setToken(response.token);
    return response.user;
  }

  async logout() {
    await this.request('/api/auth/logout', { method: 'POST' });
    await this.clearToken();
  }
}

export const apiClient = new ApiClient();
```

### Error Handling

Implement proper error handling for API calls:

```typescript
interface ApiError {
  message: string;
  code: string;
  details?: any;
}

const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  switch (error.response?.status) {
    case 401:
      return 'Invalid credentials. Please check your email and password.';
    case 403:
      return 'Access denied. You do not have permission to perform this action.';
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
```

### Real-time Updates

For live updates (new food items, delivery status), consider implementing:

#### WebSocket Connection

```typescript
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    this.ws = new WebSocket(`wss://api.sharebite.com/ws?token=${token}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(token);
    };
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'new_food_item':
        // Update food list
        break;
      case 'food_claimed':
        // Update availability
        break;
      case 'delivery_update':
        // Update delivery status
        break;
    }
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(token), 1000 * this.reconnectAttempts);
    }
  }
}
```

#### Push Notifications

For React Native push notifications:

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

## 🔒 Security Considerations

### Password Security
- Hash passwords using bcrypt or Argon2
- Implement password strength requirements
- Consider implementing password reset functionality

### Token Security
- Use short-lived access tokens (15-30 minutes)
- Implement refresh token rotation
- Store tokens securely on device

### API Security
- Implement rate limiting
- Use HTTPS only
- Validate all input data
- Implement CORS properly

### Data Validation

```typescript
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const registerSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  role: yup.string().oneOf(['restaurant', 'shelter', 'volunteer']).required('Role is required'),
});
```

## 📈 Analytics & Monitoring

Consider implementing analytics for:
- User engagement metrics
- Food sharing/claiming rates
- Delivery completion rates
- App performance metrics

```typescript
// Example analytics integration
import analytics from '@react-native-firebase/analytics';

const trackLogin = (method: string) => {
  analytics().logLogin({ method });
};

const trackFoodShare = (foodType: string) => {
  analytics().logEvent('food_shared', { food_type: foodType });
};

const trackDeliveryComplete = (distance: number, duration: number) => {
  analytics().logEvent('delivery_completed', { distance, duration });
};
```

---

This documentation provides a foundation for transitioning from the current mock system to a full production backend. The mock system allows for immediate development and testing while this API structure guides future implementation.
