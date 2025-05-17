import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

type LevelBadgeSize = 'small' | 'medium' | 'large';

interface LevelBadgeProps {
  level: number;
  size?: LevelBadgeSize;
  style?: any;
}

export const LevelBadge = ({ level, size = 'medium', style }: LevelBadgeProps) => {
  const badgeSize = getBadgeSize(size);
  const fontSize = getFontSize(size);
  
  return (
    <View 
      style={[
        styles.badge, 
        { 
          width: badgeSize, 
          height: badgeSize, 
          borderRadius: badgeSize / 2 
        },
        style
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{level}</Text>
    </View>
  );
};

const getBadgeSize = (size: LevelBadgeSize): number => {
  switch (size) {
    case 'small':
      return 32;
    case 'medium':
      return 40;
    case 'large':
      return 56;
    default:
      return 40;
  }
};

const getFontSize = (size: LevelBadgeSize): number => {
  switch (size) {
    case 'small':
      return 14;
    case 'medium':
      return 18;
    case 'large':
      return 24;
    default:
      return 18;
  }
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: '800',
  },
});