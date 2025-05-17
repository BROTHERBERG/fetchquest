import { 
  Award, 
  Star, 
  Heart, 
  Zap, 
  Trophy, 
  Shield, 
  Rocket, 
  Crown
} from 'lucide-react-native';
import { colors } from './colors';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  pointsRequired: number;
  tasksRequired?: number;
  specialRequirement?: string;
}

export const badges: Badge[] = [
  {
    id: 'first_task',
    name: 'First Steps',
    description: 'Completed your first task',
    icon: Award,
    color: colors.secondary,
    pointsRequired: 0,
    tasksRequired: 1
  },
  {
    id: 'helping_hand',
    name: 'Helping Hand',
    description: 'Completed 5 tasks',
    icon: Heart,
    color: '#FF6B6B',
    pointsRequired: 50,
    tasksRequired: 5
  },
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Earned 100 points',
    icon: Star,
    color: '#FFD700',
    pointsRequired: 100
  },
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Completed 15 tasks',
    icon: Zap,
    color: '#9C27B0',
    pointsRequired: 150,
    tasksRequired: 15
  },
  {
    id: 'super_helper',
    name: 'Super Helper',
    description: 'Completed 25 tasks',
    icon: Shield,
    color: '#3F51B5',
    pointsRequired: 250,
    tasksRequired: 25
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    description: 'Earned 500 points',
    icon: Trophy,
    color: '#FF9800',
    pointsRequired: 500
  },
  {
    id: 'local_legend',
    name: 'Local Legend',
    description: 'Completed 50 tasks and earned 1000 points',
    icon: Crown,
    color: '#F44336',
    pointsRequired: 1000,
    tasksRequired: 50
  },
  {
    id: 'neighborhood_hero',
    name: 'Neighborhood Hero',
    description: 'The ultimate helper with 100+ tasks',
    icon: Rocket,
    color: '#4CAF50',
    pointsRequired: 2000,
    tasksRequired: 100
  }
];

export const getNextBadge = (points: number, tasksCompleted: number): Badge | null => {
  const sortedBadges = [...badges].sort((a, b) => a.pointsRequired - b.pointsRequired);
  
  for (const badge of sortedBadges) {
    const hasPoints = points >= badge.pointsRequired;
    const hasTasks = !badge.tasksRequired || tasksCompleted >= badge.tasksRequired;
    
    if (!hasPoints || !hasTasks) {
      return badge;
    }
  }
  
  return null; // User has all badges
};

export const getUserBadges = (points: number, tasksCompleted: number): Badge[] => {
  return badges.filter(badge => {
    const hasPoints = points >= badge.pointsRequired;
    const hasTasks = !badge.tasksRequired || tasksCompleted >= badge.tasksRequired;
    
    return hasPoints && hasTasks;
  });
};