import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Platform } from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { categories } from '@/constants/categories';
import { MapPin } from 'lucide-react-native';

interface TaskMapMarkerProps {
  task: Task;
  onPress?: () => void;
  showLabel?: boolean;
  animated?: boolean;
}

export const TaskMapMarker = ({ 
  task, 
  onPress,
  showLabel = false,
  animated = false
}: TaskMapMarkerProps) => {
  // Don't use Animated on web
  if (Platform.OS === 'web') {
    const category = categories.find(c => c.id === task.category);
    
    return (
      <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.8}>
        <View 
          style={[
            styles.marker,
            { backgroundColor: category?.color || colors.primary }
          ]}
        >
          <MapPin size={16} color="white" />
          
          {/* Rarity indicator for high-value tasks */}
          {task.price >= 50 && (
            <View 
              style={[
                styles.rarityIndicator,
                { backgroundColor: task.price >= 100 ? colors.legendary || '#FFD700' : colors.epic || '#A335EE' }
              ]} 
            />
          )}
        </View>
        
        {showLabel && (
          <View style={styles.label}>
            <Text style={styles.labelText} numberOfLines={1}>
              {task.title}
            </Text>
            <Text style={styles.priceText}>
              ${task.price.toFixed(2)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  const category = categories.find(c => c.id === task.category);
  
  // Create animation value for scaling - only on native
  let Animated;
  let scaleAnim;
  let pulseAnim;
  
  if (Platform.OS !== 'web') {
    try {
      Animated = require('react-native').Animated;
      scaleAnim = useRef(new Animated.Value(0)).current;
      pulseAnim = useRef(new Animated.Value(0)).current;
      
      useEffect(() => {
        if (animated) {
          // Entry animation
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
          
          // Pulse animation
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
            ])
          ).start();
        } else {
          // If not animated, just set to full scale
          scaleAnim.setValue(1);
        }
      }, [animated]);
    } catch (error) {
      console.error('Error with animations:', error);
    }
  }
  
  // If we're on native and have animations set up
  if (Platform.OS !== 'web' && Animated) {
    // Interpolate pulse opacity
    const pulseOpacity = pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0],
    });
    
    return (
      <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.8}>
        {/* Pulse effect */}
        {animated && (
          <Animated.View 
            style={[
              styles.pulse, 
              { 
                opacity: pulseOpacity,
                transform: [{ scale: Animated.add(pulseAnim, 1) }],
                backgroundColor: task.isUrgent ? colors.error : (category?.color || colors.primary),
              }
            ]} 
          />
        )}
        
        <Animated.View 
          style={[
            styles.marker,
            { backgroundColor: category?.color || colors.primary },
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {category?.icon ? (
            <View style={styles.iconContainer}>
              <MapPin size={16} color="white" />
            </View>
          ) : (
            <MapPin size={16} color="white" />
          )}
          
          {/* Rarity indicator for high-value tasks */}
          {task.price >= 50 && (
            <View 
              style={[
                styles.rarityIndicator,
                { backgroundColor: task.price >= 100 ? colors.legendary || '#FFD700' : colors.epic || '#A335EE' }
              ]} 
            />
          )}
        </Animated.View>
        
        {showLabel && (
          <View style={styles.label}>
            <Text style={styles.labelText} numberOfLines={1}>
              {task.title}
            </Text>
            <Text style={styles.priceText}>
              ${task.price.toFixed(2)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  // Fallback for any other case
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.8}>
      <View 
        style={[
          styles.marker,
          { backgroundColor: category?.color || colors.primary }
        ]}
      >
        <MapPin size={16} color="white" />
        
        {/* Rarity indicator for high-value tasks */}
        {task.price >= 50 && (
          <View 
            style={[
              styles.rarityIndicator,
              { backgroundColor: task.price >= 100 ? colors.legendary || '#FFD700' : colors.epic || '#A335EE' }
            ]} 
          />
        )}
      </View>
      
      {showLabel && (
        <View style={styles.label}>
          <Text style={styles.labelText} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={styles.priceText}>
            ${task.price.toFixed(2)}
          </Text>
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
  pulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: 40,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 4,
    width: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  rarityIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white',
  },
});