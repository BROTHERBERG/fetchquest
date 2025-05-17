import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { MessageCircle, Star } from 'lucide-react-native';
import { formatRelativeTime } from '@/utils/format';

interface TaskFeedbackProps {
  task: Task;
}

export const TaskFeedback = ({ task }: TaskFeedbackProps) => {
  if (!task.feedback) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MessageCircle size={20} color={colors.textSecondary} />
        <Text style={styles.title}>Quest Feedback</Text>
      </View>

      {task.feedback.rating && (
        <View style={styles.rating}>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              color={index < task.feedback!.rating! ? colors.warning : colors.border}
              fill={index < task.feedback!.rating! ? colors.warning : 'transparent'}
            />
          ))}
        </View>
      )}

      <Text style={styles.comment}>{task.feedback.comment}</Text>
      
      <Text style={styles.timestamp}>
        {formatRelativeTime(task.feedback.timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  comment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
