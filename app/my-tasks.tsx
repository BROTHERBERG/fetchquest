import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { useUserStore } from '@/store/user-store';
import { getTasksByUser } from '@/mocks/tasks';

export default function MyTasksScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'posted' | 'helping'>('posted');
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your tasks.</Text>
      </View>
    );
  }
  
  const postedTasks = getTasksByUser(user.id, 'requester');
  const helpingTasks = getTasksByUser(user.id, 'helper');
  
  const tasks = activeTab === 'posted' ? postedTasks : helpingTasks;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'My Tasks',
          headerLeft: () => (
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'posted' && styles.activeTab
          ]}
          onPress={() => setActiveTab('posted')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'posted' && styles.activeTabText
          ]}>
            Posted by me
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.tab,
            activeTab === 'helping' && styles.activeTab
          ]}
          onPress={() => setActiveTab('helping')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'helping' && styles.activeTabText
          ]}>
            Helping with
          </Text>
        </Pressable>
      </View>
      
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title={`No ${activeTab === 'posted' ? 'posted' : 'helping'} tasks`}
          description={
            activeTab === 'posted'
              ? "You haven't posted any tasks yet. Create a task to get help from your neighbors."
              : "You aren't helping with any tasks yet. Browse available tasks to find ones you can help with."
          }
          actionLabel={activeTab === 'posted' ? 'Create Task' : 'Find Tasks'}
          onAction={() => 
            activeTab === 'posted' 
              ? router.push('/create-task') 
              : router.push('/explore')
          }
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
  backButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  taskList: {
    padding: 16,
  },
});