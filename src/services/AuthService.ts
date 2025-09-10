import { firebaseAuth } from '../config/firebase';
import { User, UserRole, LoginCredentials, RegisterCredentials } from '../types/auth';

export class AuthService {
  // Login with email and password
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;
      
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'restaurant', // Default role - in production, store this in Firestore
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

      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'restaurant', // Default role - in production, store this in Firestore
      };
    } catch (error) {
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
