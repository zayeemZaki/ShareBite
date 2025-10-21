import { firebaseFirestore, FirestoreTimestamp } from '../config/firebase';

export type RequestStatus = 'requested' | 'approved' | 'declined' | 'picked_up';

export interface FoodItemRequest {
  id: string;
  foodItemId: string;
  shelterId: string;
  shelterName: string;
  requestedAt: any; // Firestore Timestamp
  status: RequestStatus;
  reviewedAt?: any; // When approved/declined
  pickedUpAt?: any; // When marked as picked up
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone?: string;
  title: string;
  description: string;
  quantity: string;
  cuisineType?: string[];
  expiryTime: any; // Firestore Timestamp
  pickupInstructions?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  allergens?: string[];
  imageUrl?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  // New fields for request management
  requests?: FoodItemRequest[]; // Populated when needed
  approvedRequest?: FoodItemRequest; // The approved request if any
  status?: RequestStatus; // Overall status of the item
}

export interface FoodItemRequestData {
  title: string;
  description: string;
  quantity: string;
  expiryHours: number; // How many hours from now until expiry
  pickupInstructions?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  allergens?: string[];
  imageUrl?: string;
}

export class FoodService {
  private static COLLECTION = 'foodItems';
  private static REQUESTS_COLLECTION = 'foodItemRequests';

