# 🍽️ ShareBite - Food Sharing React Native App

ShareBite is a cross-platform mobile application built with React Native that helps reduce food waste by connecting people who have excess food with those who need it. The app promotes community sharing and environmental sustainability.

## 📱 Features

- **🏠 Browse Food**: Discover available food items shared by community members
- **🍽️ Share Food**: Post your excess food for others to claim
- **📍 Location-Aware**: Find food near your location
- **🌓 Dark Mode**: Automatic light/dark theme support
- **📱 Cross-Platform**: Works seamlessly on Android and iOS
- **⚡ Fast Performance**: Optimized with TypeScript and modern React Native

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control

### Platform-Specific Requirements

#### Android Development
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Android SDK** (API level 35 or higher)
- **Java Development Kit (JDK)** 17 or higher
- **Android Emulator** or physical Android device

#### iOS Development (macOS only)
- **Xcode** 14 or higher - [Download from Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **iOS Simulator** or physical iOS device
- **CocoaPods** - Install with: `sudo gem install cocoapods`

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ShareBite.git
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

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

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
