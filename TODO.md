# TODO for Food Sharing App - Post-Cleanup Tasks

## ✅ Completed Cleanup
- [x] Removed volunteer functionality (role, screens, navigation)
- [x] Consolidated UserRole types to restaurant/shelter only
- [x] Replaced custom navigation with React Navigation
- [x] Updated all components to use centralized theme system
- [x] Removed unused files (AppNavigator.tsx, Header.tsx, FoodCard.tsx, navigation.ts)
- [x] Fixed linting errors and TypeScript issues

## 🔧 Development Tasks
- [ ] Update ShelterDashboard.tsx
  - Replace inline food card styling with proper component
  - Add sorting options (distance, latest upload) for food items
  - Fetch and display food items posted by restaurants nearby
  - Show restaurant name, picture, time posted, distance on each food item listing
  - Add buttons for request pickup and contact restaurant on each listing

- [ ] Create FoodItem component to replace inline food card implementation
  - Include restaurant info, time posted, distance
  - Add buttons for request pickup and contact restaurant with handlers

- [ ] Implement proper data fetching from Firebase
  - Connect ProfileService methods to actual screens
  - Add real-time updates for food availability

- [ ] Test React Navigation integration thoroughly
  - Verify all navigation flows work correctly
  - Test back button behavior and deep linking

- [ ] Final review and deployment preparation
