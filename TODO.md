# Restaurant Dashboard Layout Update - TODO

## Completed Tasks ✅

### 1. Create New Screens
- [x] RestaurantHistory.tsx - Shows restaurant history, impact stats, and previous food items uploaded
- [x] AccountSettings.tsx - Basic account settings page with user information editing
- [x] NearbyShelters.tsx - Shows nearby food shelters with address, name, contact info

### 2. Create Header Component
- [x] HeaderWithBurger.tsx - New header with burger menu dropdown on top left

### 3. Update Restaurant Dashboard
- [x] Modified RestaurantDashboard.tsx to use HeaderWithBurger
- [x] Updated main content to show only current listed food items and "Post More Items" button
- [x] Removed old impact stats and recent shares sections

### 4. Update Navigation
- [x] Updated ScreenName type in navigation.ts to include new screens
- [x] Updated NavigationContext.tsx to use shared ScreenName type
- [x] Updated AppNavigator.tsx to handle routing for new screens

### 5. Update Types
- [x] Updated User interface in auth.ts to include phone and address fields

## Features Implemented

### Burger Menu Dropdown
- Restaurant History - View overall impact and previous uploads
- Nearby Shelters - Find and contact local food shelters
- Account Settings - Edit personal information

### Restaurant Dashboard
- Clean layout showing only current food items
- "Post More Items" button to add new food listings
- Burger menu for navigation to other features

### New Screens
- **Restaurant History**: Displays impact statistics and history of food donations
- **Nearby Shelters**: Lists local shelters with contact information and capacity status
- **Account Settings**: Allows editing of user profile information

## Next Steps
- Test navigation between screens
- Verify burger menu functionality
- Test on different screen sizes
- Implement actual data fetching for dynamic content
