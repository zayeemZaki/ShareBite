# 🍽️ ShareBite - Food Sharing App

ShareBite is a React Native application that connects restaurants, shelters, and volunteers to reduce food waste and help communities in need. Restaurants can share surplus food, shelters can request meals, and volunteers can facilitate deliveries.

![React Native](https://img.shields.io/badge/React%20Native-0.81.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 🏪 For Restaurants
- Share surplus food with nearby shelters
- Track food donations and impact metrics
- Manage food listings and availability
- View donation history and statistics

### 🏠 For Shelters
- Browse available food from local restaurants
- Request specific food items based on needs
- Track received donations and people fed
- Manage pickup schedules

### 🚗 For Volunteers
- Find nearby food pickup/delivery opportunities
- Accept delivery assignments
- Track delivery statistics and impact
- Coordinate with restaurants and shelters

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 20.0.0)
- **Java Development Kit** (JDK 17 - 20)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **CocoaPods** (for iOS dependencies, macOS only)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zayeemZaki/ShareBite.git
   cd ShareBite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **For iOS (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

1. **Start the Metro bundler:**
   ```bash
   npm start
   ```

2. **Run on Android:**
   ```bash
   npm run android
   ```

3. **Run on iOS (macOS only):**
   ```bash
   npm run ios
   ```

## 🔐 Demo Credentials

The app includes demo accounts for testing all user roles:

| Role | Email | Password |
|------|-------|----------|
| 🏪 Restaurant | `restaurant@test.com` | `password` |
| 🏠 Shelter | `shelter@test.com` | `password` |
| 🚗 Volunteer | `volunteer@test.com` | `password` |

## 📱 Platform Support

### ✅ Android
- **API Level:** 24+ (Android 7.0+)
- **Architecture:** arm64-v8a, armeabi-v7a, x86, x86_64
- **Build Tools:** Gradle 8.14.3
- **Status:** Fully supported and tested

### ✅ iOS
- **iOS Version:** 12.0+
- **Architectures:** arm64
- **Build Tools:** Xcode 15+
- **Status:** Fully supported (requires macOS for development)

## 🏗️ Architecture

### Project Structure
```
ShareBite/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication-related components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RoleSelector.tsx
│   │   ├── common/          # Common UI components
│   │   │   ├── Button.tsx
│   │   │   └── Header.tsx
│   │   └── FoodCard.tsx     # Food item display component
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── navigation/          # App navigation logic
│   │   └── AppNavigator.tsx
│   ├── screens/             # Screen components
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx
│   │   ├── restaurant/
│   │   │   └── RestaurantDashboard.tsx
│   │   ├── shelter/
│   │   │   └── ShelterDashboard.tsx
│   │   └── volunteer/
│   │       └── VolunteerDashboard.tsx
│   └── types/               # TypeScript type definitions
│       └── auth.ts
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── __tests__/               # Test files
└── App.tsx                  # Root component
```

### Key Components

#### 🔐 Authentication System
- **AuthContext**: Manages user authentication state using React Context
- **Role-based routing**: Different interfaces for restaurants, shelters, and volunteers
- **Persistent login**: Uses React Native's built-in storage (currently in-memory for demo)

#### 🎨 UI Components
- **Reusable components**: Consistent Button, Header, and FoodCard components
- **Dark mode support**: Automatically adapts to system theme preferences
- **Responsive design**: Works across different screen sizes

#### 📱 Navigation
- **Conditional routing**: Shows appropriate screens based on authentication status
- **Role-specific dashboards**: Each user type sees relevant features and data

## 🛠️ Development

### Environment Setup

1. **Java Environment (for Android):**
   ```bash
   # Install Java 17 (recommended)
   brew install openjdk@17
   
   # Set JAVA_HOME
   export JAVA_HOME=/opt/homebrew/opt/openjdk@17
   export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
   ```

2. **Android SDK:**
   - Install Android Studio
   - Install SDK platforms: API 35, API 36
   - Set ANDROID_HOME environment variable

3. **iOS Setup (macOS only):**
   ```bash
   # Install CocoaPods
   sudo gem install cocoapods
   
   # Install iOS dependencies
   cd ios && pod install
   ```

### Development Scripts

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android
npx react-native run-android

# Run on iOS
npm run ios

# Run tests
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### Building for Production

#### Android APK
```bash
cd android
./gradlew assembleRelease
```

#### iOS Build
```bash
# Open in Xcode
open ios/ShareBiteApp.xcworkspace

# Or build from command line
npx react-native run-ios --configuration Release
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] Login with restaurant account
- [ ] Login with shelter account  
- [ ] Login with volunteer account
- [ ] Register new account with role selection
- [ ] Logout functionality

#### Role-Specific Features
- [ ] Restaurant dashboard displays correctly
- [ ] Shelter can view available food
- [ ] Volunteer can see delivery opportunities
- [ ] Dark mode switches properly
- [ ] Navigation between screens works

## 🔧 Configuration

### App Configuration
- **App Name**: ShareBite
- **Bundle ID**: `com.sharebiteapp`
- **Version**: 0.0.1

### Environment Variables
```bash
# Development
NODE_ENV=development

# Java (Android)
JAVA_HOME=/opt/homebrew/opt/openjdk@17

# Android SDK
ANDROID_HOME=/Users/[username]/Library/Android/sdk
```

## 🚨 Troubleshooting

### Common Issues

#### Android Build Failures
1. **JDK Version Issues:**
   ```bash
   # Check Java version
   java -version
   
   # Should be JDK 17-20, not 23+
   ```

2. **Android SDK Issues:**
   ```bash
   # Check SDK installation
   npx react-native doctor
   ```

3. **Clear Cache:**
   ```bash
   # Clear React Native cache
   npx react-native start --reset-cache
   
   # Clear Android build cache
   cd android && ./gradlew clean
   ```

#### iOS Build Issues
1. **CocoaPods Issues:**
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```

2. **Xcode Issues:**
   - Clean build folder (Cmd+Shift+K)
   - Clear derived data
   - Restart Xcode

#### Metro Bundler Issues
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Reset npm cache
npm start -- --reset-cache
```

## 🔄 State Management

### Authentication Flow
1. **App Launch**: Check for stored user data
2. **Login**: Validate credentials, store user data, update auth state
3. **Navigation**: Route to appropriate dashboard based on user role
4. **Logout**: Clear user data, return to login screen

### Data Flow
```
User Input → AuthContext → State Update → Navigation → Screen Render
```

## 🎨 Theming & Styling

### Dark Mode Support
The app automatically adapts to system theme preferences:
- Uses `useColorScheme()` hook to detect theme
- Conditional styling based on dark/light mode
- Consistent color palette across all components

### Color Palette
```typescript
// Light Mode
background: '#ffffff'
text: '#2c3e50'
card: '#f8f9fa'
primary: '#27ae60'
secondary: '#3498db'

// Dark Mode  
background: '#1a1a1a'
text: '#ffffff'
card: '#2c2c2c'
primary: '#27ae60'
secondary: '#3498db'
```

## 🔮 Future Enhancements

### Backend Integration
- [ ] REST API integration
- [ ] Real user authentication with JWT
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File upload for food images

### Features
- [ ] Real-time messaging between users
- [ ] GPS tracking for deliveries
- [ ] Push notifications
- [ ] Food expiration tracking
- [ ] Rating and review system
- [ ] Analytics dashboard

### Technical Improvements
- [ ] Add persistent storage (AsyncStorage or SQLite)
- [ ] Implement proper error handling
- [ ] Add loading states and skeleton screens
- [ ] Offline support with data synchronization
- [ ] Performance optimization
- [ ] Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/zayeemZaki/ShareBite/issues)
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- React Native team for the excellent framework
- Open source community for various packages and tools
- Food banks and shelters for inspiring this project

---

**Made with ❤️ for reducing food waste and helping communities**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sharebite10/ShareBite.git
cd ShareBite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Platform-Specific Setup

#### Android Setup
1. **Install Android Studio** and follow the setup wizard
2. **Configure Android SDK**:
   - Open Android Studio
   - Go to `Tools` > `SDK Manager`
   - Install Android SDK Platform 35
   - Install Android SDK Build-Tools 35.0.0
3. **Set Environment Variables** (add to your `~/.bashrc` or `~/.zshrc`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
4. **Create or start an Android Virtual Device (AVD)**:
   - Open Android Studio
   - Go to `Tools` > `AVD Manager`
   - Create a new virtual device with API level 35

#### iOS Setup (macOS only)
1. **Install Xcode** from the Mac App Store
2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **Install CocoaPods dependencies**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

### 4. Verify Installation
Run the React Native doctor to check your setup:
```bash
npx react-native doctor
```

## 🏃‍♂️ Running the App

### Start Metro Server
First, start the Metro development server:
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

## 🧪 Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Starts the Metro development server |
| `npm run android` | Builds and runs the app on Android |
| `npm run ios` | Builds and runs the app on iOS |
| `npm test` | Runs the test suite |
| `npm run lint` | Runs ESLint to check code quality |

### Development Workflow

1. **Start Metro Server**: `npm start`
2. **Run on Device/Emulator**: `npm run android` or `npm run ios`
3. **Enable Hot Reload**: Changes to your code will automatically refresh the app
4. **Debug**: Shake device or press `Ctrl+M` (Windows) / `Cmd+M` (Mac) to open debug menu

### Project Structure

```
ShareBite/
├── App.tsx                 # Main app component
├── index.js               # App entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
├── __tests__/             # Test files
└── .github/               # GitHub workflows and templates
```

### Code Style & Quality

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting

Run linting:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint -- --fix
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Writing Tests
Tests are located in the `__tests__/` directory. We use Jest for testing.

Example test:
```typescript
import App from '../App';

test('App component exists', () => {
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
```

## 🚀 Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

### iOS
1. Open `ios/ShareBite.xcworkspace` in Xcode
2. Select your device or simulator
3. Choose `Product` > `Archive`
4. Follow the App Store submission process

## 🐛 Troubleshooting

### Common Issues

#### Metro Server Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

#### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Reset project
rm -rf node_modules
npm install
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
```

#### Component Registration Error
If you see "Component has not been registered" error:
- Check that the component name in `app.json` matches the one in `MainActivity.kt` (Android) or `AppDelegate.mm` (iOS)

### Getting Help

1. **Check the troubleshooting section above**
2. **Review React Native documentation**: https://reactnative.dev/docs/troubleshooting
3. **Check existing issues**: Search the repository's issues
4. **Create a new issue**: Include error messages, device info, and steps to reproduce

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Run linting**: `npm run lint`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Write TypeScript code with proper type definitions
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use meaningful commit messages

## 📋 Requirements

### System Requirements
- **Node.js**: v20 or higher
- **React Native**: 0.81.1
- **TypeScript**: 5.8.3+

### Supported Platforms
- **Android**: API level 24 (Android 7.0) and above
- **iOS**: iOS 12.0 and above

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- UI inspired by modern food sharing platforms
- Community-driven development

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue in the GitHub repository
- **Discussions**: Use GitHub Discussions for questions and ideas

---

**Happy coding! 🚀 Let's reduce food waste together!** 🌱

## Step 1: Start Metro

# ShareBite 🍽️

A React Native food sharing app that helps reduce food waste by connecting people who have extra food with those who need it.

## Features

- Browse available food near you
- Share your extra food with the community
- Dark mode support
- Clean, modern UI

## Getting Started

### Prerequisites

- Node.js (>= 20)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS, install CocoaPods dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Start the Metro bundler:
```bash
npm start
```

#### Run on Android:
```bash
npm run android
```

#### Run on iOS:
```bash
npm run ios
```

### Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
  components/     # Reusable UI components
  data/          # Mock data and types
__tests__/       # Test files
android/         # Android-specific code
ios/             # iOS-specific code
```

## Built With

- React Native 0.81.1
- TypeScript
- React 19.1.0

## License

This project is licensed under the MIT License - see the LICENSE file for details.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
