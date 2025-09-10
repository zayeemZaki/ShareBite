# Firebase Authentication Setup for ShareBite

This guide will help you complete the Firebase Authentication integration for your ShareBite app.

## What's Already Done

✅ **Dependencies Installed:**
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-async-storage/async-storage`

✅ **Code Updated:**
- Firebase configuration file created
- AuthService with Firebase authentication methods
- AuthContext updated to use Firebase
- Login/Register forms updated with better error handling
- Forgot password functionality added

✅ **Android Configuration:**
- Firebase plugin added to build.gradle files

## What You Need to Do

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ShareBite` (or your preferred name)
4. Enable Google Analytics (optional)
5. Complete project setup

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Optionally enable other providers (Google, Apple, etc.)

### 3. Add Android App

1. In Firebase Console, click **Add app** → **Android**
2. Enter these details:
   - **Package name**: `com.sharebiteapp`
   - **App nickname**: `ShareBite Android`
   - **Debug signing certificate**: (optional for development)
3. Download `google-services.json`
4. Move it to: `android/app/google-services.json`

### 4. Add iOS App (if building for iOS)

1. In Firebase Console, click **Add app** → **iOS**
2. Enter these details:
   - **Bundle ID**: `com.sharebiteapp` (or your preferred bundle ID)
   - **App nickname**: `ShareBite iOS`
3. Download `GoogleService-Info.plist`
4. Add it to your iOS project in Xcode

### 5. Update Firebase Configuration

1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

You can find these values in:
- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

### 6. iOS Additional Setup (if building for iOS)

Add these lines to `ios/Podfile`:

```ruby
pod 'Firebase', :modular_headers => true
pod 'FirebaseCore', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
```

Then run:
```bash
cd ios && pod install
```

### 7. Test the Authentication

1. Build and run your app
2. Try registering a new account
3. Try logging in with the new account
4. Test the forgot password functionality
5. Verify that authentication state persists between app launches

## Features Now Available

✅ **Email/Password Authentication**
- User registration with role selection (Restaurant, Shelter, Volunteer)
- User login with email and password
- Automatic authentication state management
- Persistent login (user stays logged in between app launches)

✅ **Password Reset**
- Forgot password functionality
- Email-based password reset

✅ **Enhanced Security**
- Firebase handles password hashing and security
- Built-in protection against common attacks
- Email verification (can be enabled in Firebase Console)

✅ **Error Handling**
- User-friendly error messages
- Proper validation and feedback

## Additional Firebase Features You Can Add Later

- **Email Verification**: Require users to verify their email
- **Social Login**: Google, Apple, Facebook authentication
- **Phone Authentication**: SMS-based login
- **Multi-factor Authentication**: Additional security layer
- **Custom Claims**: Role-based permissions
- **Firestore Integration**: User profiles and app data storage

## Troubleshooting

**Build Errors:**
- Make sure `google-services.json` is in the correct location
- Clean and rebuild: `cd android && ./gradlew clean`
- For iOS: `cd ios && pod install --repo-update`

**Authentication Errors:**
- Verify Firebase configuration values are correct
- Check that Email/Password provider is enabled in Firebase Console
- Ensure SHA-1 fingerprint is added for production builds

**Network Errors:**
- Check internet connection
- Verify Firebase project is active
- Check Firebase Console for any service disruptions

## Security Best Practices

1. **Never commit** `google-services.json` or `GoogleService-Info.plist` to public repositories
2. **Use environment variables** for sensitive configuration in production
3. **Enable email verification** for production apps
4. **Set up proper security rules** in Firebase Console
5. **Monitor authentication events** in Firebase Console

Your ShareBite app now has a robust, production-ready authentication system powered by Firebase! 🎉
