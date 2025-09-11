# Profile Data Storage Guide

## 🎯 Starting Simple: User Profiles Only

We're starting with **profile data storage only** - the foundation of your ShareBite app. Later we'll add food listings, history, etc.

## 📦 What's Set Up

### 1. **ProfileService** (`/src/services/ProfileService.ts`)
- ✅ Create user profiles
- ✅ Get user profiles
- ✅ Update profiles
- ✅ Get all restaurants, shelters, volunteers
- ✅ Simple, focused on profiles only

### 2. **Profile Types**
```typescript
// Basic profile for all users
interface BasicUserProfile {
  id: string;
  email: string;
  name: string;
  role: 'restaurant' | 'shelter' | 'volunteer';
  phone?: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Extended for each role
interface RestaurantProfile {
  restaurantName?: string;
  cuisineType?: string[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
```

## 🚀 How to Use

### 1. **Registration** (Already integrated)
When users register, a basic profile is automatically created:

```typescript
// This happens automatically in AuthService
await ProfileService.createUserProfile(
  userId,
  email,
  name,
  role
);
```

### 2. **Complete Profile** (Add to your app)
After registration, users can complete their profiles:

```typescript
// Restaurant completes profile
const restaurantData = {
  restaurantName: "Joe's Pizza",
  cuisineType: ['Italian', 'Pizza'],
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  phone: "(555) 123-4567",
  description: "Family pizza restaurant"
};

await ProfileService.updateUserProfile(userId, restaurantData);
```

### 3. **Get Profile Data**
```typescript
// Get current user's profile
const profile = await ProfileService.getUserProfile(userId);

if (profile) {
  console.log(`Name: ${profile.name}`);
  console.log(`Role: ${profile.role}`);
  
  if (profile.role === 'restaurant') {
    const restaurant = profile as RestaurantProfile;
    console.log(`Restaurant: ${restaurant.restaurantName}`);
  }
}
```

### 4. **Browse Users**
```typescript
// Get all restaurants
const restaurants = await ProfileService.getRestaurants();
console.log(`Found ${restaurants.length} restaurants`);

// Get all shelters  
const shelters = await ProfileService.getShelters();
console.log(`Found ${shelters.length} shelters`);

// Get all volunteers
const volunteers = await ProfileService.getVolunteers();
console.log(`Found ${volunteers.length} volunteers`);
```

## 📱 Integration in React Components

### Profile Completion Component
```typescript
const CompleteProfileScreen = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  // ... other fields

  const handleSaveProfile = async () => {
    try {
      await ProfileService.updateUserProfile(currentUser.id, {
        restaurantName,
        cuisineType: cuisineTypes,
        address,
        city,
        state,
        zipCode,
        phone,
        description,
      });
      
      Alert.alert('Success', 'Profile completed!');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    // Your form UI here
  );
};
```

### Browse Restaurants Screen
```typescript
const BrowseRestaurantsScreen = () => {
  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await ProfileService.getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error loading restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  return (
    <FlatList
      data={restaurants}
      renderItem={({ item }) => (
        <RestaurantCard restaurant={item} />
      )}
      // ... other props
    />
  );
};
```

## 🗂️ Firestore Structure

```
firestore/
└── users/                    # Single collection for all profiles
    ├── {userId1}            # Restaurant profile
    │   ├── id: "userId1"
    │   ├── email: "restaurant@example.com"
    │   ├── name: "John Smith"
    │   ├── role: "restaurant"
    │   ├── restaurantName: "Joe's Pizza"
    │   ├── cuisineType: ["Italian", "Pizza"]
    │   └── address: "123 Main St"
    │
    ├── {userId2}            # Shelter profile  
    │   ├── id: "userId2"
    │   ├── role: "shelter"
    │   ├── shelterName: "Hope Shelter"
    │   └── capacity: 150
    │
    └── {userId3}            # Volunteer profile
        ├── id: "userId3"
        ├── role: "volunteer"
        ├── transportType: "car"
        └── maxDistance: 10
```

## 🔧 Testing Your Setup

Use the examples in `/src/examples/ProfileExamples.ts`:

```typescript
import { ProfileExamples } from '../examples/ProfileExamples';

// Test creating profiles
await ProfileExamples.completeRestaurantProfile(userId);
await ProfileExamples.getMyProfile(userId);
await ProfileExamples.browseRestaurants();
```

## 🎯 Next Steps

Once profiles are working well:

1. ✅ **Profiles** ← You are here
2. 🔄 **Food Listings** (restaurants post available food)
3. 🔄 **Claims** (shelters request food)
4. 🔄 **Deliveries** (volunteers help transport)
5. 🔄 **History** (track all activities)

Keep it simple and build incrementally! 🚀
