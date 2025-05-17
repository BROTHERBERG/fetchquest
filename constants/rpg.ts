// RPG-themed constants for the app

// Quest rarity levels with enhanced properties
export const questRarity = {
  common: {
    name: 'Common',
    color: '#7E8C8D', // Gray
    multiplier: 1,
    xpBonus: 0,
    minPrice: 0,
    maxPrice: 20,
    dropRate: 0.5, // 50% chance of additional reward
    description: 'A simple task that anyone can handle'
  },
  uncommon: {
    name: 'Uncommon',
    color: '#2ECC71', // Green
    multiplier: 1.5,
    xpBonus: 5,
    minPrice: 20,
    maxPrice: 40,
    dropRate: 0.35,
    description: 'A task requiring some skill or effort'
  },
  rare: {
    name: 'Rare',
    color: '#3498DB', // Blue
    multiplier: 2,
    xpBonus: 10,
    minPrice: 40,
    maxPrice: 60,
    dropRate: 0.15,
    description: 'A challenging task with good rewards'
  },
  epic: {
    name: 'Epic',
    color: '#9B59B6', // Purple
    multiplier: 3,
    xpBonus: 20,
    minPrice: 60,
    maxPrice: 100,
    dropRate: 0.08,
    description: 'A difficult task with excellent rewards'
  },
  legendary: {
    name: 'Legendary',
    color: '#F1C40F', // Gold
    multiplier: 5,
    xpBonus: 50,
    minPrice: 100,
    maxPrice: Infinity,
    dropRate: 0.02,
    description: 'An extraordinary task with amazing rewards'
  }
};

// Character classes with enhanced properties
export const characterClasses = {
  warrior: {
    name: 'Warrior',
    description: 'Specializes in physical tasks and heavy lifting',
    icon: 'Sword',
    color: '#E74C3C',
    bonuses: {
      strength: 2,
      endurance: 1.5,
      agility: 0.8,
      intelligence: 0.7
    },
    preferredTasks: ['moving', 'construction', 'repair', 'heavy_lifting'],
    specialAbility: 'Power Lift: Can handle heavier items with less strain'
  },
  mage: {
    name: 'Mage',
    description: 'Specializes in technical and knowledge-based tasks',
    icon: 'Sparkles',
    color: '#3498DB',
    bonuses: {
      intelligence: 2,
      wisdom: 1.5,
      strength: 0.7,
      agility: 0.8
    },
    preferredTasks: ['technology', 'teaching', 'research', 'problem_solving'],
    specialAbility: 'Tech Mastery: Faster completion of technical tasks'
  },
  rogue: {
    name: 'Rogue',
    description: 'Specializes in quick errands and delivery tasks',
    icon: 'Wind',
    color: '#2ECC71',
    bonuses: {
      agility: 2,
      speed: 1.5,
      strength: 0.9,
      endurance: 1
    },
    preferredTasks: ['delivery', 'shopping', 'quick_errands', 'time_sensitive'],
    specialAbility: 'Swift Movement: Reduced travel time between locations'
  },
  cleric: {
    name: 'Cleric',
    description: 'Specializes in helping and care-related tasks',
    icon: 'Heart',
    color: '#9B59B6',
    bonuses: {
      wisdom: 2,
      charisma: 1.5,
      intelligence: 1,
      endurance: 0.9
    },
    preferredTasks: ['caregiving', 'pet_care', 'teaching', 'organization'],
    specialAbility: 'Empathy: Higher satisfaction ratings from task requesters'
  }
};

// Level thresholds with enhanced rewards
export const levelThresholds = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1350,   // Level 7
  1750,   // Level 8
  2200,   // Level 9
  2700,   // Level 10
  3300,   // Level 11
  4000,   // Level 12
  4800,   // Level 13
  5700,   // Level 14
  6700,   // Level 15
  7800,   // Level 16
  9000,   // Level 17
  10300,  // Level 18
  11700,  // Level 19
  13200,  // Level 20
];

