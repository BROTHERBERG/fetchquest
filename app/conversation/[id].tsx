import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Send, ArrowLeft, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MessageBubble } from '@/components/MessageBubble';
import { useMessageStore } from '@/store/message-store';
import { useUserStore } from '@/store/user-store';
import { getUserById } from '@/mocks/users';
import { getTaskById } from '@/mocks/tasks';
import { ReportButton } from '@/components/ReportButton';
import { BlockUserButton } from '@/components/BlockUserButton';
import { Conversation, Message, User } from '@/types';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUserStore();
  const { 
    getMessagesByConversation, 
    addMessage, 
    markConversationAsRead,
    conversations
  } = useMessageStore();
  
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const conversation = conversations.find(c => c.id === id) as Conversation | undefined;
  
  if (!conversation || !user) {
    return (
      <View style={styles.container}>
        <Text>Conversation not found</Text>
      </View>
    );
  }
  
  const messages = getMessagesByConversation(conversation.id);
  const task = getTaskById(conversation.taskId);
  const otherParticipantId = conversation.participants.find(p => p !== user.id);
  const otherUser = getUserById(otherParticipantId || '') as User | undefined;
  
  useEffect(() => {
    // Mark conversation as read when screen is opened
    if (conversation) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation?.id]);
  
  const handleSend = () => {
    if (!message.trim() || !otherUser || !conversation) return;
    
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      conversationId: conversation.id,
      taskId: conversation.taskId,
      senderId: user.id,
      receiverId: otherUser.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    addMessage(newMessage);
    setMessage('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const handleTaskPress = () => {
    if (task) {
      router.push(`/quests/${task.id}`);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: '',
          headerLeft: () => (
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
          headerTitle: () => (
            <Pressable 
              style={styles.headerTitle} 
              onPress={() => otherUser && router.push(`/profile/${otherUser.id}`)}
            >
              {otherUser && (
                <>
                  <Image 
                    source={{ uri: otherUser.avatar }}
                    style={styles.headerAvatar}
                  />
                  <View>
                    <Text style={styles.headerName}>
                      {otherUser.name}
                      {otherUser.isVerified && " ✓"}
                    </Text>
                  </View>
                </>
              )}
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              {otherUser && (
                <BlockUserButton userId={otherUser.id} />
              )}
              {otherUser && (
                <ReportButton 
                  userId={user.id}
                  contentType="user"
                  contentId={otherUser.id}
                />
              )}
              <Pressable 
                style={styles.infoButton}
                onPress={handleTaskPress}
              >
                <Info size={20} color={colors.text} />
              </Pressable>
            </View>
          ),
        }}
      />
      
      {task && (
        <Pressable style={styles.taskBanner} onPress={handleTaskPress}>
          <Text style={styles.taskBannerText} numberOfLines={1}>
            Quest: {task.title}
          </Text>
        </Pressable>
      )}
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <MessageBubble message={item} />
              {item.senderId !== user.id && (
                <Pressable 
                  style={styles.reportMessageButton}
                  onPress={() => {}}
                >
                  <ReportButton 
                    userId={user.id}
                    contentType="message"
                    contentId={item.id}
                    size="small"
                  />
                </Pressable>
              )}
            </View>
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            multiline
          />
          <Pressable 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? 'white' : colors.textTertiary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    padding: 8,
  },
  taskBanner: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  taskBannerText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  reportMessageButton: {
    position: 'absolute',
    right: -24,
    top: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    fontSize: 16,
    color: colors.text,
    maxHeight: 120,
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});