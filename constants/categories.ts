import { 
  ShoppingCart, 
  Package, 
  Home, 
  Wrench, 
  Car, 
  Utensils, 
  Dog, 
  Briefcase, 
  Truck, 
  Leaf 
} from 'lucide-react-native';

export const categories = [
  {
    id: 'grocery',
    name: 'Grocery',
    icon: ShoppingCart,
    color: '#4A80F0',
  },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: Package,
    color: '#5AC8FA',
  },
  {
    id: 'housework',
    name: 'Housework',
    icon: Home,
    color: '#5FD068',
  },
  {
    id: 'repairs',
    name: 'Repairs',
    icon: Wrench,
    color: '#FF9500',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: Car,
    color: '#FF3B30',
  },
  {
    id: 'food',
    name: 'Food',
    icon: Utensils,
    color: '#AF52DE',
  },
  {
    id: 'petcare',
    name: 'Pet Care',
    icon: Dog,
    color: '#FF2D55',
  },
  {
    id: 'errands',
    name: 'Errands',
    icon: Briefcase,
    color: '#34C759',
  },
  {
    id: 'moving',
    name: 'Moving',
    icon: Truck,
    color: '#007AFF',
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: Leaf,
    color: '#8BC34A',
  },
];