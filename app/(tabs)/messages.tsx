console.log('💬 MessagesScreen loaded!');

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { EmptyState } from '@/components/EmptyState';
import { useMessageStore } from '@/store/message-store';
import { useUserStore } from '@/store/user-store';
import { getUserById } from '@/mocks/users';
import { getTaskById } from '@/mocks/tasks';
import { formatRelativeTime, truncateText } from '@/utils/format';
import { Conversation } from '@/types/conversation';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { conversations, getConversationsByUser } = useMessageStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const userConversations = user ? getConversationsByUser(user.id) : [];
  
  const handleConversationPress = (conversationId: string) => {
    router.push(`/conversation/${conversationId}`);
  };
  
  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const otherParticipantId = item.participants.find((id: string) => id !== user?.id);
    const otherUser = getUserById(otherParticipantId || '');
    const task = getTaskById(item.taskId);
    
    if (!otherUser || !task) return null;
    
    return (
      <Pressable 
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item.id)}
      >
        <Image 
          source={{ uri: otherUser.avatar }}
          style={styles.avatar}
        />
        
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{otherUser.name}</Text>
            <Text style={styles.timeText}>
              {formatRelativeTime(item.lastMessage.timestamp)}
            </Text>
          </View>
          
          <Text style={styles.taskTitle} numberOfLines={1}>
            Re: {task.title}
          </Text>
          
          <Text 
            style={[
              styles.messagePreview,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {truncateText(item.lastMessage.content, 50)}
          </Text>
        </View>
      </Pressable>
    );
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, would fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Messages' }} />
      
      {userConversations.length > 0 ? (
        <FlatList
          data={userConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      ) : (
        <EmptyState
          title="No messages yet"
          description="When you communicate with neighbors about tasks, your conversations will appear here."
          icon={<MessageSquare size={48} color={colors.textTertiary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timeText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  taskTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadMessage: {
    fontWeight: '500',
    color: colors.text,
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    left: 42,
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});