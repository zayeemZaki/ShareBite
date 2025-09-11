import { FirestoreService } from '../services/FirestoreService';
import { FirestoreTimestamp } from '../config/firebase';

// Example: How to use FirestoreService for volunteers

export class VolunteerExample {
  
  // 1. Complete volunteer profile setup after registration
  static async completeVolunteerProfile(userId: string, volunteerData: {
    location: any;
    availability: any;
    transportType: 'car' | 'bike' | 'walking' | 'public_transport';
    maxDistance: number;
    specialSkills: string[];
  }) {
    try {
      await FirestoreService.updateUserProfile(userId, {
        ...volunteerData,
        role: 'volunteer',
        totalDeliveries: 0,
        rating: 0,
      });
      console.log('Volunteer profile completed');
    } catch (error) {
      console.error('Error updating volunteer profile:', error);
    }
  }

  // 2. Accept a delivery assignment
  static async acceptDelivery(
    volunteerId: string,
    volunteerName: string,
    claimId: string,
    listingId: string,
    restaurantId: string,
    restaurantName: string,
    shelterId: string,
    shelterName: string
  ) {
    try {
      // Create delivery record
      const deliveryId = await FirestoreService.createDelivery({
        claimId,
        listingId,
        volunteerId,
        volunteerName,
        restaurantId,
        restaurantName,
        shelterId,
        shelterName,
        pickupLocation: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Restaurant Address',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
        deliveryLocation: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: 'Shelter Address',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
        },
        estimatedPickupTime: FirestoreTimestamp.fromDate(new Date(Date.now() + 30 * 60 * 1000)),
        estimatedDeliveryTime: FirestoreTimestamp.fromDate(new Date(Date.now() + 90 * 60 * 1000)),
        status: 'assigned',
      });

      // Add to volunteer history
      await FirestoreService.addVolunteerHistory(volunteerId, {
        deliveryId,
        listingId,
        restaurantId,
        restaurantName,
        shelterId,
        shelterName,
        action: 'assigned',
        details: {
          foodTitle: 'Food Item',
          quantity: 10,
        },
      });

      console.log('Delivery accepted:', deliveryId);
      return deliveryId;
    } catch (error) {
      console.error('Error accepting delivery:', error);
    }
  }

  // 3. Update delivery status
  static async updateDeliveryStatus(
    volunteerId: string,
    deliveryId: string,
    status: 'en_route_to_pickup' | 'picked_up' | 'en_route_to_delivery' | 'delivered'
  ) {
    try {
      const updateData: any = { status };
      
      if (status === 'picked_up') {
        updateData.actualPickupTime = FirestoreTimestamp.now();
      } else if (status === 'delivered') {
        updateData.actualDeliveryTime = FirestoreTimestamp.now();
      }

      // Update delivery status (you'd need to add this method to FirestoreService)
      // await FirestoreService.updateDelivery(deliveryId, updateData);

      // Add to volunteer history
      await FirestoreService.addVolunteerHistory(volunteerId, {
        deliveryId,
        listingId: 'listing-id', // You'd get this from the delivery record
        restaurantId: 'restaurant-id',
        restaurantName: 'Restaurant Name',
        shelterId: 'shelter-id',
        shelterName: 'Shelter Name',
        action: status === 'delivered' ? 'delivered' : 'picked_up',
        details: {
          foodTitle: 'Food Item',
          quantity: 10,
          pickupTime: status === 'picked_up' ? FirestoreTimestamp.now() : undefined,
          deliveryTime: status === 'delivered' ? FirestoreTimestamp.now() : undefined,
        },
      });

      console.log(`Delivery status updated to: ${status}`);
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  }

  // 4. Get volunteer history and statistics
  static async getVolunteerStats(volunteerId: string) {
    try {
      const history = await FirestoreService.getVolunteerHistory(volunteerId);
      const deliveries = await FirestoreService.getVolunteerDeliveries(volunteerId);
      
      // Calculate statistics
      const completedDeliveries = history.filter(h => h.action === 'delivered').length;
      const totalPickups = history.filter(h => h.action === 'picked_up').length;
      const assignedDeliveries = deliveries.filter(d => d.status === 'assigned').length;
      
      console.log('Volunteer Statistics:');
      console.log('- Completed deliveries:', completedDeliveries);
      console.log('- Total pickups:', totalPickups);
      console.log('- Assigned deliveries:', assignedDeliveries);
      
      return {
        history,
        deliveries,
        stats: {
          completedDeliveries,
          totalPickups,
          assignedDeliveries,
        },
      };
    } catch (error) {
      console.error('Error getting volunteer stats:', error);
    }
  }

  // 5. Get available volunteer opportunities
  static async getAvailableOpportunities(volunteerLocation: any, maxDistance: number) {
    try {
      // Get nearby listings that need volunteers
      const nearbyListings = await FirestoreService.getNearbyListings(
        volunteerLocation,
        maxDistance
      );
      
      // Filter for listings that are claimed but need pickup/delivery
      const opportunities = nearbyListings.filter(listing => 
        listing.status === 'claimed' && listing.volunteerId === undefined
      );
      
      console.log(`Found ${opportunities.length} volunteer opportunities`);
      return opportunities;
    } catch (error) {
      console.error('Error getting opportunities:', error);
    }
  }

  // 6. Submit rating after delivery
  static async submitRating(
    volunteerId: string,
    targetUserId: string,
    targetUserRole: 'restaurant' | 'shelter',
    deliveryId: string,
    rating: number,
    comment?: string
  ) {
    try {
      await FirestoreService.createRating({
        fromUserId: volunteerId,
        fromUserRole: 'volunteer',
        toUserId: targetUserId,
        toUserRole: targetUserRole,
        relatedId: deliveryId,
        relatedType: 'delivery',
        rating,
        comment,
      });

      console.log('Rating submitted');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }
}
