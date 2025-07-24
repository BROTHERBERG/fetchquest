import { useTaskStore } from '@/store/task-store';
import { tasks as mockTasks } from '@/mocks/tasks';
import { Task } from '@/types';

// Mock Firebase
jest.mock('@/config/firebase');

describe('TaskStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useTaskStore.setState({
      tasks: mockTasks,
      acceptedTasks: [],
      completedTasks: [],
      pendingVerificationTasks: [],
      categories: [],
      viewMode: 'list',
    });
  });

  describe('UI State Management', () => {
    it('should update view mode', () => {
      const { setViewMode } = useTaskStore.getState();
      
      setViewMode('map');
      
      expect(useTaskStore.getState().viewMode).toBe('map');
    });

    it('should initialize with default view mode', () => {
      expect(useTaskStore.getState().viewMode).toBe('list');
    });
  });

  describe('Task CRUD Operations', () => {
    const newTask: Task = {
      id: 'test-task-1',
      title: 'Test Task',
      description: 'A test task',
      price: 25,
      category: 'delivery',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      },
      status: 'open',
      requesterId: 'user-1',
      createdAt: new Date(),
      isUrgent: false,
      pointsReward: 100,
      rarity: 'common'
    };

    it('should add a new task', () => {
      const initialTaskCount = useTaskStore.getState().tasks.length;
      const { addTask } = useTaskStore.getState();

      addTask(newTask);

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(initialTaskCount + 1);
      expect(state.tasks).toContain(newTask);
    });

    it('should update an existing task', () => {
      const { addTask, updateTask } = useTaskStore.getState();
      addTask(newTask);

      const updates = { title: 'Updated Task Title', price: 30 };
      updateTask(newTask.id, updates);

      const state = useTaskStore.getState();
      const updatedTask = state.tasks.find(task => task.id === newTask.id);
      expect(updatedTask?.title).toBe('Updated Task Title');
      expect(updatedTask?.price).toBe(30);
    });

    it('should delete a task', () => {
      const { addTask, deleteTask } = useTaskStore.getState();
      addTask(newTask);
      
      const initialTaskCount = useTaskStore.getState().tasks.length;
      deleteTask(newTask.id);

      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(initialTaskCount - 1);
      expect(state.tasks.find(task => task.id === newTask.id)).toBeUndefined();
    });
  });

  describe('Task Management Workflow', () => {
    const openTask: Task = {
      id: 'workflow-task',
      title: 'Workflow Test Task',
      description: 'A task for testing workflow',
      price: 50,
      category: 'cleaning',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      },
      status: 'open',
      requesterId: 'requester-1',
      createdAt: new Date(),
      isUrgent: false,
      pointsReward: 200,
      rarity: 'uncommon'
    };

    beforeEach(() => {
      const { addTask } = useTaskStore.getState();
      addTask(openTask);
    });

    it('should accept an open task', async () => {
      const { acceptTask } = useTaskStore.getState();
      const userId = 'test-user-1';

      await acceptTask(openTask.id, userId);

      const state = useTaskStore.getState();
      const acceptedTask = state.acceptedTasks.find(task => task.id === openTask.id);
      const originalTask = state.tasks.find(task => task.id === openTask.id);
      
      expect(acceptedTask).toBeDefined();
      expect(acceptedTask?.status).toBe('assigned');
      expect(acceptedTask?.assigneeId).toBe(userId);
      expect(originalTask?.status).toBe('assigned');
    });

    it('should throw error when accepting non-open task', async () => {
      const { acceptTask, updateTask } = useTaskStore.getState();
      
      // Update task to assigned status
      updateTask(openTask.id, { status: 'assigned' });
      
      await expect(acceptTask(openTask.id, 'test-user-1'))
        .rejects.toThrow('Task is not available');
    });

    it('should submit task completion', async () => {
      const { acceptTask, submitTaskCompletion } = useTaskStore.getState();
      const userId = 'test-user-1';
      const completionImages = ['image1.jpg', 'image2.jpg'];

      await acceptTask(openTask.id, userId);
      await submitTaskCompletion(openTask.id, completionImages);

      const state = useTaskStore.getState();
      const pendingTask = state.pendingVerificationTasks.find(task => task.id === openTask.id);
      const originalTask = state.tasks.find(task => task.id === openTask.id);
      
      expect(pendingTask).toBeDefined();
      expect(pendingTask?.status).toBe('pending_verification');
      expect(pendingTask?.images).toContain('image1.jpg');
      expect(pendingTask?.images).toContain('image2.jpg');
      expect(originalTask?.status).toBe('pending_verification');
      expect(state.acceptedTasks.find(task => task.id === openTask.id)).toBeUndefined();
    });

    it('should verify task completion (approve)', async () => {
      const { acceptTask, submitTaskCompletion, verifyTaskCompletion } = useTaskStore.getState();
      const userId = 'test-user-1';
      const feedback = 'Great work!';

      await acceptTask(openTask.id, userId);
      await submitTaskCompletion(openTask.id, ['image.jpg']);
      await verifyTaskCompletion(openTask.id, true, feedback);

      const state = useTaskStore.getState();
      const completedTask = state.completedTasks.find(task => task.id === openTask.id);
      const originalTask = state.tasks.find(task => task.id === openTask.id);
      
      expect(completedTask).toBeDefined();
      expect(completedTask?.status).toBe('completed');
      expect(completedTask?.feedback?.comment).toBe(feedback);
      expect(originalTask?.status).toBe('completed');
      expect(state.pendingVerificationTasks.find(task => task.id === openTask.id)).toBeUndefined();
    });

    it('should verify task completion (reject)', async () => {
      const { acceptTask, submitTaskCompletion, verifyTaskCompletion } = useTaskStore.getState();
      const userId = 'test-user-1';
      const feedback = 'Needs improvement';

      await acceptTask(openTask.id, userId);
      await submitTaskCompletion(openTask.id, ['image.jpg']);
      await verifyTaskCompletion(openTask.id, false, feedback);

      const state = useTaskStore.getState();
      const rejectedTask = state.acceptedTasks.find(task => task.id === openTask.id);
      const originalTask = state.tasks.find(task => task.id === openTask.id);
      
      expect(rejectedTask).toBeDefined();
      expect(rejectedTask?.status).toBe('assigned');
      expect(rejectedTask?.feedback?.comment).toBe(feedback);
      expect(originalTask?.status).toBe('assigned');
      expect(state.pendingVerificationTasks.find(task => task.id === openTask.id)).toBeUndefined();
    });

    it('should cancel an assigned task', async () => {
      const { acceptTask, cancelTask } = useTaskStore.getState();
      const userId = 'test-user-1';

      await acceptTask(openTask.id, userId);
      await cancelTask(openTask.id);

      const state = useTaskStore.getState();
      const cancelledTask = state.tasks.find(task => task.id === openTask.id);
      
      expect(cancelledTask?.status).toBe('cancelled');
      expect(state.acceptedTasks.find(task => task.id === openTask.id)).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when accepting non-existent task', async () => {
      const { acceptTask } = useTaskStore.getState();
      
      await expect(acceptTask('non-existent-task', 'user-1'))
        .rejects.toThrow('Task not found');
    });

    it('should throw error when submitting completion for non-assigned task', async () => {
      const { submitTaskCompletion } = useTaskStore.getState();
      const openTaskId = mockTasks[0]?.id;
      
      if (openTaskId) {
        await expect(submitTaskCompletion(openTaskId, ['image.jpg']))
          .rejects.toThrow('Task is not in progress');
      }
    });

    it('should throw error when verifying non-pending task', async () => {
      const { verifyTaskCompletion } = useTaskStore.getState();
      const openTaskId = mockTasks[0]?.id;
      
      if (openTaskId) {
        await expect(verifyTaskCompletion(openTaskId, true))
          .rejects.toThrow('Task is not pending verification');
      }
    });
  });
});