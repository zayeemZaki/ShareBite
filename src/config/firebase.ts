import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase auth instance
export const firebaseAuth = auth();

// Firestore instance
export const firebaseFirestore = firestore();

// Firestore utilities
export const FirestoreTimestamp = firestore.Timestamp;
export const FirestoreFieldValue = firestore.FieldValue;
