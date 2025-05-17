import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Task } from '@/types';
import { UserAvatar } from './UserAvatar';

interface QuestCardProps {
  quest: Task;
  onPress: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {quest.title}
          </Text>
          {quest.isUrgent && <View style={styles.urgentBadge}><Text style={styles.urgentText}>Urgent</Text></View>}
        </View>
        <Text style={styles.reward}>${quest.price}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {quest.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <MapPin size={12} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {quest.location.address}
          </Text>
        </View>

        <View style={styles.timeContainer}>
          <Clock size={12} color={colors.textSecondary} />
          <Text style={styles.timeText}>{quest.dueDate ? new Date(quest.dueDate).toLocaleDateString() : 'No deadline'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  urgentBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  reward: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
});
