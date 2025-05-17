import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tasks as mockTasks } from '@/mocks/tasks';
import { categories } from '@/constants/categories';
import { Task } from '@/types';
import { LucideIcon } from 'lucide-react-native';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface TaskState {
  // Task Lists
  tasks: Task[];
  acceptedTasks: Task[];
  completedTasks: Task[];
  pendingVerificationTasks: Task[];

  // UI State
  categories: Category[];
  viewMode: 'map' | 'list';

  // Actions
  setViewMode: (mode: 'map' | 'list') => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Task Management
  acceptTask: (taskId: string, userId: string) => Promise<void>;
  submitTaskCompletion: (taskId: string, completionImages: string[]) => Promise<void>;
  verifyTaskCompletion: (taskId: string, approved: boolean, feedback?: string) => Promise<void>;
  cancelTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: mockTasks,
      categories,
      viewMode: 'list',
      acceptedTasks: [],
      completedTasks: [],
      pendingVerificationTasks: [],
      
      // UI actions
      setViewMode: (mode) => set(() => ({
        viewMode: mode
      })),
      
      // Task CRUD
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId)
      })),
      
      // Task management
      acceptTask: async (taskId, userId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        if (task.status !== 'open') throw new Error('Task is not available');

        const updatedTask: Task = { 
          ...task, 
          status: 'assigned',
          assigneeId: userId,
          completedAt: undefined
        };

        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
          acceptedTasks: [...state.acceptedTasks, updatedTask]
        }));
      },

      submitTaskCompletion: async (taskId, completionImages) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        if (task.status !== 'assigned') throw new Error('Task is not in progress');

        const updatedTask: Task = { 
          ...task, 
          status: 'pending_verification',
          images: [...(task.images || []), ...completionImages],
          completedAt: new Date()
        };

        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
          acceptedTasks: state.acceptedTasks.filter(t => t.id !== taskId),
          pendingVerificationTasks: [...state.pendingVerificationTasks, updatedTask]
        }));
      },

      verifyTaskCompletion: async (taskId, approved, feedback) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');
        if (task.status !== 'pending_verification') throw new Error('Task is not pending verification');

        const updatedTask: Task = { 
          ...task, 
          status: approved ? 'completed' : 'assigned',
          completedAt: approved ? new Date() : undefined,
          feedback: feedback ? {
            comment: feedback,
            timestamp: new Date()
          } : undefined
        };

        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
          pendingVerificationTasks: state.pendingVerificationTasks.filter(t => t.id !== taskId),
          ...(approved
            ? { completedTasks: [...state.completedTasks, updatedTask] }
            : { acceptedTasks: [...state.acceptedTasks, updatedTask] })
        }));
      },
      
      cancelTask: async (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');

        const updatedTask: Task = { 
          ...task, 
          status: 'cancelled',
          completedAt: undefined
        };

        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
          acceptedTasks: state.acceptedTasks.filter(t => t.id !== taskId)
        }));
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);