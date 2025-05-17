import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ban } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface BlockUserButtonProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  onBlock?: () => void;
}

export const BlockUserButton = ({ 
  userId, 
  size = 'medium',
  onBlock
}: BlockUserButtonProps) => {
  const [isBlocked, setIsBlocked] = useState(false);
  
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };
  
  const handlePress = () => {
    if (isBlocked) {
      Alert.alert(
        'Unblock User',
        'Are you sure you want to unblock this user?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Unblock', 
            onPress: () => {
              setIsBlocked(false);
              // In a real app, this would update the blocked users list
              Alert.alert('User Unblocked', 'You have unblocked this user.');
            } 
          }
        ]
      );
    } else {
      Alert.alert(
        'Block User',
        'Are you sure you want to block this user? You will no longer see their quests or messages.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Block', 
            style: 'destructive',
            onPress: () => {
              setIsBlocked(true);
              // In a real app, this would update the blocked users list
              Alert.alert('User Blocked', 'You have blocked this user.');
              if (onBlock) onBlock();
            } 
          }
        ]
      );
    }
  };
  
  return (
    <Pressable 
      style={styles.button}
      onPress={handlePress}
    >
      <Ban size={getIconSize()} color={isBlocked ? colors.error : colors.textSecondary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});