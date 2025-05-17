import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { MapPin, Clock, Award } from 'lucide-react-native';
import { categories } from '@/constants/categories';

interface TaskMapCalloutProps {
  task: Task;
}

export const TaskMapCallout = ({ task }: TaskMapCalloutProps) => {
  const category = categories.find(c => c.id === task.category);
  
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
          {task.isUrgent && (
            <View style={styles.urgentBadge}>
              <Clock size={10} color="white" />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MapPin size={12} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {task.location.address}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Award size={12} color={colors.primary} />
            <Text style={styles.rewardText}>
              {task.pointsReward} XP
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={[styles.categoryBadge, { backgroundColor: category?.color || colors.primary }]}>
            {category?.icon && React.createElement(category.icon, { size: 12, color: 'white' })}
            <Text style={styles.categoryText}>{category?.name || 'General'}</Text>
          </View>
          
          <Text style={styles.price}>${task.price.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.arrowBorder} />
      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
    marginLeft: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  rewardText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: colors.card,
    borderWidth: 10,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: colors.border,
    borderWidth: 10,
    alignSelf: 'center',
    marginTop: -0.5,
  },
});