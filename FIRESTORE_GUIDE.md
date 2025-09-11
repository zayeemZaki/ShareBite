# ShareBite Firestore Data Structure

This document explains how to save and retrieve data in Firestore for your ShareBite app.

## 🗂️ Collection Structure

```
firestore/
├── users/                    # User profiles (restaurants, shelters, volunteers)
├── foodListings/            # Food available for donation
├── foodClaims/              # Shelter requests for food
├── deliveries/              # Volunteer delivery assignments
├── ratings/                 # User ratings and feedback
├── restaurantHistory/       # Restaurant activity history
├── shelterHistory/          # Shelter activity history
├── volunteerHistory/        # Volunteer activity history
└── notifications/           # User notifications
```

## 📝 Data Types

### 1. Profile Details
```typescript
// Users collection stores all user types
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'restaurant' | 'shelter' | 'volunteer';
  phone?: string;
  profileImage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Extended profiles for each role
interface RestaurantProfile extends UserProfile {
  restaurantName: string;
  cuisineType: string[];
  location: Location;
  businessHours: BusinessHours;
  totalDonations: number;
  rating: number;
}
```

### 2. Food Listings
```typescript
interface FoodListing {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  quantity: number;
  expiryDate: Timestamp;
  location: Location;
  status: 'available' | 'claimed' | 'picked_up' | 'expired';
  // ... more fields
}
```

### 3. History Tracking
```typescript
// Restaurant history - tracks all food donations
interface RestaurantHistory {
  restaurantId: string;
  listingId: string;
  action: 'created' | 'claimed' | 'picked_up' | 'completed';
  details: { foodTitle: string; quantity: number; shelterId?: string; };
  timestamp: Timestamp;
}

// Shelter history - tracks all food received
interface ShelterHistory {
  shelterId: string;
  listingId: string;
  restaurantId: string;
  action: 'claimed' | 'received' | 'cancelled';
  details: { foodTitle: string; quantityReceived: number; };
  timestamp: Timestamp;
}

// Volunteer history - tracks all deliveries
interface VolunteerHistory {
  volunteerId: string;
  deliveryId: string;
  action: 'assigned' | 'picked_up' | 'delivered';
  details: { foodTitle: string; distance?: number; duration?: number; };
  timestamp: Timestamp;
}
```

## 🔧 How to Use Firestore Service

### Setting Up Dependencies

1. **Install Firestore** (already done):
```bash
npm install @react-native-firebase/firestore
```

2. **Import the service**:
```typescript
import { FirestoreService } from '../services/FirestoreService';
```

### Common Operations

#### 1. Creating User Profiles
```typescript
// After user registration
await FirestoreService.createUserProfile(
  userId,
  email,
  name,
  role,
  additionalData // role-specific data
);
```

#### 2. Creating Food Listings (Restaurants)
```typescript
const listing = {
  restaurantId: 'user-id',
  restaurantName: 'Restaurant Name',
  title: 'Fresh Vegetables',
  description: 'Organic vegetables, good for 50 people',
  foodType: 'ingredients' as const,
  quantity: 50,
  unit: 'servings',
  expiryDate: FirestoreTimestamp.fromDate(new Date(Date.now() + 24*60*60*1000)),
  // ... other fields
};

const listingId = await FirestoreService.createFoodListing(listing);
```

#### 3. Claiming Food (Shelters)
```typescript
const claimId = await FirestoreService.createFoodClaim({
  listingId: 'listing-id',
  shelterId: 'shelter-id',
  shelterName: 'Shelter Name',
  requestedQuantity: 20,
  message: 'We need this food for dinner service',
  status: 'pending',
});
```

#### 4. Volunteer Deliveries
```typescript
const deliveryId = await FirestoreService.createDelivery({
  listingId: 'listing-id',
  volunteerId: 'volunteer-id',
  restaurantId: 'restaurant-id',
  shelterId: 'shelter-id',
  pickupLocation: restaurantLocation,
  deliveryLocation: shelterLocation,
  status: 'assigned',
  // ... other fields
});
```