  private static cleanObject(obj: any): any {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== null) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  }

  static async createFoodItem(
    restaurantId: string,
    restaurantProfile: any,
    foodData: FoodItemRequestData
  ): Promise<string> {
    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + (foodData.expiryHours || 24));

      const addressParts = [
        restaurantProfile.address,
        restaurantProfile.city,
        restaurantProfile.state
      ].filter(part => part && part.trim() !== '');
      
      const cleanAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Address not provided';

      const foodItem: any = {
        restaurantId: restaurantId || '',
        restaurantName: restaurantProfile.restaurantName || restaurantProfile.name || 'Unknown Restaurant',
        restaurantAddress: cleanAddress,
        title: foodData.title || '',
        description: foodData.description || '',
        quantity: foodData.quantity || '1',
        expiryTime: FirestoreTimestamp.fromDate(expiryTime),
        pickupInstructions: foodData.pickupInstructions || '',
        isAvailable: true,
        isVegetarian: Boolean(foodData.isVegetarian),
        isVegan: Boolean(foodData.isVegan),
        allergens: foodData.allergens || [],
        createdAt: FirestoreTimestamp.now(),
        updatedAt: FirestoreTimestamp.now(),
      };

      if (restaurantProfile.phone) {
        foodItem.restaurantPhone = restaurantProfile.phone;
      }
      
      if (restaurantProfile.cuisineType) {
        foodItem.cuisineType = restaurantProfile.cuisineType;
      }
      
      if (foodData.imageUrl) {
        foodItem.imageUrl = foodData.imageUrl;
      }

      const cleanedFoodItem = this.cleanObject(foodItem);
      const docRef = await firebaseFirestore
        .collection(this.COLLECTION)
        .add(cleanedFoodItem);

      await docRef.update({ id: docRef.id });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create food item: ${error}`);
    }
  }

  static async getAvailableFoodItems(
    location?: { lat: number; lng: number; radiusKm?: number }
  ): Promise<FoodItem[]> {
    try {
      const now = FirestoreTimestamp.now();
      
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTION)
        .where('isAvailable', '==', true)
        .get();

      let foodItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FoodItem));

      foodItems = foodItems.filter(item => {
        if (item.expiryTime && item.expiryTime.seconds) {
          return item.expiryTime.seconds > now.seconds;
        }
        return true;
      });

      foodItems.sort((a, b) => {
        if (a.expiryTime && b.expiryTime) {
          return a.expiryTime.seconds - b.expiryTime.seconds;
        }
        return 0;
      });

      return foodItems;
    } catch (error) {
      throw new Error(`Failed to get food items: ${error}`);
    }
  }

  static async getAvailableFoodItemsForShelter(
    shelterId: string,
    location?: { lat: number; lng: number; radiusKm?: number }
  ): Promise<FoodItem[]> {
    try {
      const allAvailableItems = await this.getAvailableFoodItems(location);
      const shelterRequests = await this.getShelterRequests(shelterId);
      const requestedFoodItemIds = new Set(shelterRequests.map(req => req.foodItemId));
      
      const availableForShelter = allAvailableItems.filter(item => 
        !requestedFoodItemIds.has(item.id)
      );
      
      return availableForShelter;
    } catch (error) {
      throw new Error(`Failed to get available food items for shelter: ${error}`);
    }
  }

  static async getFoodItemsByRestaurant(restaurantId: string): Promise<FoodItem[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTION)
        .where('restaurantId', '==', restaurantId)
        .orderBy('createdAt', 'desc')
        .get();

      const foodItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FoodItem));

      return foodItems;
    } catch (error) {
      throw new Error(`Failed to get restaurant food items: ${error}`);
    }
  }

  static async claimFoodItem(foodItemId: string, shelterId: string): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.COLLECTION)
        .doc(foodItemId)
        .update({
          claimedBy: shelterId,
          claimedAt: FirestoreTimestamp.now(),
          isAvailable: false,
          updatedAt: FirestoreTimestamp.now(),
        });

    } catch (error) {
      throw new Error(`Failed to claim food item: ${error}`);
    }
  }

  static async updateFoodItemAvailability(
    foodItemId: string, 
    isAvailable: boolean
  ): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.COLLECTION)
        .doc(foodItemId)
        .update({
          isAvailable,
          updatedAt: FirestoreTimestamp.now(),
        });

    } catch (error) {
      throw new Error(`Failed to update food item: ${error}`);
    }
  }

  static async getRestaurantFoodItems(restaurantId: string): Promise<FoodItem[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.COLLECTION)
        .where('restaurantId', '==', restaurantId)
        .get();

      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FoodItem));

      return items.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
    } catch (error) {
      throw new Error(`Failed to get restaurant food items: ${error}`);
    }
  }

  static async deleteFoodItem(foodItemId: string): Promise<void> {
    try {
      const requestsSnapshot = await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .where('foodItemId', '==', foodItemId)
        .get();

      if (!requestsSnapshot.empty) {
        const batch = firebaseFirestore.batch();
        requestsSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }

      await firebaseFirestore
        .collection(this.COLLECTION)
        .doc(foodItemId)
        .delete();

    } catch (error) {
      throw new Error(`Failed to delete food item: ${error}`);
    }
  }

  static async requestFoodItem(
    foodItemId: string, 
    shelterId: string, 
    shelterName: string
  ): Promise<string> {
    try {
      const itemDoc = await firebaseFirestore
        .collection(this.COLLECTION)
        .doc(foodItemId)
        .get();

      if (!itemDoc.exists()) {
        throw new Error('Food item not found');
      }

      const item = itemDoc.data() as FoodItem;
      if (!item.isAvailable) {
        throw new Error('Food item is no longer available');
      }

      const existingRequest = await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .where('foodItemId', '==', foodItemId)
        .where('shelterId', '==', shelterId)
        .where('status', 'in', ['requested', 'approved'])
        .get();

      if (!existingRequest.empty) {
        throw new Error('You already have a pending request for this item');
      }

      const requestData: Omit<FoodItemRequest, 'id'> = {
        foodItemId,
        shelterId,
        shelterName,
        status: 'requested',
        requestedAt: FirestoreTimestamp.now(),
      };

      const docRef = await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .add(requestData);

      await docRef.update({ id: docRef.id });

      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to request food item: ${error}`);
    }
  }

  static async getFoodItemRequests(foodItemId: string): Promise<FoodItemRequest[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .where('foodItemId', '==', foodItemId)
        .get();

      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FoodItemRequest));

      return requests.sort((a, b) => {
        if (a.requestedAt && b.requestedAt) {
          return b.requestedAt.seconds - a.requestedAt.seconds;
        }
        return 0;
      });
    } catch (error) {
      throw new Error(`Failed to get food item requests: ${error}`);
    }
  }

  static async getShelterRequests(shelterId: string): Promise<FoodItemRequest[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .where('shelterId', '==', shelterId)
        .get();

      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FoodItemRequest));

      return requests.sort((a, b) => {
        if (a.requestedAt && b.requestedAt) {
          return b.requestedAt.seconds - a.requestedAt.seconds;
        }
        return 0;
      });
    } catch (error) {
      throw new Error(`Failed to get shelter requests: ${error}`);
    }
  }

  static async reviewRequest(
    requestId: string, 
    status: 'approved' | 'declined'
  ): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .doc(requestId)
        .update({
          status,
          reviewedAt: FirestoreTimestamp.now(),
        });

      if (status === 'approved') {
        const requestDoc = await firebaseFirestore
          .collection(this.REQUESTS_COLLECTION)
          .doc(requestId)
          .get();

        if (requestDoc.exists()) {
          const request = requestDoc.data() as FoodItemRequest;
          
          // Decline all other pending requests for this food item
          const otherRequests = await firebaseFirestore
            .collection(this.REQUESTS_COLLECTION)
            .where('foodItemId', '==', request.foodItemId)
            .where('status', '==', 'requested')
            .get();

          const batch = firebaseFirestore.batch();
          otherRequests.docs.forEach(doc => {
            if (doc.id !== requestId) {
              batch.update(doc.ref, {
                status: 'declined',
                reviewedAt: FirestoreTimestamp.now(),
              });
            }
          });
          await batch.commit();

          await firebaseFirestore
            .collection(this.COLLECTION)
            .doc(request.foodItemId)
            .update({
              isAvailable: false,
              updatedAt: FirestoreTimestamp.now(),
            });
        }
      }

    } catch (error) {
      throw new Error(`Failed to ${status} request: ${error}`);
    }
  }

  static async markAsPickedUp(requestId: string): Promise<void> {
    try {
      await firebaseFirestore
        .collection(this.REQUESTS_COLLECTION)
        .doc(requestId)
        .update({
          status: 'picked_up',
          pickedUpAt: FirestoreTimestamp.now(),
        });

    } catch (error) {
      throw new Error(`Failed to mark item as picked up: ${error}`);
    }
  }

  static async getRestaurantFoodItemsWithRequests(restaurantId: string): Promise<FoodItem[]> {
    try {
      const items = await this.getRestaurantFoodItems(restaurantId);
      
      const itemsWithRequests = await Promise.all(
        items.map(async (item) => {
          const requests = await this.getFoodItemRequests(item.id);
          const approvedRequest = requests.find(req => req.status === 'approved' || req.status === 'picked_up');
          
          return {
            ...item,
            requests,
            approvedRequest,
            status: approvedRequest?.status || (requests.length > 0 ? 'requested' : undefined)
          } as FoodItem;
        })
      );

      return itemsWithRequests;
    } catch (error) {
      throw new Error(`Failed to get restaurant food items with requests: ${error}`);
    }
  }

  static async getShelterRequestsWithFoodDetails(shelterId: string): Promise<(FoodItemRequest & { foodItem?: FoodItem })[]> {
    try {
      const requests = await this.getShelterRequests(shelterId);
      
      const requestsWithFoodDetails = await Promise.all(
        requests.map(async (request) => {
          try {
            const foodItemDoc = await firebaseFirestore
              .collection(this.COLLECTION)
              .doc(request.foodItemId)
              .get();

            if (foodItemDoc.exists()) {
              return {
                ...request,
                foodItem: { id: foodItemDoc.id, ...foodItemDoc.data() } as FoodItem
              };
            }
            return request;
          } catch (error) {
            return request;
          }
        })
      );

      return requestsWithFoodDetails;
    } catch (error) {
      throw new Error(`Failed to get shelter requests with food details: ${error}`);
    }
  }
}