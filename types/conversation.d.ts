export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  taskId: string;
  lastMessage: Message;
  unreadCount: number;
}