import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Message } from '@/types';
import { formatTime } from '@/utils/format';
import { useUserStore } from '@/store/user-store';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useUserStore();
  const isCurrentUser = user?.id === message.senderId;
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
  },
  otherUserBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textTertiary,
    marginHorizontal: 4,
  },
});