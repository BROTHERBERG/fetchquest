import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/task-store';
import { TaskDetailsModal } from '@/components/TaskDetailsModal';
import { Button } from '@/components/Button';

export default function TestVerificationScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const { tasks, verifyTaskCompletion } = useTaskStore();
  
  // Get task ID 6 which is in pending_verification state
  const testTask = tasks.find(t => t.id === '6');
  
  const handleVerify = async (task, approved, feedback, rating) => {
    try {
      await verifyTaskCompletion(task.id, approved, feedback);
      console.log('Task verification complete:', { approved, feedback, rating });
    } catch (error) {
      console.error('Error verifying task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Test Verification',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }} />

      <View style={styles.content}>
        <Button 
          title="Open Verification Modal"
          onPress={() => setModalVisible(true)}
          variant="primary"
        />
      </View>

      <TaskDetailsModal
        task={testTask}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        currentUserId={testTask?.requesterId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
