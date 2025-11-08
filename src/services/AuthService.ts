import { firebaseAuth } from '../config/firebase';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { ProfileService } from './ProfileService';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;
      
      const userProfile = await ProfileService.getUserProfile(firebaseUser.uid);
      
      if (userProfile) {
        const baseUser = {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          phone: userProfile.phone || '',
          address: userProfile.address || '',
        };

        // Add role-specific fields if they exist
        const profileData = userProfile as any;
        if (userProfile.role === 'restaurant') {
          return {
            ...baseUser,
            restaurantName: profileData.restaurantName,
            restaurantType: profileData.restaurantType,
          };
        } else if (userProfile.role === 'shelter') {
          return {
            ...baseUser,
            shelterName: profileData.shelterName,
            shelterType: profileData.shelterType,
            capacity: profileData.capacity,
            operatingHours: profileData.operatingHours,
          };
        }
        
        return baseUser;
      }

      // Fallback if no profile found
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'restaurant', // Default role - should rarely happen
        phone: '',
        address: '',
      };

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;

      await firebaseUser.updateProfile({
        displayName: credentials.name,
      });

      // Create user profile with all details
      await ProfileService.createUserProfile(
        firebaseUser.uid,
        firebaseUser.email!,
        credentials.name,
        credentials.role,
        credentials.phone,
        credentials.address,
        credentials.role === 'restaurant' ? {
          restaurantName: credentials.restaurantName,
          restaurantType: credentials.restaurantType,
        } : {
          shelterName: credentials.shelterName,
          shelterType: credentials.shelterType,
          capacity: credentials.capacity,
          operatingHours: credentials.operatingHours,
        }
      );

      // Return user object (profile is created successfully)
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: credentials.name,
        role: credentials.role,
        phone: credentials.phone,
        address: credentials.address,
        ...(credentials.role === 'restaurant' ? {
          restaurantName: credentials.restaurantName,
          restaurantType: credentials.restaurantType,
        } : {
          shelterName: credentials.shelterName,
          shelterType: credentials.shelterType,
          capacity: credentials.capacity,
          operatingHours: credentials.operatingHours,
        }),
      };

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async logout(): Promise<void> {
    try {
      await firebaseAuth.signOut();
    } catch (error: any) {
      throw new Error('Failed to logout');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = firebaseAuth.currentUser;
      if (!firebaseUser) return null;

      const userProfile = await ProfileService.getUserProfile(firebaseUser.uid);
      
      if (userProfile && userProfile.name && userProfile.email && userProfile.role) {
        const baseUser = {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          phone: userProfile.phone || '',
          address: userProfile.address || '',
        };

        // Add role-specific fields if they exist
        const profileData = userProfile as any;
        if (userProfile.role === 'restaurant') {
          return {
            ...baseUser,
            restaurantName: profileData.restaurantName,
            restaurantType: profileData.restaurantType,
          };
        } else if (userProfile.role === 'shelter') {
          return {
            ...baseUser,
            shelterName: profileData.shelterName,
            shelterType: profileData.shelterType,
            capacity: profileData.capacity,
            operatingHours: profileData.operatingHours,
          };
        }
        
        return baseUser;
      }

      // Fallback if no profile found in Firestore
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'restaurant', // Default role
        phone: '',
        address: '',
      };
    } catch (error) {
      return null;
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
