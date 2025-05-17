export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  isDefault: boolean;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  email: string;
  tasksCompleted: number;
  tasksRequested: number;
  joinedDate: string;
  isVerified: boolean;
  points: number;
  badges: string[];
  level: number;
  earnings: number;
  pendingEarnings: number;
  transactions: any[];
  paymentMethods?: PaymentMethod[];
}