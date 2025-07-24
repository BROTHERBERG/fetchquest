# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start Expo development server (with telemetry disabled)
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator  
- `npm run web` - Run web version

### Testing & Validation
- `npm test` - Run Jest tests
- `node scripts/test-critical-path.js` - Test critical user flows before TestFlight submission
- `npm run test-critical` - Same as above (alias)

### Build & Deployment
- `npm run prepare-testflight` - Run critical path tests and build for TestFlight
- `./scripts/build-testflight.sh` - Build and prepare for TestFlight submission
- `eas build --platform ios --profile testflight` - Manual EAS build for TestFlight
- `eas submit -p ios --latest` - Submit latest build to TestFlight

### Utility Scripts
- `npm run fix-codegen` - Fix code generation issues
- `node scripts/setup-maps-api.js` - Configure Google Maps API keys
- `node scripts/verify-maps-config.js` - Verify Maps configuration

## Architecture Overview

### Project Structure
- **Expo Router**: File-based routing with `app/` directory as root
- **React Native**: Cross-platform mobile app with iOS/Android/Web support
- **TypeScript**: Full TypeScript implementation with path aliases (`@/` maps to root)
- **State Management**: Zustand stores with AsyncStorage persistence
- **UI Framework**: Custom components with React Native Reanimated

### Key Stores (Zustand)
- `store/task-store.ts` - Task management, lifecycle (open → assigned → pending_verification → completed)
- User store expected at `store/user-store.ts` (referenced in critical path tests)

### Core Data Models
- **Task**: Central entity with status lifecycle, location, pricing, gamified elements (rarity, points)
- **UserProfile**: User data with leveling system, badges, ratings
- **Location**: Latitude/longitude with address string
- **Categories**: Task categorization system with colors and icons

### Firebase Integration
- Configuration in `app.config.ts` with environment variables
- Requires `.env` file with Firebase credentials:
  - `EXPO_PUBLIC_FIREBASE_API_KEY`
  - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
  - Additional Firebase config keys

### Maps Integration
- Google Maps with `react-native-maps` and clustering support
- API keys configured per platform in `app.config.ts`
- Environment variables: `EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY`, `EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY`
- Location permissions configured for background location access

### Build Configuration
- **EAS Build**: Multiple profiles (development, preview, testflight, managed)
- **iOS**: Uses static frameworks, medium resource class
- **New Architecture**: Disabled for stability (`RCT_NEW_ARCH_ENABLED=0`)
- **Memory**: Increased Node.js heap size for builds (`--max_old_space_size=8192`)

### Component Architecture
- Atomic design with reusable components in `components/`
- Task-specific components (TaskCard, TaskMarker, TaskDetailsModal)
- Map components (MapView, QuestMarker, CustomMapView)
- Form components organized in subdirectories (create-quest/, payment/)

### Development Setup Requirements
- Environment variables in `.env` file
- iOS: CocoaPods installation (`bundle install && bundle exec pod install`)
- EAS CLI for building and deployment
- Google Maps API keys for both platforms

### Critical Path Testing
The `scripts/test-critical-path.js` validates:
- Firebase configuration completeness
- Navigation setup (expo-router)
- Task store implementation
- User store with authentication methods
- Map integration and dependencies
- Image picker configuration
- Location services and permissions

### Mock Data
- Test data available in `mocks/` directory
- Tasks, users, messages, and reviews for development
- Categories and badges defined in `constants/`

## iOS Deployment Notes
- Bundle identifier: `com.fetchquest.app`
- Requires camera, photo library, and location permissions
- Background location and fetch modes enabled
- Static frameworks configuration for iOS builds