// Mock Firebase functions first
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockUpdateProfile = jest.fn();

const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockIncrement = jest.fn();
const mockArrayUnion = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  updateProfile: mockUpdateProfile,
}));

jest.mock('firebase/firestore', () => ({
  doc: mockDoc,
  setDoc: mockSetDoc,
  getDoc: mockGetDoc,
  updateDoc: mockUpdateDoc,
  increment: mockIncrement,
  arrayUnion: mockArrayUnion,
}));

// Mock Firebase config
jest.mock('@/config/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// Mock platform fee
jest.mock('@/hooks/use-stripe', () => ({
  PLATFORM_FEE: 2.50,
}));

import { useUserStore } from '@/store/user-store';
import { User, PaymentMethod } from '@/types/user';

describe('UserStore', () => {
  beforeEach(() => {
    // Reset store state and mocks
    useUserStore.setState({
      user: null,
      firebaseUser: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
    });

    // Clear all mock function calls
    mockCreateUserWithEmailAndPassword.mockClear();
    mockSignInWithEmailAndPassword.mockClear();
    mockSignOut.mockClear();
    mockUpdateProfile.mockClear();
    mockDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetDoc.mockClear();
    mockUpdateDoc.mockClear();
    mockIncrement.mockClear();
    mockArrayUnion.mockClear();
  });

  describe('Authentication', () => {
    const testUser = {
      uid: 'test-user-1',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    describe('Registration', () => {
      it('should register a new user successfully', async () => {
        const mockUserCredential = { user: testUser };
        mockCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
        mockSetDoc.mockResolvedValue(undefined);

        const { register } = useUserStore.getState();
        await register('test@example.com', 'password123', 'Test User');

        const state = useUserStore.getState();
        expect(state.isLoggedIn).toBe(true);
        expect(state.user?.name).toBe('Test User');
        expect(state.user?.email).toBe('test@example.com');
        expect(state.firebaseUser).toBeDefined();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);

        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'password123'
        );
        expect(mockUpdateProfile).toHaveBeenCalledWith(
          testUser,
          { displayName: 'Test User' }
        );
        expect(mockSetDoc).toHaveBeenCalled();
      });

      it('should handle registration errors', async () => {
        const errorMessage = 'Email already in use';
        mockCreateUserWithEmailAndPassword.mockRejectedValue(
          new Error(errorMessage)
        );

        const { register } = useUserStore.getState();
        await register('test@example.com', 'password123', 'Test User');

        const state = useUserStore.getState();
        expect(state.isLoggedIn).toBe(false);
        expect(state.user).toBe(null);
        expect(state.error).toBe(errorMessage);
        expect(state.isLoading).toBe(false);
      });
    });

    describe('Login', () => {
      it('should login user successfully', async () => {
        const mockUserCredential = { user: testUser };
        mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential);
        
        // Mock fetchUserData
        const mockUserData = {
          id: testUser.uid,
          name: testUser.displayName,
          email: testUser.email,
          rating: 4.5,
          reviewCount: 10,
          tasksCompleted: 5,
          tasksRequested: 3,
          joinedDate: new Date().toISOString(),
          isVerified: true,
          points: 500,
          badges: [],
          level: 2,
          earnings: 150,
          pendingEarnings: 25,
          transactions: [],
        };

        mockGetDoc.mockResolvedValue({
          exists: () => true,
          data: () => mockUserData,
        });

        const { login } = useUserStore.getState();
        await login('test@example.com', 'password123');

        const state = useUserStore.getState();
        expect(state.isLoggedIn).toBe(true);
        expect(state.firebaseUser).toEqual(testUser);
        expect(state.user).toEqual(mockUserData);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);

        expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'password123'
        );
      });

      it('should handle login errors', async () => {
        const errorMessage = 'Invalid credentials';
        mockSignInWithEmailAndPassword.mockRejectedValue(
          new Error(errorMessage)
        );

        const { login } = useUserStore.getState();
        await login('test@example.com', 'wrongpassword');

        const state = useUserStore.getState();
        expect(state.isLoggedIn).toBe(false);
        expect(state.user).toBe(null);
        expect(state.error).toBe(errorMessage);
        expect(state.isLoading).toBe(false);
      });
    });

    describe('Logout', () => {
      it('should logout user successfully', async () => {
        // Set up logged in state
        useUserStore.setState({
          user: { id: 'test-user' } as User,
          firebaseUser: testUser as any,
          isLoggedIn: true,
        });

        mockSignOut.mockResolvedValue(undefined);

        const { logout } = useUserStore.getState();
        await logout();

        const state = useUserStore.getState();
        expect(state.isLoggedIn).toBe(false);
        expect(state.user).toBe(null);
        expect(state.firebaseUser).toBe(null);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(null);

        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  describe('User Data Management', () => {
    const mockUser: User = {
      id: 'test-user-1',
      name: 'Test User',
      avatar: '',
      rating: 4.5,
      reviewCount: 10,
      email: 'test@example.com',
      tasksCompleted: 5,
      tasksRequested: 3,
      joinedDate: new Date().toISOString(),
      isVerified: true,
      points: 500,
      badges: [],
      level: 2,
      earnings: 150,
      pendingEarnings: 25,
      transactions: [],
    };

    beforeEach(() => {
      useUserStore.setState({
        user: mockUser,
        firebaseUser: { uid: mockUser.id } as any,
        isLoggedIn: true,
      });
    });

    it('should update user profile', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockUpdateProfile.mockResolvedValue(undefined);

      const updates = { name: 'Updated Name', avatar: 'new-avatar.jpg' };
      const { updateUser } = useUserStore.getState();
      await updateUser(updates);

      const state = useUserStore.getState();
      expect(state.user?.name).toBe('Updated Name');
      expect(state.user?.avatar).toBe('new-avatar.jpg');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);

      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.anything(),
        { displayName: 'Updated Name', photoURL: 'new-avatar.jpg' }
      );
    });

    it('should add points and update level', async () => {
      const pointsToAdd = 300;
      mockUpdateDoc.mockResolvedValue(undefined);

      const { addPoints } = useUserStore.getState();
      await addPoints(pointsToAdd);

      const state = useUserStore.getState();
      expect(state.user?.points).toBe(mockUser.points + pointsToAdd);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);

      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          points: mockUser.points + pointsToAdd,
          level: expect.any(Number),
        })
      );
    });

    it('should complete a task', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockIncrement.mockReturnValue(1);

      const { completeTask } = useUserStore.getState();
      await completeTask();

      const state = useUserStore.getState();
      expect(state.user?.tasksCompleted).toBe(mockUser.tasksCompleted + 1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);

      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { tasksCompleted: 1 }
      );
    });

    it('should request a task', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockIncrement.mockReturnValue(1);

      const { requestTask } = useUserStore.getState();
      await requestTask();

      const state = useUserStore.getState();
      expect(state.user?.tasksRequested).toBe(mockUser.tasksRequested + 1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);

      expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { tasksRequested: 1 }
      );
    });

    it('should add pending earnings', async () => {
      const earningsAmount = 50;
      mockUpdateDoc.mockResolvedValue(undefined);

      const { addEarnings } = useUserStore.getState();
      await addEarnings(earningsAmount, true);

      const state = useUserStore.getState();
      // Earnings should be reduced by platform fee (2.50)
      expect(state.user?.pendingEarnings).toBe(mockUser.pendingEarnings + earningsAmount - 2.50);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should convert pending to confirmed earnings', async () => {
      const earningsAmount = 50;
      mockUpdateDoc.mockResolvedValue(undefined);

      const { addEarnings } = useUserStore.getState();
      await addEarnings(earningsAmount, false);

      const state = useUserStore.getState();
      const netAmount = earningsAmount - 2.50; // Platform fee
      expect(state.user?.earnings).toBe(mockUser.earnings + netAmount);
      expect(state.user?.pendingEarnings).toBe(mockUser.pendingEarnings - netAmount);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('Payment Methods', () => {
    const mockUser: User = {
      id: 'test-user-1',
      name: 'Test User',
      avatar: '',
      rating: 4.5,
      reviewCount: 10,
      email: 'test@example.com',
      tasksCompleted: 5,
      tasksRequested: 3,
      joinedDate: new Date().toISOString(),
      isVerified: true,
      points: 500,
      badges: [],
      level: 2,
      earnings: 150,
      pendingEarnings: 25,
      transactions: [],
      paymentMethods: [],
    };

    const mockPaymentMethod: PaymentMethod = {
      id: 'pm_test123',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: false,
    };

    beforeEach(() => {
      useUserStore.setState({
        user: mockUser,
        firebaseUser: { uid: mockUser.id } as any,
        isLoggedIn: true,
      });
    });

    it('should add first payment method as default', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      mockArrayUnion.mockReturnValue(mockPaymentMethod);

      const { addPaymentMethod } = useUserStore.getState();
      await addPaymentMethod(mockPaymentMethod);

      const state = useUserStore.getState();
      expect(state.user?.paymentMethods).toHaveLength(1);
      expect(state.user?.paymentMethods?.[0]?.isDefault).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should remove payment method', async () => {
      // Set up user with existing payment methods
      const existingPaymentMethods = [
        { ...mockPaymentMethod, id: 'pm_1', isDefault: true },
        { ...mockPaymentMethod, id: 'pm_2', isDefault: false },
      ];
      
      useUserStore.setState({
        user: { ...mockUser, paymentMethods: existingPaymentMethods },
        firebaseUser: { uid: mockUser.id } as any,
        isLoggedIn: true,
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const { removePaymentMethod } = useUserStore.getState();
      await removePaymentMethod('pm_2');

      const state = useUserStore.getState();
      expect(state.user?.paymentMethods).toHaveLength(1);
      expect(state.user?.paymentMethods?.[0]?.id).toBe('pm_1');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should set default payment method', async () => {
      // Set up user with multiple payment methods
      const existingPaymentMethods = [
        { ...mockPaymentMethod, id: 'pm_1', isDefault: true },
        { ...mockPaymentMethod, id: 'pm_2', isDefault: false },
      ];
      
      useUserStore.setState({
        user: { ...mockUser, paymentMethods: existingPaymentMethods },
        firebaseUser: { uid: mockUser.id } as any,
        isLoggedIn: true,
      });

      mockUpdateDoc.mockResolvedValue(undefined);

      const { setDefaultPaymentMethod } = useUserStore.getState();
      await setDefaultPaymentMethod('pm_2');

      const state = useUserStore.getState();
      const defaultMethod = state.user?.paymentMethods?.find(pm => pm.isDefault);
      const nonDefaultMethod = state.user?.paymentMethods?.find(pm => !pm.isDefault);
      
      expect(defaultMethod?.id).toBe('pm_2');
      expect(nonDefaultMethod?.id).toBe('pm_1');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should get default payment method', () => {
      const existingPaymentMethods = [
        { ...mockPaymentMethod, id: 'pm_1', isDefault: false },
        { ...mockPaymentMethod, id: 'pm_2', isDefault: true },
      ];
      
      useUserStore.setState({
        user: { ...mockUser, paymentMethods: existingPaymentMethods },
      });

      const { getDefaultPaymentMethod } = useUserStore.getState();
      const defaultMethod = getDefaultPaymentMethod();

      expect(defaultMethod?.id).toBe('pm_2');
      expect(defaultMethod?.isDefault).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle updateUser errors', async () => {
      const mockUser = { id: 'test-user', name: 'Test' } as User;
      useUserStore.setState({
        user: mockUser,
        firebaseUser: { uid: mockUser.id } as any,
        isLoggedIn: true,
      });

      const errorMessage = 'Update failed';
      mockUpdateDoc.mockRejectedValue(new Error(errorMessage));

      const { updateUser } = useUserStore.getState();
      await updateUser({ name: 'New Name' });

      const state = useUserStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should handle operations when user is not logged in', async () => {
      useUserStore.setState({
        user: null,
        firebaseUser: null,
        isLoggedIn: false,
      });

      const { addPoints } = useUserStore.getState();
      await addPoints(100);

      // Should not throw error, just return early
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });
  });
});