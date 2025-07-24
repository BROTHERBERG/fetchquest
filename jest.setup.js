// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      FIREBASE_API_KEY: 'test-api-key',
      FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      FIREBASE_PROJECT_ID: 'test-project',
      FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
      FIREBASE_MESSAGING_SENDER_ID: '123456789',
      FIREBASE_APP_ID: 'test-app-id',
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Firebase
jest.mock('@/config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(() => jest.fn()),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
  db: {},
  storage: {},
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
  useFocusEffect: () => {},
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  Stack: () => null,
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
}));

// Mock specific React Native modules that cause issues
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
  watchKeys: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (platforms) => platforms.ios,
}));

// Mock Expo modules
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('lucide-react-native', () => ({
  CheckCircle: 'CheckCircle',
  Plus: 'Plus',
  Search: 'Search',
  MapPin: 'MapPin',
  Star: 'Star',
  Clock: 'Clock',
  User: 'User',
  Settings: 'Settings',
  MessageCircle: 'MessageCircle',
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};