import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Badge } from '@/constants/badges';

interface BadgeIconProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onPress?: () => void;
  locked?: boolean;
}

export const BadgeIcon = ({ 
  badge, 
  size = 'medium', 
  showName = false,
  onPress,
  locked = false
}: BadgeIconProps) => {
  const BadgeIconComponent = badge.icon;
  
  const getSize = () => {
    switch (size) {
      case 'small':
        return { container: 32, icon: 16 };
      case 'large':
        return { container: 64, icon: 32 };
      case 'medium':
      default:
        return { container: 48, icon: 24 };
    }
  };
  
  const { container: containerSize, icon: iconSize } = getSize();
  
  return (
    <Pressable 
      style={styles.wrapper} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View 
        style={[
          styles.container, 
          { 
            width: containerSize, 
            height: containerSize,
            backgroundColor: locked ? colors.card : `${badge.color}20`,
            borderColor: locked ? colors.border : badge.color,
          }
        ]}
      >
        <BadgeIconComponent 
          size={iconSize} 
          color={locked ? colors.textTertiary : badge.color} 
        />
        
        {locked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedText}>🔒</Text>
          </View>
        )}
      </View>
      
      {showName && (
        <Text 
          style={[
            styles.name,
            locked && styles.lockedName
          ]}
          numberOfLines={1}
        >
          {badge.name}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  name: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  lockedName: {
    color: colors.textTertiary,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 14,
  },
});