import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { User } from '@/types';
import { LevelBadge } from './LevelBadge';

interface UserAvatarProps {
  user: User;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showVerified?: boolean;
  showLevel?: boolean;
  onPress?: () => void;
}

export const UserAvatar = ({ 
  user, 
  size = 'medium', 
  showName = false,
  showVerified = false,
  showLevel = false,
  onPress
}: UserAvatarProps) => {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/profile/${user.id}`);
    }
  };
  
  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 64;
      case 'medium':
      default:
        return 48;
    }
  };
  
  const avatarSize = getSize();
  
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        {showVerified && user.isVerified && (
          <View style={styles.verifiedBadge}>
            <CheckCircle size={12} color={colors.primary} fill="white" />
          </View>
        )}
        
        {showLevel && (
          <View style={styles.levelBadgeContainer}>
            <LevelBadge 
              level={user.level} 
              size={size === 'large' ? 'medium' : 'small'} 
            />
          </View>
        )}
      </View>
      
      {showName && (
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelBadgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});