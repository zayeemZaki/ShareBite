import { firebaseFirestore, FirestoreTimestamp } from '../config/firebase';
import {
  UserProfile,
  RestaurantProfile,
  ShelterProfile,
  VolunteerProfile,
  FoodListing,
  FoodClaim,
  Delivery,
  Rating,
  RestaurantHistory,
  ShelterHistory,
  VolunteerHistory,
  Notification,
  Location,
} from '../types/firestore';
import { UserRole } from '../types/auth';

export class FirestoreService {
  // Collection names
  private static COLLECTIONS = {
    USERS: 'users',
    FOOD_LISTINGS: 'foodListings',
    FOOD_CLAIMS: 'foodClaims',
    DELIVERIES: 'deliveries',
    RATINGS: 'ratings',
    RESTAURANT_HISTORY: 'restaurantHistory',
    SHELTER_HISTORY: 'shelterHistory',
    VOLUNTEER_HISTORY: 'volunteerHistory',
    NOTIFICATIONS: 'notifications',
  };

  // ============= USER PROFILE METHODS =============

  // Create user profile after registration
  static async createUserProfile(
    userId: string,
    email: string,
    name: string,
    role: UserRole,
    additionalData?: any
  ): Promise<void> {
    try {
      const baseProfile: Partial<UserProfile> = {
        id: userId,
        email,
        name,
        role,
        createdAt: FirestoreTimestamp.now(),
        updatedAt: FirestoreTimestamp.now(),
        isActive: true,
      };

      const profileData = { ...baseProfile, ...additionalData };

      await firebaseFirestore
        .collection(this.COLLECTIONS.USERS)
        .doc(userId)
        .set(profileData);
    } catch (error) {
      throw new Error(`Failed to create user profile: ${error}`);
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const doc = await firebaseFirestore
        .collection(this.COLLECTIONS.USERS)
        .doc(userId)
        .get();

      if (!doc.exists) return null;
      return doc.data() as UserProfile;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.COLLECTIONS.USERS)
        .doc(userId)
        .update({
          ...updates,
          updatedAt: FirestoreTimestamp.now(),
        });
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error}`);
    }
  }

  // Get all restaurants
  static async getRestaurants(): Promise<RestaurantProfile[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.USERS)
        .where('role', '==', 'restaurant')
        .where('isActive', '==', true)
        .get();

      return snapshot.docs.map(doc => doc.data() as RestaurantProfile);
    } catch (error) {
      throw new Error(`Failed to get restaurants: ${error}`);
    }
  }

  // Get all shelters
  static async getShelters(): Promise<ShelterProfile[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.USERS)
        .where('role', '==', 'shelter')
        .where('isActive', '==', true)
        .get();

      return snapshot.docs.map(doc => doc.data() as ShelterProfile);
    } catch (error) {
      throw new Error(`Failed to get shelters: ${error}`);
    }
  }

  // Get all volunteers
  static async getVolunteers(): Promise<VolunteerProfile[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.USERS)
        .where('role', '==', 'volunteer')
        .where('isActive', '==', true)
        .get();

      return snapshot.docs.map(doc => doc.data() as VolunteerProfile);
    } catch (error) {
      throw new Error(`Failed to get volunteers: ${error}`);
    }
  }

  // ============= FOOD LISTING METHODS =============

  // Create food listing
  static async createFoodListing(listing: Omit<FoodListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.FOOD_LISTINGS).doc();
      
      const listingData: FoodListing = {
        ...listing,
        id: docRef.id,
        createdAt: FirestoreTimestamp.now(),
        updatedAt: FirestoreTimestamp.now(),
      };

      await docRef.set(listingData);

      // Add to restaurant history
      await this.addRestaurantHistory(listing.restaurantId, {
        listingId: docRef.id,
        action: 'created',
        details: {
          foodTitle: listing.title,
          quantity: listing.quantity,
        },
      });

      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create food listing: ${error}`);
    }
  }

  // Get available food listings
  static async getAvailableFoodListings(): Promise<FoodListing[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.FOOD_LISTINGS)
        .where('status', '==', 'available')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as FoodListing);
    } catch (error) {
      throw new Error(`Failed to get food listings: ${error}`);
    }
  }

  // Get restaurant's food listings
  static async getRestaurantListings(restaurantId: string): Promise<FoodListing[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.FOOD_LISTINGS)
        .where('restaurantId', '==', restaurantId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as FoodListing);
    } catch (error) {
      throw new Error(`Failed to get restaurant listings: ${error}`);
    }
  }

  // Update food listing status
  static async updateFoodListingStatus(
    listingId: string,
    status: FoodListing['status'],
    additionalData?: Partial<FoodListing>
  ): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.COLLECTIONS.FOOD_LISTINGS)
        .doc(listingId)
        .update({
          status,
          ...additionalData,
          updatedAt: FirestoreTimestamp.now(),
        });
    } catch (error) {
      throw new Error(`Failed to update food listing: ${error}`);
    }
  }

  // ============= FOOD CLAIM METHODS =============

  // Create food claim
  static async createFoodClaim(claim: Omit<FoodClaim, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.FOOD_CLAIMS).doc();
      
      const claimData: FoodClaim = {
        ...claim,
        id: docRef.id,
        createdAt: FirestoreTimestamp.now(),
      };

      await docRef.set(claimData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create food claim: ${error}`);
    }
  }

  // Get claims for a listing
  static async getClaimsForListing(listingId: string): Promise<FoodClaim[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.FOOD_CLAIMS)
        .where('listingId', '==', listingId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as FoodClaim);
    } catch (error) {
      throw new Error(`Failed to get claims: ${error}`);
    }
  }

  // ============= DELIVERY METHODS =============

  // Create delivery
  static async createDelivery(delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.DELIVERIES).doc();
      
      const deliveryData: Delivery = {
        ...delivery,
        id: docRef.id,
        createdAt: FirestoreTimestamp.now(),
        updatedAt: FirestoreTimestamp.now(),
      };

      await docRef.set(deliveryData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create delivery: ${error}`);
    }
  }

  // Get volunteer's deliveries
  static async getVolunteerDeliveries(volunteerId: string): Promise<Delivery[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.DELIVERIES)
        .where('volunteerId', '==', volunteerId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Delivery);
    } catch (error) {
      throw new Error(`Failed to get volunteer deliveries: ${error}`);
    }
  }

  // ============= RATING METHODS =============

  // Create rating
  static async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.RATINGS).doc();
      
      const ratingData: Rating = {
        ...rating,
        id: docRef.id,
        createdAt: FirestoreTimestamp.now(),
      };

      await docRef.set(ratingData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create rating: ${error}`);
    }
  }

  // Get user's ratings
  static async getUserRatings(userId: string): Promise<Rating[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.RATINGS)
        .where('toUserId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as Rating);
    } catch (error) {
      throw new Error(`Failed to get user ratings: ${error}`);
    }
  }

  // ============= HISTORY METHODS =============

  // Add restaurant history
  static async addRestaurantHistory(
    restaurantId: string,
    historyData: Omit<RestaurantHistory, 'id' | 'restaurantId' | 'timestamp'>
  ): Promise<void> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.RESTAURANT_HISTORY).doc();
      
      const history: RestaurantHistory = {
        ...historyData,
        id: docRef.id,
        restaurantId,
        timestamp: FirestoreTimestamp.now(),
      };

      await docRef.set(history);
    } catch (error) {
      throw new Error(`Failed to add restaurant history: ${error}`);
    }
  }

  // Get restaurant history
  static async getRestaurantHistory(restaurantId: string): Promise<RestaurantHistory[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.RESTAURANT_HISTORY)
        .where('restaurantId', '==', restaurantId)
        .orderBy('timestamp', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as RestaurantHistory);
    } catch (error) {
      throw new Error(`Failed to get restaurant history: ${error}`);
    }
  }

  // Add shelter history
  static async addShelterHistory(
    shelterId: string,
    historyData: Omit<ShelterHistory, 'id' | 'shelterId' | 'timestamp'>
  ): Promise<void> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.SHELTER_HISTORY).doc();
      
      const history: ShelterHistory = {
        ...historyData,
        id: docRef.id,
        shelterId,
        timestamp: FirestoreTimestamp.now(),
      };

      await docRef.set(history);
    } catch (error) {
      throw new Error(`Failed to add shelter history: ${error}`);
    }
  }

  // Get shelter history
  static async getShelterHistory(shelterId: string): Promise<ShelterHistory[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.SHELTER_HISTORY)
        .where('shelterId', '==', shelterId)
        .orderBy('timestamp', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as ShelterHistory);
    } catch (error) {
      throw new Error(`Failed to get shelter history: ${error}`);
    }
  }

  // Add volunteer history
  static async addVolunteerHistory(
    volunteerId: string,
    historyData: Omit<VolunteerHistory, 'id' | 'volunteerId' | 'timestamp'>
  ): Promise<void> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.VOLUNTEER_HISTORY).doc();
      
      const history: VolunteerHistory = {
        ...historyData,
        id: docRef.id,
        volunteerId,
        timestamp: FirestoreTimestamp.now(),
      };

      await docRef.set(history);
    } catch (error) {
      throw new Error(`Failed to add volunteer history: ${error}`);
    }
  }

  // Get volunteer history
  static async getVolunteerHistory(volunteerId: string): Promise<VolunteerHistory[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.VOLUNTEER_HISTORY)
        .where('volunteerId', '==', volunteerId)
        .orderBy('timestamp', 'desc')
        .get();

      return snapshot.docs.map(doc => doc.data() as VolunteerHistory);
    } catch (error) {
      throw new Error(`Failed to get volunteer history: ${error}`);
    }
  }

  // ============= NOTIFICATION METHODS =============

  // Create notification
  static async createNotification(
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<string> {
    try {
      const docRef = firebaseFirestore.collection(this.COLLECTIONS.NOTIFICATIONS).doc();
      
      const notificationData: Notification = {
        ...notification,
        id: docRef.id,
        isRead: false,
        createdAt: FirestoreTimestamp.now(),
      };

      await docRef.set(notificationData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error}`);
    }
  }

  // Get user notifications
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.NOTIFICATIONS)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      return snapshot.docs.map(doc => doc.data() as Notification);
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error}`);
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.COLLECTIONS.NOTIFICATIONS)
        .doc(notificationId)
        .update({ isRead: true });
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error}`);
    }
  }

  // ============= UTILITY METHODS =============

  // Get nearby listings based on location
  static async getNearbyListings(
    userLocation: Location,
    radiusKm: number = 10
  ): Promise<FoodListing[]> {
    try {
      // Note: For production, consider using GeoFirestore for efficient geoqueries
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTIONS.FOOD_LISTINGS)
        .where('status', '==', 'available')
        .get();

      const listings = snapshot.docs.map(doc => doc.data() as FoodListing);
      
      // Filter by distance (simple implementation)
      return listings.filter(listing => {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          listing.location.latitude,
          listing.location.longitude
        );
        return distance <= radiusKm;
      });
    } catch (error) {
      throw new Error(`Failed to get nearby listings: ${error}`);
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Listen to real-time updates
  static subscribeToUserNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    return firebaseFirestore
      .collection(this.COLLECTIONS.NOTIFICATIONS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot(snapshot => {
        const notifications = snapshot.docs.map(doc => doc.data() as Notification);
        callback(notifications);
      });
  }

  static subscribeToAvailableListings(
    callback: (listings: FoodListing[]) => void
  ): () => void {
    return firebaseFirestore
      .collection(this.COLLECTIONS.FOOD_LISTINGS)
      .where('status', '==', 'available')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const listings = snapshot.docs.map(doc => doc.data() as FoodListing);
        callback(listings);
      });
  }
}
