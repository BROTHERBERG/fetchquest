import { User, PaymentMethod } from '@/types/user';
import { characterClasses } from '@/constants/rpg';

// Mock payment methods for demo
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'card',
    last4: '5555',
    brand: 'mastercard',
    expiryMonth: 10,
    expiryYear: 2024,
    isDefault: false
  }
];

export const users: User[] = [
  {
    id: 'user1',
    name: 'Alex Knight',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
    rating: 4.8,
    reviewCount: 24,
    email: 'alex@example.com',
    tasksCompleted: 32,
    tasksRequested: 12,
    joinedDate: '2022-03-15T00:00:00.000Z',
    isVerified: true,
    points: 1750,
    badges: ['quick_responder', 'top_helper', 'verified'],
    level: 8,
    earnings: 1250.75,
    pendingEarnings: 150.00,
    transactions: ['txn_1', 'txn_2', 'txn_3'],
    paymentMethods: mockPaymentMethods
  },
  {
    id: 'user2',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
    rating: 4.9,
    reviewCount: 36,
    email: 'sophia@example.com',
    tasksCompleted: 48,
    tasksRequested: 8,
    joinedDate: '2021-11-20T00:00:00.000Z',
    isVerified: true,
    points: 2400,
    badges: ['quick_responder', 'top_helper', 'verified', 'tech_expert'],
    level: 10,
    earnings: 2150.50,
    pendingEarnings: 0,
    transactions: ['txn_4', 'txn_5', 'txn_6', 'txn_7'],
    paymentMethods: [mockPaymentMethods[0]]
  },
  {
    id: 'user3',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
    rating: 4.6,
    reviewCount: 18,
    email: 'marcus@example.com',
    tasksCompleted: 26,
    tasksRequested: 4,
    joinedDate: '2022-06-10T00:00:00.000Z',
    isVerified: false,
    points: 1200,
    badges: ['quick_responder', 'delivery_expert'],
    level: 6,
    earnings: 850.25,
    pendingEarnings: 75.00,
    transactions: ['txn_8', 'txn_9'],
    paymentMethods: []
  },
  {
    id: 'user4',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
    rating: 4.7,
    reviewCount: 29,
    email: 'emma@example.com',
    tasksCompleted: 42,
    tasksRequested: 15,
    joinedDate: '2021-09-05T00:00:00.000Z',
    isVerified: true,
    points: 2100,
    badges: ['verified', 'top_helper', 'pet_friendly'],
    level: 9,
    earnings: 1875.00,
    pendingEarnings: 120.00,
    transactions: ['txn_10', 'txn_11', 'txn_12'],
    paymentMethods: [mockPaymentMethods[1]]
  },
  {
    id: 'user5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
    rating: 4.5,
    reviewCount: 15,
    email: 'david@example.com',
    tasksCompleted: 20,
    tasksRequested: 3,
    joinedDate: '2022-08-22T00:00:00.000Z',
    isVerified: false,
    points: 950,
    badges: ['handyman_expert'],
    level: 5,
    earnings: 625.50,
    pendingEarnings: 0,
    transactions: ['txn_13', 'txn_14'],
    paymentMethods: []
  }
];

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper function to get user's character class based on completed tasks
export const getUserClass = (user: User): keyof typeof characterClasses => {
  const taskTypes = user.badges;
  
  if (taskTypes.includes('handyman_expert') || taskTypes.includes('heavy_lifter')) {
    return 'warrior';
  }
  if (taskTypes.includes('tech_expert') || taskTypes.includes('problem_solver')) {
    return 'mage';
  }
  if (taskTypes.includes('delivery_expert') || taskTypes.includes('quick_responder')) {
    return 'rogue';
  }
  if (taskTypes.includes('pet_friendly') || taskTypes.includes('caregiver')) {
    return 'cleric';
  }
  
  // Default to warrior if no specific class indicators
  return 'warrior';
};

// Helper function to get formatted user stats
export const getUserStats = (user: User) => {
  return {
    completionRate: ((user.tasksCompleted / (user.tasksCompleted + user.tasksRequested)) * 100).toFixed(1),
    averageRating: user.rating.toFixed(1),
    totalEarnings: (user.earnings + user.pendingEarnings).toFixed(2),
    membershipDuration: Math.floor((Date.now() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
  };
};