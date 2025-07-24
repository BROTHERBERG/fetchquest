import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import Constants from 'expo-constants';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', missingKeys);
    throw new Error(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}`);
  }
};

// Initialize Firebase
let app;
try {
  validateFirebaseConfig();
  
  // Initialize Firebase app if it hasn't been initialized yet
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Using existing Firebase app');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Development environment setup
if (__DEV__) {
  console.log('Development mode: Firebase services ready');
  
  // Note: Uncomment these lines if you want to use Firebase emulators in development
  // Make sure to start the emulators first with: firebase emulators:start
  
  // try {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectFirestoreEmulator(db, 'localhost', 8080);
  //   connectStorageEmulator(storage, 'localhost', 9199);
  //   console.log('Connected to Firebase emulators');
  // } catch (error) {
  //   console.log('Emulators not available, using production Firebase');
  // }
}

export { app, auth, db, storage };