import { firebaseFirestore, FirestoreTimestamp } from '../config/firebase';
import { UserRole } from '../types/auth';

// Simplified profile types for now
export interface BasicUserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  description?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  isActive: boolean;
}

export interface RestaurantProfile extends BasicUserProfile {
  role: 'restaurant';
  restaurantName?: string;
  cuisineType?: string[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
}

export interface ShelterProfile extends BasicUserProfile {
  role: 'shelter';
  shelterName?: string;
  capacity?: number; // Number of people they can serve
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
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
        
      console.log('✅ User profile created successfully');
    } catch (error) {
      console.error('❌ Failed to create user profile:', error);
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
        console.log('No profile found for user:', userId);
        return null;
      }
      
      const profile = doc.data() as BasicUserProfile;
      if (profile && profile.name) {
        console.log('✅ Profile retrieved for:', profile.name);
      } else {
        console.log('✅ Profile retrieved but missing name field');
      }
      return profile;
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  // Get all restaurants
  static async getRestaurants(): Promise<RestaurantProfile[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTION)
        .where('role', '==', 'restaurant')
        .where('isActive', '==', true)
        .get();

      const restaurants = snapshot.docs.map(doc => doc.data() as RestaurantProfile);
      console.log(`✅ Found ${restaurants.length} restaurants`);
      return restaurants;
    } catch (error) {
      console.error('❌ Failed to get restaurants:', error);
      throw new Error(`Failed to get restaurants: ${error}`);
    }
  }

  // Get all shelters
  static async getShelters(): Promise<ShelterProfile[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTION)
        .where('role', '==', 'shelter')
        .where('isActive', '==', true)
        .get();

      const shelters = snapshot.docs.map(doc => doc.data() as ShelterProfile);
      console.log(`✅ Found ${shelters.length} shelters`);
      return shelters;
    } catch (error) {
      console.error('❌ Failed to get shelters:', error);
      throw new Error(`Failed to get shelters: ${error}`);
    }
  }
}
