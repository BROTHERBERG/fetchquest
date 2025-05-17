import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { categories } from '@/constants/categories';
import { MapPin, Clock } from 'lucide-react-native';

interface QuestMarkerProps {
  task: Task;
  highlighted?: boolean;
  onPress?: () => void;
}

export const QuestMarker = ({ task, highlighted = false, onPress }: QuestMarkerProps) => {
  // Don't use Animated on web
  if (Platform.OS === 'web') {
    const category = categories.find(c => c.id === task.category);
    
    // Get rarity color based on task price
    const getRarityColor = () => {
      if (task.price >= 100) return colors.legendary || '#FFD700';
      if (task.price >= 50) return colors.epic || '#A335EE';
      if (task.price >= 25) return colors.rare || '#0070DD';
      if (task.price >= 10) return colors.uncommon || '#1EFF00';
      return colors.common || '#FFFFFF';
    };
    
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        <View
          style={[
            styles.markerContainer,
            {
              backgroundColor: category?.color || colors.primary,
            },
          ]}
        >
          <MapPin size={16} color="white" />
          
          {/* Urgent indicator */}
          {task.isUrgent && (
            <View style={styles.urgentIndicator}>
              <Clock size={8} color="white" />
            </View>
          )}
          
          {/* Rarity indicator */}
          <View 
            style={[
              styles.rarityIndicator,
              { backgroundColor: getRarityColor() }
            ]} 
          />
        </View>
        
        {/* Price tag for highlighted quests */}
        {highlighted && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${task.price}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  // For native platforms, we'll use a simpler implementation without animations
  // to avoid the bundling error
  const category = categories.find(c => c.id === task.category);
  
  // Get rarity color based on task price
  const getRarityColor = () => {
    if (task.price >= 100) return colors.legendary || '#FFD700';
    if (task.price >= 50) return colors.epic || '#A335EE';
    if (task.price >= 25) return colors.rare || '#0070DD';
    if (task.price >= 10) return colors.uncommon || '#1EFF00';
    return colors.common || '#FFFFFF';
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View
        style={[
          styles.markerContainer,
          {
            backgroundColor: category?.color || colors.primary,
            transform: highlighted ? [{ scale: 1.2 }] : [{ scale: 1 }],
          },
        ]}
      >
        {category?.icon ? (
          <View style={styles.iconContainer}>
            <MapPin size={16} color="white" />
          </View>
        ) : (
          <MapPin size={16} color="white" />
        )}
        
        {/* Urgent indicator */}
        {task.isUrgent && (
          <View style={styles.urgentIndicator}>
            <Clock size={8} color="white" />
          </View>
        )}
        
        {/* Rarity indicator */}
        <View 
          style={[
            styles.rarityIndicator,
            { backgroundColor: getRarityColor() }
          ]} 
        />
      </View>
      
      {/* Price tag for highlighted quests */}
      {highlighted && (
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${task.price}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  urgentIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  priceTag: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
});