import { Message, Conversation } from '@/types';

export const messages: Message[] = [
  {
    id: 'msg1',
    taskId: 'task2',
    senderId: 'user3',
    receiverId: 'user1',
    content: "Hi there! I saw you're available to help with moving my furniture. Do you have a truck?",
    timestamp: '2023-06-14T16:00:00Z',
    isRead: true,
  },
  {
    id: 'msg2',
    taskId: 'task2',
    senderId: 'user1',
    receiverId: 'user3',
    content: "Yes, I have a pickup truck that should work well for your couch and bookshelf. What time works best for you on the 16th?",
    timestamp: '2023-06-14T16:10:00Z',
    isRead: true,
  },
  {
    id: 'msg3',
    taskId: 'task2',
    senderId: 'user3',
    receiverId: 'user1',
    content: "That's perfect! How about 10am? That gives us plenty of time before the deadline.",
    timestamp: '2023-06-14T16:15:00Z',
    isRead: true,
  },
  {
    id: 'msg4',
    taskId: 'task2',
    senderId: 'user1',
    receiverId: 'user3',
    content: "10am works for me. I'll see you then at your current address. Could you send me the exact address for the new place too?",
    timestamp: '2023-06-14T16:20:00Z',
    isRead: true,
  },
  {
    id: 'msg5',
    taskId: 'task2',
    senderId: 'user3',
    receiverId: 'user1',
    content: "Great! My current address is 456 Oak Avenue, Apt 3B. The new place is 789 Elm Street, Apt 2A. Both have elevators, so that should make it easier.",
    timestamp: '2023-06-14T16:25:00Z',
    isRead: false,
  },
  {
    id: 'msg6',
    taskId: 'task7',
    senderId: 'user4',
    receiverId: 'user1',
    content: "Hello! Thanks for accepting my task. The dinner is ready to be picked up anytime after 5pm. It's packed in containers that don't need to be returned.",
    timestamp: '2023-06-15T12:00:00Z',
    isRead: true,
  },
  {
    id: 'msg7',
    taskId: 'task7',
    senderId: 'user1',
    receiverId: 'user4',
    content: "No problem! I can pick it up at 5:30pm. Is there anything specific I should know about the delivery? Any dietary restrictions or special instructions?",
    timestamp: '2023-06-15T12:10:00Z',
    isRead: true,
  },
  {
    id: 'msg8',
    taskId: 'task7',
    senderId: 'user4',
    receiverId: 'user1',
    content: "Yes, please make sure to tell her it's low sodium. Also, there's a note included with heating instructions. Her name is Mrs. Johnson and she knows someone is delivering dinner.",
    timestamp: '2023-06-15T12:15:00Z',
    isRead: true,
  },
  {
    id: 'msg9',
    taskId: 'task7',
    senderId: 'user1',
    receiverId: 'user4',
    content: "Got it. Low sodium and I'll make sure to point out the heating instructions. See you at 5:30pm!",
    timestamp: '2023-06-15T12:20:00Z',
    isRead: false,
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    taskId: 'task2',
    participants: ['user1', 'user3'],
    lastMessage: messages[4],
    unreadCount: 1,
  },
  {
    id: 'conv2',
    taskId: 'task7',
    participants: ['user1', 'user4'],
    lastMessage: messages[8],
    unreadCount: 1,
  },
];

export const getMessagesByConversation = (conversationId: string): Message[] => {
  const conversation = conversations.find(conv => conv.id === conversationId);
  if (!conversation) return [];
  
  return messages.filter(msg => 
    msg.taskId === conversation.taskId && 
    conversation.participants.includes(msg.senderId) && 
    conversation.participants.includes(msg.receiverId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getConversationsByUser = (userId: string): Conversation[] => {
  return conversations.filter(conv => conv.participants.includes(userId));
};