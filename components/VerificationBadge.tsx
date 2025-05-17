import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type VerificationStatus = 'verified' | 'pending' | 'unverified';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

export const VerificationBadge = ({ 
  status, 
  size = 'medium',
  onPress
}: VerificationBadgeProps) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { badge: 16, icon: 10, text: 10 };
      case 'large':
        return { badge: 28, icon: 18, text: 14 };
      case 'medium':
      default:
        return { badge: 22, icon: 14, text: 12 };
    }
  };
  
  const { badge: badgeSize, icon: iconSize, text: textSize } = getSize();
  
  const getBadgeInfo = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: colors.success,
          backgroundColor: colors.accentLight,
          text: 'Verified'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: colors.warning,
          backgroundColor: colors.secondaryLight,
          text: 'Pending'
        };
      case 'unverified':
      default:
        return {
          icon: Shield,
          color: colors.textTertiary,
          backgroundColor: colors.card,
          text: 'Verify'
        };
    }
  };
  
  const { icon: BadgeIcon, color, backgroundColor, text } = getBadgeInfo();
  
  const Badge = () => (
    <View style={[
      styles.badge,
      { backgroundColor, width: badgeSize, height: badgeSize }
    ]}>
      <BadgeIcon size={iconSize} color={color} />
    </View>
  );
  
  if (onPress) {
    return (
      <Pressable 
        style={styles.container}
        onPress={onPress}
      >
        <Badge />
        <Text style={[styles.text, { color, fontSize: textSize }]}>{text}</Text>
      </Pressable>
    );
  }
  
  return (
    <View style={styles.container}>
      <Badge />
      <Text style={[styles.text, { color, fontSize: textSize }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    marginLeft: 4,
  },
});