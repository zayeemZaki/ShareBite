import { FirestoreService } from '../services/FirestoreService';
import { FirestoreTimestamp } from '../config/firebase';

// Example: How to use FirestoreService for shelters

export class ShelterExample {
  
  // 1. Complete shelter profile setup after registration
  static async completeShelterProfile(userId: string, shelterData: {
    shelterName: string;
    location: any;
    capacity: number;
    specialNeeds: string[];
    description?: string;
  }) {
    try {
      await FirestoreService.updateUserProfile(userId, {
        ...shelterData,
        role: 'shelter',
        totalReceived: 0,
      });
      console.log('Shelter profile completed');
    } catch (error) {
      console.error('Error updating shelter profile:', error);
    }
  }

  // 2. Browse and claim food listings
  static async browseAndClaimFood(shelterId: string, shelterName: string) {
    try {
      // Get available food listings
      const listings = await FirestoreService.getAvailableFoodListings();
      console.log('Available listings:', listings.length);

      // Claim the first available listing (example)
      if (listings.length > 0) {
        const listing = listings[0];
        
        const claimId = await FirestoreService.createFoodClaim({
          listingId: listing.id,
          shelterId,
          shelterName,
          requestedQuantity: listing.quantity,
          message: 'We would like to claim this food for our shelter.',
          status: 'pending',
        });

        console.log('Food claimed:', claimId);
        
        // Add to shelter history
        await FirestoreService.addShelterHistory(shelterId, {
          listingId: listing.id,
          restaurantId: listing.restaurantId,
          restaurantName: listing.restaurantName,
          action: 'claimed',
          details: {
            foodTitle: listing.title,
            quantityReceived: listing.quantity,
          },
        });

        return claimId;
      }
    } catch (error) {
      console.error('Error claiming food:', error);
    }
  }

  // 3. Get shelter history
  static async getShelterHistory(shelterId: string) {
    try {
      const history = await FirestoreService.getShelterHistory(shelterId);
      console.log('Shelter history:', history.length);
      
      // Filter by action type
      const receivedFood = history.filter(h => h.action === 'received');
      const claimedFood = history.filter(h => h.action === 'claimed');
      
      console.log('Food received:', receivedFood.length);
      console.log('Food claimed:', claimedFood.length);
      
      return history;
    } catch (error) {
      console.error('Error getting shelter history:', error);
    }
  }

  // 4. Get nearby food listings
  static async getNearbyFood(shelterLocation: any, radiusKm: number = 5) {
    try {
      const nearbyListings = await FirestoreService.getNearbyListings(
        shelterLocation,
        radiusKm
      );
      
      console.log(`Found ${nearbyListings.length} listings within ${radiusKm}km`);
      return nearbyListings;
    } catch (error) {
      console.error('Error getting nearby food:', error);
    }
  }

  // 5. Mark food as received
  static async markFoodAsReceived(
    shelterId: string,
    listingId: string,
    restaurantId: string,
    restaurantName: string,
    foodTitle: string,
    quantity: number,
    volunteerId?: string,
    volunteerName?: string
  ) {
    try {
      // Add to shelter history
      await FirestoreService.addShelterHistory(shelterId, {
        listingId,
        restaurantId,
        restaurantName,
        action: 'received',
        details: {
          foodTitle,
          quantityReceived: quantity,
          volunteerId,
          volunteerName,
          deliveryTime: FirestoreTimestamp.now(),
        },
      });

      console.log('Food marked as received');
    } catch (error) {
      console.error('Error marking food as received:', error);
    }
  }
}
