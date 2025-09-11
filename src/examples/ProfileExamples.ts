import { ProfileService, RestaurantProfile, ShelterProfile, VolunteerProfile } from '../services/ProfileService';

// Simple examples for profile management

export class ProfileExamples {
  
  // 1. Complete profile after registration
  static async completeRestaurantProfile(userId: string) {
    try {
      const restaurantData = {
        restaurantName: "Joe's Pizza Place",
        cuisineType: ['Italian', 'Pizza'],
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        phone: "(555) 123-4567",
        description: "Family-owned pizza restaurant serving fresh, delicious pizzas since 1995.",
      };

      await ProfileService.updateUserProfile(userId, restaurantData);
      console.log('✅ Restaurant profile completed!');
    } catch (error) {
      console.error('❌ Error completing restaurant profile:', error);
    }
  }

  static async completeShelterProfile(userId: string) {
    try {
      const shelterData = {
        shelterName: "Hope Community Shelter",
        capacity: 150,
        address: "456 Oak Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        phone: "(555) 987-6543",
        description: "Providing shelter and meals to homeless individuals and families in need.",
      };

      await ProfileService.updateUserProfile(userId, shelterData);
      console.log('✅ Shelter profile completed!');
    } catch (error) {
      console.error('❌ Error completing shelter profile:', error);
    }
  }

  static async completeVolunteerProfile(userId: string) {
    try {
      const volunteerData = {
        address: "789 Pine Street",
        city: "New York", 
        state: "NY",
        zipCode: "10003",
        phone: "(555) 456-7890",
        transportType: 'car' as const,
        maxDistance: 10, // 10km
      };

      await ProfileService.updateUserProfile(userId, volunteerData);
      console.log('✅ Volunteer profile completed!');
    } catch (error) {
      console.error('❌ Error completing volunteer profile:', error);
    }
  }

  // 2. Get and display profile data
  static async getMyProfile(userId: string) {
    try {
      const profile = await ProfileService.getUserProfile(userId);
      
      if (profile) {
        console.log('👤 My Profile:');
        console.log(`Name: ${profile.name}`);
        console.log(`Email: ${profile.email}`);
        console.log(`Role: ${profile.role}`);
        
        if (profile.role === 'restaurant') {
          const restaurantProfile = profile as RestaurantProfile;
          console.log(`Restaurant: ${restaurantProfile.restaurantName}`);
          console.log(`Cuisine: ${restaurantProfile.cuisineType?.join(', ')}`);
        } else if (profile.role === 'shelter') {
          const shelterProfile = profile as ShelterProfile;
          console.log(`Shelter: ${shelterProfile.shelterName}`);
          console.log(`Capacity: ${shelterProfile.capacity} people`);
        } else if (profile.role === 'volunteer') {
          const volunteerProfile = profile as VolunteerProfile;
          console.log(`Transport: ${volunteerProfile.transportType}`);
          console.log(`Max Distance: ${volunteerProfile.maxDistance}km`);
        }
        
        return profile;
      } else {
        console.log('❌ No profile found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting profile:', error);
    }
  }

  // 3. Browse all users by type
  static async browseRestaurants() {
    try {
      const restaurants = await ProfileService.getRestaurants();
      
      console.log(`🍕 Found ${restaurants.length} restaurants:`);
      restaurants.forEach(restaurant => {
        console.log(`- ${restaurant.restaurantName} (${restaurant.cuisineType?.join(', ')})`);
        console.log(`  📍 ${restaurant.city}, ${restaurant.state}`);
        console.log(`  📞 ${restaurant.phone}`);
      });
      
      return restaurants;
    } catch (error) {
      console.error('❌ Error getting restaurants:', error);
    }
  }

  static async browseShelters() {
    try {
      const shelters = await ProfileService.getShelters();
      
      console.log(`🏠 Found ${shelters.length} shelters:`);
      shelters.forEach(shelter => {
        console.log(`- ${shelter.shelterName} (Capacity: ${shelter.capacity})`);
        console.log(`  📍 ${shelter.city}, ${shelter.state}`);
        console.log(`  📞 ${shelter.phone}`);
      });
      
      return shelters;
    } catch (error) {
      console.error('❌ Error getting shelters:', error);
    }
  }

  static async browseVolunteers() {
    try {
      const volunteers = await ProfileService.getVolunteers();
      
      console.log(`🚚 Found ${volunteers.length} volunteers:`);
      volunteers.forEach(volunteer => {
        console.log(`- ${volunteer.name} (${volunteer.transportType})`);
        console.log(`  📍 ${volunteer.city}, ${volunteer.state}`);
        console.log(`  🚗 Max distance: ${volunteer.maxDistance}km`);
      });
      
      return volunteers;
    } catch (error) {
      console.error('❌ Error getting volunteers:', error);
    }
  }

  // 4. Update profile information
  static async updateContactInfo(userId: string, phone: string) {
    try {
      await ProfileService.updateUserProfile(userId, { phone });
      console.log('✅ Phone number updated!');
    } catch (error) {
      console.error('❌ Error updating phone:', error);
    }
  }

  static async updateDescription(userId: string, description: string) {
    try {
      await ProfileService.updateUserProfile(userId, { description });
      console.log('✅ Description updated!');
    } catch (error) {
      console.error('❌ Error updating description:', error);
    }
  }
}

// Example usage in a React component:
/*
// In your component
useEffect(() => {
  const loadProfile = async () => {
    const profile = await ProfileExamples.getMyProfile(currentUser.id);
    setUserProfile(profile);
  };
  
  loadProfile();
}, [currentUser.id]);

// To complete profile
const handleCompleteProfile = async () => {
  if (currentUser.role === 'restaurant') {
    await ProfileExamples.completeRestaurantProfile(currentUser.id);
  } else if (currentUser.role === 'shelter') {
    await ProfileExamples.completeShelterProfile(currentUser.id);
  } else if (currentUser.role === 'volunteer') {
    await ProfileExamples.completeVolunteerProfile(currentUser.id);
  }
};
*/
