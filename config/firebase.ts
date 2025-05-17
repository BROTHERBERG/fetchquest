// Using Expo Firebase packages instead of direct Firebase SDK
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase implementation for development
const mockFirebase = {
  app: {},
  auth: {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Mock implementation
      return () => {};
    },
    signInWithEmailAndPassword: async (email, password) => {
      // Mock implementation
      return { user: { uid: 'mock-user-id', email } };
    },
    createUserWithEmailAndPassword: async (email, password) => {
      // Mock implementation
      return { user: { uid: 'mock-user-id', email } };
    },
    signOut: async () => {
      // Mock implementation
    }
  },
  db: {
    collection: (name) => ({
      doc: (id) => ({
        get: async () => ({
          exists: true,
          data: () => ({}),
          id
        }),
        set: async (data) => {},
        update: async (data) => {},
        delete: async () => {}
      }),
      add: async (data) => ({ id: 'mock-doc-id' }),
      where: () => ({
        get: async () => ({
          docs: []
        })
      })
    })
  },
  storage: {
    ref: (path) => ({
      put: async (file) => ({
        ref: {
          getDownloadURL: async () => 'https://example.com/image.jpg'
        }
      }),
      getDownloadURL: async () => 'https://example.com/image.jpg'
    })
  }
};

// Export mock Firebase for development
export const app = mockFirebase.app;
export const auth = mockFirebase.auth;
export const db = mockFirebase.db;
export const storage = mockFirebase.storage;

// Add a comment to indicate this is a mock implementation
console.log('Using mock Firebase implementation for development');