#### 5. Getting Data
```typescript
// Get available food listings
const listings = await FirestoreService.getAvailableFoodListings();

// Get restaurant's history
const history = await FirestoreService.getRestaurantHistory(restaurantId);

// Get nearby listings
const nearby = await FirestoreService.getNearbyListings(userLocation, 10); // 10km radius

// Get all restaurants/shelters/volunteers
const restaurants = await FirestoreService.getRestaurants();
const shelters = await FirestoreService.getShelters();
const volunteers = await FirestoreService.getVolunteers();
```

#### 6. Real-time Updates
```typescript
// Listen to notifications
const unsubscribe = FirestoreService.subscribeToUserNotifications(
  userId,
  (notifications) => {
    // Update UI with new notifications
    setNotifications(notifications);
  }
);

// Listen to food listings
const unsubscribe2 = FirestoreService.subscribeToAvailableListings(
  (listings) => {
    // Update UI with new listings
    setFoodListings(listings);
  }
);

// Don't forget to unsubscribe
unsubscribe();
unsubscribe2();
```

#### 7. Adding History Records
```typescript
// Restaurant creates listing (automatically added)
// Shelter claims food
await FirestoreService.addShelterHistory(shelterId, {
  listingId,
  restaurantId,
  restaurantName,
  action: 'claimed',
  details: { foodTitle, quantityReceived: quantity }
});

// Volunteer completes delivery
await FirestoreService.addVolunteerHistory(volunteerId, {
  deliveryId,
  listingId,
  restaurantId,
  restaurantName,
  shelterId,
  shelterName,
  action: 'delivered',
  details: { foodTitle, quantity, distance: 5.2, duration: 30 }
});
```

## 🏗️ Example Usage in Components

### Restaurant Dashboard
```typescript
const [listings, setListings] = useState<FoodListing[]>([]);
const [history, setHistory] = useState<RestaurantHistory[]>([]);

useEffect(() => {
  const loadData = async () => {
    const userListings = await FirestoreService.getRestaurantListings(userId);
    const userHistory = await FirestoreService.getRestaurantHistory(userId);
    setListings(userListings);
    setHistory(userHistory);
  };
  loadData();
}, [userId]);
```

### Shelter Dashboard
```typescript
const [availableFood, setAvailableFood] = useState<FoodListing[]>([]);
const [shelterHistory, setShelterHistory] = useState<ShelterHistory[]>([]);

useEffect(() => {
  // Real-time listener for available food
  const unsubscribe = FirestoreService.subscribeToAvailableListings(setAvailableFood);
  
  // Load shelter history
  FirestoreService.getShelterHistory(userId).then(setShelterHistory);
  
  return unsubscribe;
}, [userId]);
```

### Volunteer Dashboard
```typescript
const [deliveries, setDeliveries] = useState<Delivery[]>([]);
const [volunteerHistory, setVolunteerHistory] = useState<VolunteerHistory[]>([]);

useEffect(() => {
  const loadData = async () => {
    const userDeliveries = await FirestoreService.getVolunteerDeliveries(userId);
    const userHistory = await FirestoreService.getVolunteerHistory(userId);
    setDeliveries(userDeliveries);
    setVolunteerHistory(userHistory);
  };
  loadData();
}, [userId]);
```

## 🔐 Security Rules (Firebase Console)

Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other profiles
    }
    
    // Food listings - restaurants can create, everyone can read
    match /foodListings/{listingId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
        request.auth.uid == resource.data.restaurantId;
    }
    
    // Claims - shelters can create, restaurant owners can read
    match /foodClaims/{claimId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // History - users can read their own history
    match /restaurantHistory/{historyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.restaurantId;
    }
    
    match /shelterHistory/{historyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.shelterId;
    }
    
    match /volunteerHistory/{historyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.volunteerId;
    }
  }
}
```

## 📱 Integration with Your App

1. **Update Registration** - Save role-specific profile data
2. **Create Dashboards** - Show relevant data for each user type  
3. **Add Real-time Updates** - Use listeners for live data
4. **Track User Actions** - Automatically add history records
5. **Implement Search** - Filter by location, food type, etc.
6. **Add Notifications** - Alert users about claims, deliveries, etc.

Your ShareBite app now has a complete data storage system that tracks everything:
- ✅ User profiles with role-specific data
- ✅ Food listings and availability
- ✅ Complete history tracking for all users
- ✅ Real-time updates and notifications
- ✅ Location-based features

The FirestoreService provides all the methods you need to save and retrieve data efficiently! 🎉
