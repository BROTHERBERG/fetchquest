import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { TaskStatus } from '@/types';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge = ({ status, size = 'medium' }: StatusBadgeProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'open':
        return {
          label: 'Open',
          color: colors.primary,
          backgroundColor: colors.primaryLight,
        };
      case 'assigned':
        return {
          label: 'Assigned',
          color: colors.warning,
          backgroundColor: '#FFF8E1',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          color: colors.secondary,
          backgroundColor: '#E1F5FE',
        };
      case 'completed':
        return {
          label: 'Completed',
          color: colors.success,
          backgroundColor: colors.successLight,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: colors.error,
          backgroundColor: colors.errorLight,
        };
      default:
        return {
          label: 'Unknown',
          color: colors.textTertiary,
          backgroundColor: colors.card,
        };
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      case 'medium':
      default:
        return 12;
    }
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 2, paddingHorizontal: 6 };
      case 'large':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'medium':
      default:
        return { paddingVertical: 4, paddingHorizontal: 8 };
    }
  };
  
  const { label, color, backgroundColor } = getStatusInfo();
  const fontSize = getFontSize();
  const padding = getPadding();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor, ...padding },
    ]}>
      <Text style={[
        styles.text,
        { color, fontSize },
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});