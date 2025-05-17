import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Marker } from 'react-native-maps';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { DollarSign } from 'lucide-react-native';

interface TaskMarkerProps {
  task: Task;
  onPress?: (task: Task) => void;
}

export const TaskMarker = ({ task, onPress }: TaskMarkerProps) => {
  const markerColor = task.isUrgent ? colors.error : colors.primary;
  
  return (
    <Marker
      coordinate={{
        latitude: task.location.latitude,
        longitude: task.location.longitude,
      }}
      onPress={() => onPress?.(task)}
    >
      <View style={[styles.markerContainer, { backgroundColor: markerColor }]}>
        <DollarSign size={16} color="white" />
        <Text style={styles.price}>${task.price}</Text>
      </View>
      <View style={[styles.triangle, { borderTopColor: markerColor }]} />
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  price: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
});
