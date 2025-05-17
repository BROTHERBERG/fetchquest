import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, Clock, Coins, AlertTriangle, Award } from 'lucide-react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { categories } from '@/constants/categories';
import { formatCurrency, formatRelativeTime } from '@/utils/format';
import { getUserById } from '@/mocks/users';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard = ({ task, compact = false }: TaskCardProps) => {
  const router = useRouter();
  const requester = getUserById(task.requesterId);
  const category = categories.find(c => c.id === task.category);
  
  const handlePress = () => {
    router.push(`/quests/${task.id}`);
  };
  
  return (
    <Pressable 
      style={[styles.container, compact && styles.compactContainer]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          {category && (
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              {React.createElement(category.icon, { 
                size: 16, 
                color: category.color,
              })}
            </View>
          )}
          <Text style={styles.categoryText}>{category?.name || 'Other'}</Text>
          
          {task.isUrgent && (
            <AlertTriangle size={14} color={colors.error} style={styles.urgentIcon} />
          )}
        </View>
      </View>
      
      <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
      
      {!compact && (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {task.location.address.split(',')[0]}
          </Text>
        </View>
        
        <View style={styles.timeContainer}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={styles.timeText}>
            {formatRelativeTime(task.createdAt)}
          </Text>
        </View>
      </View>
      
      <View style={styles.rewardsContainer}>
        <View style={styles.rewardsLeft}>
          {requester && (
            <View style={styles.requesterContainer}>
              <Image 
                source={{ uri: requester.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.requesterName}>{requester.name.split(' ')[0]}</Text>
            </View>
          )}
          
          <View style={styles.pointsContainer}>
            <Award size={14} color={colors.primary} />
            <Text style={styles.pointsText}>+{task.pointsReward} XP</Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Coins size={14} color="white" />
          <Text style={styles.priceText}>{formatCurrency(task.price)}</Text>
        </View>
      </View>
      
      <View style={[
        styles.statusIndicator, 
        { backgroundColor: getStatusColor(task.status) }
      ]} />
    </Pressable>
  );
};

const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'open':
      return colors.primary;
    case 'assigned':
      return colors.warning;
    case 'pending_verification':
      return colors.secondary;
    case 'completed':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.textTertiary;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  compactContainer: {
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  urgentIcon: {
    marginLeft: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rewardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requesterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  requesterName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
});