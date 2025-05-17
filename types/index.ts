export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: Location;
  status: 'open' | 'assigned' | 'pending_verification' | 'completed' | 'cancelled';
  requesterId: string;
  assigneeId?: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  isUrgent: boolean;
  pointsReward: number;
  images?: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  feedback?: {
    comment: string;
    rating?: number;
    timestamp: Date;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  rating: number;
  level: number;
  xp: number;
  badges: string[];
  completedTasks?: number;
  isVerified: boolean;
  joinedAt: Date;
  lastActive?: Date;
}

export interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredLevel?: number;
  requiredTasks?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  taskId: string;
  amount: number;
  fee: number;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplyRun {
  id: string;
  title: string;
  description: string;
  store: string;
  location: Location;
  creatorId: string;
  status: 'active' | 'completed' | 'cancelled';
  participants: string[];
  createdAt: Date;
  expiresAt: Date;
  items: SupplyRunItem[];
}

export interface SupplyRunItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  requesterId: string;
  isPurchased: boolean;
}