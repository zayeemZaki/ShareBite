import { FirestoreService } from '../services/FirestoreService';
import { FoodListing, RestaurantProfile } from '../types/firestore';

// Example: How to use FirestoreService for restaurants

export class RestaurantExample {
  
  // 1. Complete restaurant profile setup after registration
  static async completeRestaurantProfile(userId: string, restaurantData: {
    restaurantName: string;
    cuisineType: string[];
    location: any; // Location object
    businessHours: any;
    description?: string;
  }) {
    try {
      await FirestoreService.updateUserProfile(userId, {
        ...restaurantData,
        role: 'restaurant',
        totalDonations: 0,
        rating: 0,
      });
      console.log('Restaurant profile completed');
    } catch (error) {
      console.error('Error updating restaurant profile:', error);
    }
  }

  // 2. Create a food listing
  static async createFoodListing(restaurantId: string, restaurantName: string) {
    const listing = {
      restaurantId,
      restaurantName,
      title: 'Fresh Vegetable Curry',
      description: 'Delicious vegetable curry with rice, good for 20 people',
      foodType: 'prepared' as const,
      cuisineType: 'Indian',
      quantity: 20,
      unit: 'servings',
      expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      pickupTimeStart: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      pickupTimeEnd: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      images: [],
      dietaryInfo: ['vegetarian', 'gluten-free'],
      allergens: [],
      status: 'available' as const,
    };

    try {
      const listingId = await FirestoreService.createFoodListing(listing);
      console.log('Food listing created:', listingId);
      return listingId;
    } catch (error) {
      console.error('Error creating food listing:', error);
    }
  }

  // 3. Get restaurant's listings and history
  static async getRestaurantData(restaurantId: string) {
    try {
      // Get current listings
      const listings = await FirestoreService.getRestaurantListings(restaurantId);
      
      // Get history
      const history = await FirestoreService.getRestaurantHistory(restaurantId);
      
      console.log('Restaurant listings:', listings.length);
      console.log('Restaurant history:', history.length);
      
      return { listings, history };
    } catch (error) {
      console.error('Error getting restaurant data:', error);
    }
  }

  // 4. Listen to real-time notifications
  static subscribeToNotifications(restaurantId: string) {
    return FirestoreService.subscribeToUserNotifications(restaurantId, (notifications) => {
      console.log('New notifications:', notifications.length);
      // Update UI with new notifications
    });
  }
}
