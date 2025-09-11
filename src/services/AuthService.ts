import { firebaseAuth } from '../config/firebase';
import { User, UserRole, LoginCredentials, RegisterCredentials } from '../types/auth';
import { ProfileService } from './ProfileService';

export class AuthService {
  // Login with email and password
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userProfile = await ProfileService.getUserProfile(firebaseUser.uid);
      
      if (userProfile) {
        return {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
        };
      }

      // Fallback if no profile found
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'restaurant', // Default role - should rarely happen
      };

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Register with email, password, name, and role
  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;

      // Update the user's display name
      await firebaseUser.updateProfile({
        displayName: credentials.name,
      });

      // Create user profile in Firestore
      await ProfileService.createUserProfile(
        firebaseUser.uid,
        firebaseUser.email!,
        credentials.name,
        credentials.role
      );

      // Return user object (profile is created successfully)
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: credentials.name,
        role: credentials.role,
      };

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await firebaseAuth.signOut();
    } catch (error: any) {
      throw new Error('Failed to logout');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = firebaseAuth.currentUser;
      if (!firebaseUser) return null;

      // Get user profile from Firestore
      const userProfile = await ProfileService.getUserProfile(firebaseUser.uid);
      
      if (userProfile && userProfile.name && userProfile.email && userProfile.role) {
        return {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
        };
      }

      // Fallback if no profile found in Firestore
      console.log('⚠️ Using fallback profile for user:', firebaseUser.uid);
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'restaurant', // Default role
      };
    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error);
      return null;
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Convert Firebase error codes to user-friendly messages
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
