import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation } from '@/types';
import { messages, conversations } from '@/mocks/messages';

// Firebase imports
import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  
  // Message operations
  fetchMessages: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  setMessages: (messages: Message[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  
  // Getters
  getConversationsByUser: (userId: string) => Conversation[];
  getMessagesByConversation: (conversationId: string) => Message[];
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: messages, // Initialize with mock data
      conversations: conversations, // Initialize with mock data
      isLoading: false,
      error: null,
      
      fetchMessages: async () => {
        set({ isLoading: true, error: null });
        try {
          const messagesCollection = collection(db, 'messages');
          const messagesSnapshot = await getDocs(messagesCollection);
          
          const fetchedMessages: Message[] = [];
          messagesSnapshot.forEach((doc) => {
            const data = doc.data();
            fetchedMessages.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate?.() 
                ? data.timestamp.toDate().toISOString() 
                : new Date().toISOString(),
            } as Message);
          });
          
          set({ 
            messages: fetchedMessages,
            isLoading: false 
          });
        } catch (error) {
          console.error('Fetch messages error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch messages', 
            isLoading: false 
          });
        }
      },
      
      fetchConversations: async () => {
        set({ isLoading: true, error: null });
        try {
          const conversationsCollection = collection(db, 'conversations');
          const conversationsSnapshot = await getDocs(conversationsCollection);
          
          const fetchedConversations: Conversation[] = [];
          conversationsSnapshot.forEach((doc) => {
            fetchedConversations.push({
              id: doc.id,
              ...doc.data()
            } as Conversation);
          });
          
          set({ 
            conversations: fetchedConversations,
            isLoading: false 
          });
        } catch (error) {
          console.error('Fetch conversations error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch conversations', 
            isLoading: false 
          });
        }
      },
      
      setMessages: (messages) => set({ messages }),
      
      setConversations: (conversations) => set({ conversations }),
      
      addMessage: async (messageData) => {
        set({ isLoading: true, error: null });
        try {
          // Create message object
          const newMessage: Message = {
            id: `msg_${Date.now()}`,
            ...messageData,
            timestamp: new Date().toISOString(),
            isRead: false
          };
          
          // Add to Firestore
          const firestoreMessage = {
            ...messageData,
            timestamp: serverTimestamp(),
            isRead: false
          };
          
          const docRef = await addDoc(collection(db, 'messages'), firestoreMessage);
          newMessage.id = docRef.id;
          
          // Update local state
          set((state) => {
            // Add message to messages array
            const newMessages = [...state.messages, newMessage];
            
            // Find or create conversation
            let conversation = state.conversations.find(
              c => c.taskId === messageData.taskId && 
                   c.participants.includes(messageData.senderId) && 
                   c.participants.includes(messageData.receiverId)
            );
            
            let newConversations = [...state.conversations];
            
            if (conversation) {
              // Update existing conversation
              newConversations = state.conversations.map(c => {
                if (c.id === conversation?.id) {
                  return {
                    ...c,
                    lastMessage: newMessage,
                    unreadCount: messageData.senderId !== get().getConversationsByUser(messageData.receiverId)[0]?.participants.find(p => p !== messageData.receiverId) 
                      ? c.unreadCount + 1 
                      : c.unreadCount
                  };
                }
                return c;
              });
              
              // Update in Firestore
              updateDoc(doc(db, 'conversations', conversation.id), {
                lastMessage: newMessage,
                unreadCount: conversation.unreadCount + 1
              });
            } else {
              // Create new conversation
              const newConversation: Conversation = {
                id: `conv${state.conversations.length + 1}`,
                taskId: messageData.taskId,
                participants: [messageData.senderId, messageData.receiverId],
                lastMessage: newMessage,
                unreadCount: 1,
              };
              
              // Add to Firestore
              addDoc(collection(db, 'conversations'), newConversation)
                .then(docRef => {
                  newConversation.id = docRef.id;
                });
              
              newConversations = [...state.conversations, newConversation];
            }
            
            return { 
              messages: newMessages,
              conversations: newConversations,
              isLoading: false
            };
          });
        } catch (error) {
          console.error('Add message error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add message', 
            isLoading: false 
          });
        }
      },
      
      markConversationAsRead: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
          // Update in Firestore
          await updateDoc(doc(db, 'conversations', conversationId), {
            unreadCount: 0
          });
          
          set((state) => {
            const newConversations = state.conversations.map(c => {
              if (c.id === conversationId) {
                return { ...c, unreadCount: 0 };
              }
              return c;
            });
            
            const conversation = state.conversations.find(c => c.id === conversationId);
            if (!conversation) return { 
              conversations: newConversations,
              isLoading: false 
            };
            
            // Mark all messages in this conversation as read
            const newMessages = state.messages.map(m => {
              if (m.taskId === conversation.taskId && 
                  conversation.participants.includes(m.senderId) && 
                  conversation.participants.includes(m.receiverId)) {
                
                // Update message in Firestore
                updateDoc(doc(db, 'messages', m.id), {
                  isRead: true
                });
                
                return { ...m, isRead: true };
              }
              return m;
            });
            
            return { 
              messages: newMessages,
              conversations: newConversations,
              isLoading: false
            };
          });
        } catch (error) {
          console.error('Mark conversation as read error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark conversation as read', 
            isLoading: false 
          });
        }
      },
      
      getConversationsByUser: (userId) => {
        return get().conversations.filter(c => c.participants.includes(userId));
      },
      
      getMessagesByConversation: (conversationId) => {
        const conversation = get().conversations.find(c => c.id === conversationId);
        if (!conversation) return [];
        
        return get().messages
          .filter(m => 
            m.taskId === conversation.taskId && 
            conversation.participants.includes(m.senderId) && 
            conversation.participants.includes(m.receiverId)
          )
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      },
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        messages: state.messages,
        conversations: state.conversations 
      }),
    }
  )
);