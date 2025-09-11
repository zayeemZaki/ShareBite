import { UserRole } from './auth';

// Base types
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Profile types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface RestaurantProfile extends UserProfile {
  role: 'restaurant';
  restaurantName: string;
  cuisineType: string[];
  location: Location;
  businessHours: {
    [key: string]: { // 'monday', 'tuesday', etc.
      open: string; // '09:00'
      close: string; // '17:00'
      isOpen: boolean;
    };
  };
  licenseNumber?: string;
  description?: string;
  totalDonations: number; // Count of food donations
  rating: number; // Average rating from shelters
}

export interface ShelterProfile extends UserProfile {
  role: 'shelter';
  shelterName: string;
  location: Location;
  capacity: number; // Number of people they can serve
  servingHours: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  specialNeeds: string[]; // ['vegetarian', 'kosher', 'halal', etc.]
  description?: string;
  totalReceived: number; // Count of food received
}

export interface VolunteerProfile extends UserProfile {
  role: 'volunteer';
  location: Location;
  availability: {
    [key: string]: { // 'monday', 'tuesday', etc.
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
  transportType: 'car' | 'bike' | 'walking' | 'public_transport';
  maxDistance: number; // km willing to travel
  specialSkills: string[]; // ['food_handling', 'logistics', etc.]
  totalDeliveries: number; // Count of successful deliveries
  rating: number; // Average rating
}

// Food listing types
export interface FoodListing {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  description: string;
  foodType: 'prepared' | 'packaged' | 'ingredients';
  cuisineType: string;
  quantity: number;
  unit: string; // 'servings', 'kg', 'pieces', etc.
  expiryDate: Timestamp;
  pickupTimeStart: Timestamp;
  pickupTimeEnd: Timestamp;
  location: Location;
  images: string[]; // URLs to food images
  dietaryInfo: string[]; // ['vegetarian', 'vegan', 'gluten-free', etc.]
  allergens: string[]; // ['nuts', 'dairy', 'eggs', etc.]
  status: 'available' | 'claimed' | 'picked_up' | 'expired';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  claimedBy?: string; // shelter ID
  claimedAt?: Timestamp;
  pickedUpAt?: Timestamp;
  volunteerId?: string; // if volunteer is handling pickup
}

// Food claim/request types
export interface FoodClaim {
  id: string;
  listingId: string;
  shelterId: string;
  shelterName: string;
  requestedQuantity: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  completedAt?: Timestamp;
  volunteerId?: string;
  notes?: string;
}

// Delivery/pickup types
export interface Delivery {
  id: string;
  listingId: string;
  claimId: string;
  volunteerId: string;
  volunteerName: string;
  restaurantId: string;
  restaurantName: string;
  shelterId: string;
  shelterName: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  estimatedPickupTime: Timestamp;
  estimatedDeliveryTime: Timestamp;
  actualPickupTime?: Timestamp;
  actualDeliveryTime?: Timestamp;
  status: 'assigned' | 'en_route_to_pickup' | 'picked_up' | 'en_route_to_delivery' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Rating and feedback types
export interface Rating {
  id: string;
  fromUserId: string;
  fromUserRole: UserRole;
  toUserId: string;
  toUserRole: UserRole;
  relatedId: string; // ID of listing, delivery, etc.
  relatedType: 'listing' | 'delivery' | 'pickup';
  rating: number; // 1-5
  comment?: string;
  createdAt: Timestamp;
}

// Transaction history types
export interface RestaurantHistory {
  id: string;
  restaurantId: string;
  listingId: string;
  action: 'created' | 'updated' | 'claimed' | 'picked_up' | 'completed' | 'expired';
  details: {
    foodTitle: string;
    quantity: number;
    shelterId?: string;
    shelterName?: string;
    volunteerId?: string;
    volunteerName?: string;
  };
  timestamp: Timestamp;
}

export interface ShelterHistory {
  id: string;
  shelterId: string;
  listingId: string;
  restaurantId: string;
  restaurantName: string;
  action: 'claimed' | 'received' | 'cancelled';
  details: {
    foodTitle: string;
    quantityReceived: number;
    volunteerId?: string;
    volunteerName?: string;
    pickupTime?: Timestamp;
    deliveryTime?: Timestamp;
  };
  timestamp: Timestamp;
}

export interface VolunteerHistory {
  id: string;
  volunteerId: string;
  deliveryId: string;
  listingId: string;
  restaurantId: string;
  restaurantName: string;
  shelterId: string;
  shelterName: string;
  action: 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  details: {
    foodTitle: string;
    quantity: number;
    pickupTime?: Timestamp;
    deliveryTime?: Timestamp;
    distance?: number; // km
    duration?: number; // minutes
  };
  timestamp: Timestamp;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'food_available' | 'claim_approved' | 'pickup_reminder' | 'delivery_assigned' | 'rating_request';
  relatedId?: string; // ID of related listing, delivery, etc.
  isRead: boolean;
  createdAt: Timestamp;
}