// Calculate level based on XP
export const calculateLevel = (xp: number): number => {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (xp >= levelThresholds[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Calculate XP needed for next level
export const getPointsForNextLevel = (currentPoints: number): number => {
  const currentLevel = calculateLevel(currentPoints);
  if (currentLevel >= levelThresholds.length) {
    return -1; // Max level reached
  }
  return levelThresholds[currentLevel] - currentPoints;
};

// Calculate progress to next level (0-100)
export const getLevelProgress = (points: number): number => {
  const currentLevel = calculateLevel(points);
  if (currentLevel >= levelThresholds.length) {
    return 100; // Max level reached
  }
  
  const currentLevelPoints = levelThresholds[currentLevel - 1];
  const nextLevelPoints = levelThresholds[currentLevel];
  const pointsInCurrentLevel = points - currentLevelPoints;
  const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
  
  return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
};

// Calculate quest rarity based on multiple factors
export const calculateQuestRarity = (
  price: number,
  isUrgent: boolean,
  complexity: number = 1,
  timeRequired: number = 1
): keyof typeof questRarity => {
  const baseScore = price + 
    (isUrgent ? 20 : 0) + 
    (complexity * 10) + 
    (timeRequired * 5);
  
  if (baseScore >= 100) {
    return 'legendary';
  } else if (baseScore >= 60) {
    return 'epic';
  } else if (baseScore >= 40) {
    return 'rare';
  } else if (baseScore >= 20) {
    return 'uncommon';
  } else {
    return 'common';
  }
};

// Calculate rewards for completing a quest
export const calculateQuestRewards = (
  basePoints: number,
  rarity: keyof typeof questRarity,
  playerLevel: number,
  playerClass: keyof typeof characterClasses,
  taskType: string
): {
  points: number;
  bonusPoints: number;
  coinReward: number;
  experienceBonus: number;
} => {
  const rarityMultiplier = questRarity[rarity].multiplier;
  const bonusPoints = questRarity[rarity].xpBonus;
  
  // Higher level players get diminishing returns on low-level quests
  const levelScaling = Math.max(0.5, 1 - (playerLevel - calculateLevel(basePoints)) * 0.1);
  
  // Class bonus for preferred tasks
  const classBonus = characterClasses[playerClass].preferredTasks.includes(taskType) ? 1.2 : 1;
  
  const points = Math.round(basePoints * rarityMultiplier * levelScaling * classBonus);
  const coinReward = Math.round(points * 0.1 * rarityMultiplier);
  const experienceBonus = Math.round(bonusPoints * classBonus);

  return {
    points,
    bonusPoints: experienceBonus,
    coinReward,
    experienceBonus: Math.round(points * 0.1)
  };
};

// Achievement system
export const achievements = {
  taskMaster: {
    name: 'Task Master',
    description: 'Complete 100 tasks',
    requirement: 100,
    reward: 500,
    icon: 'Trophy'
  },
  speedDemon: {
    name: 'Speed Demon',
    description: 'Complete 10 urgent tasks',
    requirement: 10,
    reward: 200,
    icon: 'Zap'
  },
  perfectScore: {
    name: 'Perfect Score',
    description: 'Maintain a 5-star rating for 30 days',
    requirement: 30,
    reward: 1000,
    icon: 'Star'
  }
};

// Reputation system
export const reputationLevels = {
  novice: {
    name: 'Novice',
    minRating: 0,
    maxRating: 3.9,
    color: '#95A5A6'
  },
  trusted: {
    name: 'Trusted',
    minRating: 4.0,
    maxRating: 4.4,
    color: '#2ECC71'
  },
  expert: {
    name: 'Expert',
    minRating: 4.5,
    maxRating: 4.7,
    color: '#3498DB'
  },
  master: {
    name: 'Master',
    minRating: 4.8,
    maxRating: 4.9,
    color: '#9B59B6'
  },
  legendary: {
    name: 'Legendary',
    minRating: 5.0,
    maxRating: 5.0,
    color: '#F1C40F'
  }
};

export const calculateReputation = (rating: number): keyof typeof reputationLevels => {
  if (rating >= 5.0) return 'legendary';
  if (rating >= 4.8) return 'master';
  if (rating >= 4.5) return 'expert';
  if (rating >= 4.0) return 'trusted';
  return 'novice';
};