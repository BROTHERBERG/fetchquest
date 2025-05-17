declare module "*.png";

// Expo Router Types
declare module '@react-navigation/native' {
  export interface PathConfigMap {
    '/(tabs)': undefined;
    '/(tabs)/index': undefined;
    '/(tabs)/explore': { filter?: string };
    '/(tabs)/quests/[id]': { id: string };
    '/(tabs)/profile': undefined;
    '/(tabs)/notifications': undefined;
    '/(tabs)/filters': undefined;
    '/(tabs)/create-task': undefined;
    '/(tabs)/create-supply-run': undefined;
    '/(tabs)/supply-runs/[id]': { id: string };
    '/(tabs)/badges': undefined;
    '/(tabs)/earnings': undefined;
  }
}

// User types
interface User {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  rating: number;
  reviewCount: number;
  earnings: {
    available: number;
    pending: number;
  };
}
