# Design System Update TODO

## Phase 1: Theme System Creation
- [x] Create `src/theme/index.ts` with comprehensive theme including colors, typography, spacing, shadows, and gradients for light/dark modes

## Phase 2: Component Updates
- [x] Update `src/components/common/Button.tsx` to use theme, add dark mode support, and apply modern styling with gradients
- [x] Update `src/components/common/Header.tsx` to use theme colors, add modern shadows and gradients
- [x] Update `src/components/common/HeaderWithBurger.tsx` to use theme, enhance with subtle animations and modern design

## Phase 3: Screen Updates
- [x] Update `src/screens/restaurant/NearbyShelters.tsx` to use theme, add gradients to cards, improve shadows and modern elements
- [x] Update `src/screens/restaurant/RestaurantDashboard.tsx` to use theme and apply modern design elements
- [ ] Update `src/screens/restaurant/ShareFood.tsx` to use theme and apply modern design elements

## Phase 4: Followup and Testing
- [ ] Test dark mode consistency across all screens
- [ ] Verify accessibility (contrast ratios)
- [ ] Run the app to ensure no regressions

# UI Refactor TODO

## Phase 1: Enhanced Theme and Palette
- [ ] Update `src/theme/index.ts` with new modern color palette (indigo/violet/cyan), improved typography, and consistent design tokens

## Phase 2: Theme Context for Manual Dark Mode
- [ ] Create `src/context/ThemeContext.tsx` for manual dark mode toggle that overrides system preference

## Phase 3: Account Settings Dark Mode Toggle
- [ ] Update `src/screens/restaurant/AccountSettings.tsx` to include dark mode toggle switch and use ThemeContext

## Phase 4: Refactor Components to Use ThemeContext
- [x] Update `src/components/common/Button.tsx` to use ThemeContext
- [x] Update `src/components/common/Header.tsx` to use ThemeContext
- [ ] Update `src/components/common/HeaderWithBurger.tsx` to use ThemeContext
- [x] Update `src/screens/restaurant/NearbyShelters.tsx` to use ThemeContext
- [x] Update `src/screens/restaurant/RestaurantDashboard.tsx` to use ThemeContext
- [ ] Update `src/screens/restaurant/ShareFood.tsx` to use ThemeContext

## Phase 5: Modern Styling Enhancements
- [ ] Apply enhanced shadows, better rounded corners, improved spacing, and subtle gradients across all components
- [ ] Ensure responsive design for different screen sizes

## Phase 6: Testing and Polish
- [ ] Test dark mode toggle functionality in AccountSettings
- [ ] Verify accessibility and contrast ratios
- [ ] Test on different screen sizes and orientations
