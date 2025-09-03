# 📋 ShareBite Setup Guide

This guide will walk you through setting up the ShareBite development environment on your system.

## 🖥️ System Requirements

### Operating System Support
- **macOS**: 10.15 (Catalina) or later (recommended for iOS development)
- **Windows**: 10 version 1903 or later
- **Linux**: Ubuntu 18.04 LTS or later

### Hardware Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB free space (for SDKs, emulators, and dependencies)
- **Processor**: Intel i5 or equivalent

## 📦 Prerequisites Installation

### 1. Node.js and npm
```bash
# Install Node.js (version 20 or later)
# Download from https://nodejs.org/

# Verify installation
node --version  # Should be v20.x.x or later
npm --version   # Should be 10.x.x or later
```

### 2. Git
```bash
# macOS (if not already installed)
xcode-select --install

# Windows: Download from https://git-scm.com/
# Linux
sudo apt-get install git
```

### 3. Java Development Kit (JDK)

#### macOS:
```bash
# Install JDK 17 using Homebrew (recommended)
brew install openjdk@17

# Add to your shell profile (~/.zshrc or ~/.bash_profile)
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Reload your shell
source ~/.zshrc  # or source ~/.bash_profile
```

#### Windows:
1. Download JDK 17 from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
2. Install and add to system PATH
3. Set JAVA_HOME environment variable

#### Linux:
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### 4. Android Development Setup

#### Android Studio Installation
1. **Download Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Install** following the setup wizard
3. **Configure SDK**:
   - Open Android Studio
   - Go to `Tools` → `SDK Manager`
   - Install:
     - Android SDK Platform 35
     - Android SDK Build-Tools 35.0.0
     - Android SDK Command-line Tools
     - Android Emulator

#### Environment Variables
Add these to your shell profile:

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk  # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

**Windows:**
```cmd
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
PATH = %PATH%;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools
```

#### Create Android Virtual Device (AVD)
1. Open Android Studio
2. `Tools` → `AVD Manager`
3. `Create Virtual Device`
4. Choose a device (e.g., Pixel 7)
5. Select API Level 35 (Android 14)
6. Finish setup

### 5. iOS Development Setup (macOS only)

#### Xcode Installation
```bash
# Install from Mac App Store (free, but requires Apple ID)
# Or download from developer.apple.com (requires paid developer account)

# Install command line tools
xcode-select --install

# Accept license
sudo xcodebuild -license accept
```

#### CocoaPods Installation
```bash
# Install CocoaPods
sudo gem install cocoapods

# If you encounter permission issues, use:
# gem install --user-install cocoapods
# export PATH=$HOME/.gem/ruby/X.X.X/bin:$PATH
```

## 🚀 Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/zayeemZaki/ShareBite.git
cd ShareBite
```

### 2. Install Dependencies
```bash
# Install npm packages
npm install

# For iOS only (macOS users)
cd ios
pod install
cd ..
```

### 3. Verify Setup
```bash
# Run React Native doctor to check setup
npx react-native doctor
```

The doctor command should show ✅ for all components. If you see ❌ or ⚠️, address those issues before proceeding.

## 🔧 Development Environment

### VS Code Setup (Recommended)
Install these extensions:
- **React Native Tools**: Microsoft's official extension
- **ES7+ React/Redux/React-Native snippets**: Code snippets
- **TypeScript Importer**: Auto-import for TypeScript
- **Prettier**: Code formatting
- **ESLint**: Code linting

### Alternative IDEs
- **Android Studio**: Good for Android-specific development
- **WebStorm**: JetBrains IDE with React Native support
- **Vim/Neovim**: With appropriate plugins

## 🏃‍♂️ Running the App

### Start Development Server
```bash
# Start Metro bundler
npm start
```

### Android
```bash
# Start Android emulator (if not running)
$ANDROID_HOME/emulator/emulator -avd YOUR_AVD_NAME

# Run app on Android
npm run android
```

### iOS (macOS only)
```bash
# Run app on iOS Simulator
npm run ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"
```

## 🧪 Testing Setup

### Running Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Debugging

#### React Native Debugger
1. Download from [github.com/jhen0409/react-native-debugger](https://github.com/jhen0409/react-native-debugger)
2. Install and run
3. In app, open dev menu and select "Debug"

#### Chrome DevTools
1. In app dev menu, select "Debug"
2. Open Chrome and go to `chrome://inspect`
3. Click "Configure" and add `localhost:8081`

#### Flipper (Meta's debugging platform)
1. Download from [fbflipper.com](https://fbflipper.com/)
2. Install and connect to running app

## 🔧 Common Issues & Solutions

### Android Issues

#### JDK Version Problems
```bash
# Check Java version
java -version

# Should show version 17 or 18, not 23+
# If wrong version, reinstall correct JDK and update JAVA_HOME
```

#### Gradle Build Failures
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### SDK License Issues
```bash
# Accept all SDK licenses
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
```

### iOS Issues

#### CocoaPods Problems
```bash
cd ios
# Clean CocoaPods
pod deintegrate
pod repo update
pod install --repo-update
cd ..
```

#### Simulator Issues
```bash
# Reset iOS Simulator
# In Simulator: Device → Erase All Content and Settings

# Or from command line
xcrun simctl erase all
```

### Metro Bundler Issues

#### Port Conflicts
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or start on different port
npx react-native start --port 8082
```

#### Cache Issues
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clear npm cache
npm start -- --reset-cache

# Clear watchman cache (if installed)
watchman watch-del-all
```

### Network Issues

#### Proxy/Firewall
If behind corporate firewall:
```bash
# Set npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy https://proxy.company.com:8080

# For React Native
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=https://proxy.company.com:8080
```

## 📋 Verification Checklist

Before starting development, ensure:

- [ ] ✅ Node.js v20+ installed
- [ ] ✅ JDK 17-20 installed and JAVA_HOME set
- [ ] ✅ Android Studio installed with SDK 35
- [ ] ✅ Android emulator created and running
- [ ] ✅ For iOS: Xcode and CocoaPods installed
- [ ] ✅ `npx react-native doctor` shows all green checkmarks
- [ ] ✅ Repository cloned and dependencies installed
- [ ] ✅ App successfully runs on at least one platform

## 🎯 Next Steps

Once setup is complete:
1. **Run the app** on your preferred platform
2. **Test login** with demo credentials
3. **Explore the codebase** starting with `App.tsx`
4. **Make changes** and see hot reload in action
5. **Start developing** new features!

## 📞 Getting Help

### Resources
- **React Native Documentation**: [reactnative.dev](https://reactnative.dev/)
- **Troubleshooting Guide**: [reactnative.dev/docs/troubleshooting](https://reactnative.dev/docs/troubleshooting)
- **Community**: [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Still Having Issues?
1. Check the [main README](./README.md) troubleshooting section
2. Search existing [GitHub Issues](https://github.com/zayeemZaki/ShareBite/issues)
3. Create a new issue with:
   - Your operating system and version
   - Node.js and npm versions
   - Complete error message
   - Steps to reproduce

---

**Happy coding! 🚀 You're ready to contribute to ShareBite!**
