import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  showPercentage?: boolean;
  label?: string;
  style?: any;
}

export const ProgressBar = ({
  progress,
  height = 8,
  backgroundColor = colors.border,
  fillColor = colors.primary,
  showPercentage = false,
  label,
  style
}: ProgressBarProps) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{percentage}%</Text>
          )}
        </View>
      )}
      
      <View style={[styles.track, { height, backgroundColor }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${percentage}%`,
              backgroundColor: fillColor,
              height
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  fill: {
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});