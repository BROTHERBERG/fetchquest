import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface RatingProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  showEmpty?: boolean;
}

export const Rating = ({ value, size = 'medium', showEmpty = true }: RatingProps) => {
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 18;
    }
  };
  
  const starSize = getStarSize();
  const totalStars = 5;
  
  return (
    <View style={styles.container}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const isFilled = index < Math.floor(value);
        const isHalfFilled = !isFilled && index < Math.ceil(value) && value % 1 !== 0;
        
        if (!isFilled && !isHalfFilled && !showEmpty) {
          return null;
        }
        
        return (
          <Star
            key={index}
            size={starSize}
            color={colors.warning}
            fill={isFilled ? colors.warning : 'transparent'}
            strokeWidth={1.5}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});