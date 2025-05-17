import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, PaymentMethod } from '@/types/user';
import { users } from '@/mocks/users';
import { calculateLevel } from '@/constants/rpg';
import { PLATFORM_FEE } from '@/hooks/use-stripe';

// Firebase imports
import { 
  auth, 
  db 
} from '@/config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  increment,
  arrayUnion
} from 'firebase/firestore';

interface UserState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth methods
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // User data methods
  updateUser: (updates: Partial<User>) => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  completeTask: () => Promise<void>;
  requestTask: () => Promise<void>;
  addEarnings: (amount: number, isPending: boolean) => Promise<void>;
  
  // Payment methods
  addPaymentMethod: (paymentMethod: PaymentMethod) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  
  // Firebase specific
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: users[0], // For demo purposes, start with a logged-in user
      firebaseUser: null,
      isLoggedIn: true, // For demo purposes
      isLoading: false,
      error: null,
      
      // Auth methods
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Update profile with name
          await updateProfile(firebaseUser, { displayName: name });
          
          // Create user document in Firestore
          const newUser: User = {
            id: firebaseUser.uid,
            name,
            avatar: '',
            rating: 0,
            reviewCount: 0,
            email,
            tasksCompleted: 0,
            tasksRequested: 0,
            joinedDate: new Date().toISOString(),
            isVerified: false,
            points: 0,
            badges: [],
            level: 1,
            earnings: 0,
            pendingEarnings: 0,
            transactions: [],
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          
          set({ 
            user: newUser, 
            firebaseUser, 
            isLoggedIn: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to register', 
            isLoading: false 
          });
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Fetch user data from Firestore
          await get().fetchUserData();
          
          set({ 
            firebaseUser, 
            isLoggedIn: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login', 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await signOut(auth);
          set({ 
            user: null, 
            firebaseUser: null, 
            isLoggedIn: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to logout', 
            isLoading: false 
          });
        }
      },
      
      fetchUserData: async () => {
        const { firebaseUser } = get();
        if (!firebaseUser) return;
        
        set({ isLoading: true, error: null });
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData, isLoading: false });
          } else {
            // User document doesn't exist, create it
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              avatar: firebaseUser.photoURL || '',
              rating: 0,
              reviewCount: 0,
              email: firebaseUser.email || '',
              tasksCompleted: 0,
              tasksRequested: 0,
              joinedDate: new Date().toISOString(),
              isVerified: false,
              points: 0,
              badges: [],
              level: 1,
              earnings: 0,
              pendingEarnings: 0,
              transactions: [],
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            set({ user: newUser, isLoading: false });
          }
        } catch (error) {
          console.error('Fetch user data error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user data', 
            isLoading: false 
          });
        }
      },
      
      updateUser: async (updates) => {
        const { user, firebaseUser } = get();
        if (!user || !firebaseUser) return;
        
        set({ isLoading: true, error: null });
        try {
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), updates);
          
          // Update display name if included in updates
          if (updates.name) {
            await updateProfile(firebaseUser, { displayName: updates.name });
          }
          
          // Update avatar if included in updates
          if (updates.avatar) {
            await updateProfile(firebaseUser, { photoURL: updates.avatar });
          }
          
          set({ 
            user: { ...user, ...updates }, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Update user error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update user', 
            isLoading: false 
          });
        }
      },
      
      addPoints: async (points) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          const newPoints = user.points + points;
          const newLevel = calculateLevel(newPoints);
          
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), {
            points: newPoints,
            level: newLevel
          });
          
          set({ 
            user: {
              ...user,
              points: newPoints,
              level: newLevel
            },
            isLoading: false 
          });
        } catch (error) {
          console.error('Add points error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add points', 
            isLoading: false 
          });
        }
      },
      
      completeTask: async () => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), {
            tasksCompleted: increment(1)
          });
          
          set({ 
            user: {
              ...user,
              tasksCompleted: user.tasksCompleted + 1
            },
            isLoading: false 
          });
        } catch (error) {
          console.error('Complete task error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to complete task', 
            isLoading: false 
          });
        }
      },
      
      requestTask: async () => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), {
            tasksRequested: increment(1)
          });
          
          set({ 
            user: {
              ...user,
              tasksRequested: user.tasksRequested + 1
            },
            isLoading: false 
          });
        } catch (error) {
          console.error('Request task error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to request task', 
            isLoading: false 
          });
        }
      },
      
      addEarnings: async (amount, isPending) => {
        const { user } = get();
        if (!user) return;
        
        // Apply platform fee to earnings
        const netAmount = amount - PLATFORM_FEE;
        
        set({ isLoading: true, error: null });
        try {
          if (isPending) {
            // Update Firestore document
            await updateDoc(doc(db, 'users', user.id), {
              pendingEarnings: user.pendingEarnings + netAmount
            });
            
            set({ 
              user: {
                ...user,
                pendingEarnings: user.pendingEarnings + netAmount
              },
              isLoading: false 
            });
          } else {
            // Update Firestore document
            await updateDoc(doc(db, 'users', user.id), {
              earnings: user.earnings + netAmount,
              pendingEarnings: user.pendingEarnings - netAmount
            });
            
            set({ 
              user: {
                ...user,
                earnings: user.earnings + netAmount,
                pendingEarnings: user.pendingEarnings - netAmount
              },
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Add earnings error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add earnings', 
            isLoading: false 
          });
        }
      },
      
      // Payment methods
      addPaymentMethod: async (paymentMethod) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          const existingPaymentMethods = user.paymentMethods || [];
          
          // If this is the first payment method, make it default
          if (existingPaymentMethods.length === 0) {
            paymentMethod.isDefault = true;
          }
          
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), {
            paymentMethods: arrayUnion(paymentMethod)
          });
          
          set({ 
            user: {
              ...user,
              paymentMethods: [...existingPaymentMethods, paymentMethod]
            },
            isLoading: false 
          });
        } catch (error) {
          console.error('Add payment method error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add payment method', 
            isLoading: false 
          });
        }
      },
      
      removePaymentMethod: async (paymentMethodId) => {
        const { user } = get();
        if (!user || !user.paymentMethods) return;
        
        set({ isLoading: true, error: null });
        try {
          const updatedPaymentMethods = user.paymentMethods.filter(
            pm => pm.id !== paymentMethodId
          );
          
          // If we removed the default payment method, make another one default
          if (
            user.paymentMethods.find(pm => pm.id === paymentMethodId)?.isDefault &&
            updatedPaymentMethods.length > 0
          ) {
            updatedPaymentMethods[0].isDefault = true;
          }
          
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), {
            paymentMethods: updatedPaymentMethods
          });
          
          set({ 
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            },
            isLoading: false 
          });
        } catch (error) {
          console.error('Remove payment method error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove payment method', 
            isLoading: false 
          });
        }
      },
      
      setDefaultPaymentMethod: async (paymentMethodId) => {
        const { user } = get();
        if (!user || !user.paymentMethods) return;
        
        set({ isLoading: true, error: null });
        try {
          const updatedPaymentMethods = user.paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === paymentMethodId
          }));
          
          // Update Firestore document
          await updateDoc(doc(db, 'users', user.id), {
            paymentMethods: updatedPaymentMethods
          });
          
          set({ 
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            },
            isLoading: false 
          });
        } catch (error) {
          console.error('Set default payment method error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to set default payment method', 
            isLoading: false 
          });
        }
      },
      
      getDefaultPaymentMethod: () => {
        const { user } = get();
        if (!user || !user.paymentMethods) return undefined;
        
        return user.paymentMethods.find(pm => pm.isDefault);
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn
      }),
    }
  )
);