import { firebaseFirestore, FirestoreTimestamp } from '../config/firebase';
import { UserRole } from '../types/auth';

export interface BasicUserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  isActive: boolean;
}

export interface RestaurantProfile extends BasicUserProfile {
  role: 'restaurant';
  restaurantName?: string;
  cuisineType?: string[];
  businessHours?: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  contactEmail?: string;
  website?: string;
}

export interface ShelterProfile extends BasicUserProfile {
  role: 'shelter';
  shelterName?: string;
  capacity?: number; // Number of people they can serve
  servingHours?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  contactEmail?: string;
}

export class ProfileService {
  private static COLLECTION = 'users';

  // Create user profile after registration
  static async createUserProfile(
    userId: string,
    email: string,
    name: string,
    role: UserRole,
    additionalData?: any
  ): Promise<void> {
    try {
      const baseProfile: BasicUserProfile = {
        id: userId,
        email,
        name,
        role,
        createdAt: FirestoreTimestamp.now(),
        updatedAt: FirestoreTimestamp.now(),
        isActive: true,
        ...additionalData,
      };

      await firebaseFirestore
        .collection(this.COLLECTION)
        .doc(userId)
        .set(baseProfile);
        
    } catch (error) {
      throw new Error(`Failed to create user profile: ${error}`);
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<BasicUserProfile | null> {
    try {
      const doc = await firebaseFirestore
        .collection(this.COLLECTION)
        .doc(userId)
        .get();

      if (!doc.exists) {
        return null;
      }
      
      const profile = doc.data() as BasicUserProfile;
      if (profile && profile.name) {
      } else {
      }
      return profile;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    updates: Partial<BasicUserProfile>
  ): Promise<void> {
    try {
      // First check if the document exists
      const docRef = firebaseFirestore.collection(this.COLLECTION).doc(userId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        // If document doesn't exist, we need to create it first
        
        // Try to get basic info from Firebase Auth
        const baseProfile: BasicUserProfile = {
          id: userId,
          email: updates.email || '',
          name: updates.name || 'User',
          role: updates.role || 'restaurant',
          createdAt: FirestoreTimestamp.now(),
          updatedAt: FirestoreTimestamp.now(),
          isActive: true,
          ...updates,
        };
        
        await docRef.set(baseProfile);
      } else {
        // Document exists, update it normally
        await docRef.update({
          ...updates,
          updatedAt: FirestoreTimestamp.now(),
        });
      }
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error}`);
    }
  }

  // Get all restaurants with optional location filtering
  static async getRestaurants(nearLocation?: { lat: number; lng: number; radiusKm?: number }): Promise<RestaurantProfile[]> {
    try {
      let query = firebaseFirestore
        .collection(this.COLLECTION)
        .where('role', '==', 'restaurant')
        .where('isActive', '==', true);

      const snapshot = await query.get();
      let restaurants = snapshot.docs.map(doc => doc.data() as RestaurantProfile);

      // If location is provided, filter by distance
      if (nearLocation && nearLocation.lat && nearLocation.lng) {
        const radiusKm = nearLocation.radiusKm || 10; // Default 10km radius
        restaurants = restaurants.filter(restaurant => {
          if (!restaurant.latitude || !restaurant.longitude) return false;
          
          const distance = this.calculateDistance(
            nearLocation.lat,
            nearLocation.lng,
            restaurant.latitude,
            restaurant.longitude
          );
          
          return distance <= radiusKm;
        });

        // Sort by distance
        restaurants.sort((a, b) => {
          const distanceA = this.calculateDistance(nearLocation.lat, nearLocation.lng, a.latitude!, a.longitude!);
          const distanceB = this.calculateDistance(nearLocation.lat, nearLocation.lng, b.latitude!, b.longitude!);
          return distanceA - distanceB;
        });
      }

      return restaurants;
    } catch (error) {
      throw new Error(`Failed to get restaurants: ${error}`);
    }
  }

  // Get all shelters with optional location filtering
  static async getShelters(nearLocation?: { lat: number; lng: number; radiusKm?: number }): Promise<ShelterProfile[]> {
    try {
      let query = firebaseFirestore
        .collection(this.COLLECTION)
        .where('role', '==', 'shelter')
        .where('isActive', '==', true);

      const snapshot = await query.get();
      let shelters = snapshot.docs.map(doc => doc.data() as ShelterProfile);

      // If location is provided, filter by distance
      if (nearLocation && nearLocation.lat && nearLocation.lng) {
        const radiusKm = nearLocation.radiusKm || 10; // Default 10km radius
        shelters = shelters.filter(shelter => {
          if (!shelter.latitude || !shelter.longitude) return false;
          
          const distance = this.calculateDistance(
            nearLocation.lat,
            nearLocation.lng,
            shelter.latitude,
            shelter.longitude
          );
          
          return distance <= radiusKm;
        });

        // Sort by distance
        shelters.sort((a, b) => {
          const distanceA = this.calculateDistance(nearLocation.lat, nearLocation.lng, a.latitude!, a.longitude!);
          const distanceB = this.calculateDistance(nearLocation.lat, nearLocation.lng, b.latitude!, b.longitude!);
          return distanceA - distanceB;
        });
      }

      return shelters;
    } catch (error) {
      throw new Error(`Failed to get shelters: ${error}`);
    }
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  static async searchRestaurantsByLocation(
    shelterLocation: { lat: number; lng: number },
    radiusKm: number = 10
  ): Promise<RestaurantProfile[]> {
    try {
      const restaurants = await this.getRestaurants({
        lat: shelterLocation.lat,
        lng: shelterLocation.lng,
        radiusKm
      });

      return restaurants;
    } catch (error) {
      throw new Error(`Failed to search restaurants: ${error}`);
    }
  }

  static async ensureUserProfile(userId: string, email: string, name: string, role: UserRole): Promise<void> {
    try {
      const existingProfile = await this.getUserProfile(userId);
      
      if (!existingProfile) {
        await this.createUserProfile(userId, email, name, role);
      }
    } catch (error) {
      throw new Error(`Failed to ensure user profile: ${error}`);
    }
  }
}
