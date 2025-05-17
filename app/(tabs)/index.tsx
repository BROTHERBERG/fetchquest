import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  MapPin, 
  Plus, 
  Search, 
  Award, 
  Bell,
  Filter,
  User
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/task-store';
import { useUserStore } from '@/store/user-store';
import { Button } from '@/components/Button';
import { QuestCard } from '@/components/QuestCard';
import { UserAvatar } from '@/components/UserAvatar';
import { ProgressBar } from '@/components/ProgressBar';
import { CategoryList } from '@/components/CategoryList';
import { SupplyRunBanner } from '@/components/SupplyRunBanner';
import { categories } from '@/constants/categories';
import { typography } from '@/styles/typography';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { tasks } = useTaskStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter tasks
  const openTasks = tasks.filter(task => task.status === 'open');
  
  // Filter tasks by selected category if any
  const filteredTasks = selectedCategory 
    ? openTasks.filter(task => task.category === selectedCategory)
    : openTasks;
  
  // Sort tasks to show urgent ones first
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return 0;
  });
  
  // User progress data
  const userLevel = user?.level || 3;
  const userXp = (user as any)?.xp || 45; // TODO: Update User type with xp field
  const xpToNextLevel = 2200; // This could come from a level calculation function
  const xpProgress = userXp / xpToNextLevel;
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryId ? null : categoryId
    );
  };
  
  const handlePostQuest = () => {
    router.push('create-task' as any);
  };
  
  const handleFindQuests = () => {
    router.push('explore' as any);
  };

  const handleCreateSupplyRun = () => {
    router.push('create-supply-run' as any);
  };

  const hasNotifications = true; // This would come from a notifications store
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: '',
        }}
      />
      
      <View style={styles.mainContainer}>
        {/* Welcome Header with Level Progress */}
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              {user && (
                <Text style={styles.welcomeText}>Welcome, {user.name.split(' ')[0]}</Text>
              )}
              <Text style={styles.welcomeSubtitle}>Your community awaits...</Text>
            </View>
            
            <View style={styles.welcomeRight}>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => router.push('notifications' as any)}
              >
                {hasNotifications ? (
                  <View style={styles.notificationContainer}>
                    <Bell 
                      size={22} 
                      color={colors.primary} 
                      style={styles.bellIcon}
                    />
                    <View style={styles.notificationGlow} />
                  </View>
                ) : (
                  <Bell size={22} color={colors.text} />
                )}
              </TouchableOpacity>
              
              {user && (
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={() => router.push('profile' as any)}
                >
                  <UserAvatar user={user} size="medium" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={xpProgress} 
              style={styles.progressBar}
              height={8}
            />
            <Text style={styles.xpText}>
              {userXp}/{xpToNextLevel} XP to Level {userLevel + 1}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Supply Runs Section */}
          <View style={styles.supplyRunsContainer}>
            <SupplyRunBanner onCreateSupplyRun={handleCreateSupplyRun} />
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesContainer}>
            <CategoryList 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </View>

          {/* Available Quests Section */}
          <View style={styles.questsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Award size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Available Quests</Text>
              </View>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => router.push('filters' as any)}
              >
                <Filter size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {sortedTasks.length > 0 ? (
              sortedTasks.map(task => (
                <QuestCard
                  key={task.id}
                  quest={task}
                  onPress={() => router.push(`/quests/${task.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  No quests available
                </Text>
                <Text style={styles.emptyStateText}>
                  {selectedCategory 
                    ? 'Try selecting a different category'
                    : 'Check back soon for new quests'}
                </Text>
              </View>
            )}

            {sortedTasks.length > 0 && (
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => router.push('explore' as any)}
              >
                <Text style={styles.viewMoreText}>View More Quests</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button 
            title="Post a Quest"
            onPress={handlePostQuest}
            icon={<Plus size={16} color="white" />}
            style={styles.postButton}
          />
          <Button 
            title="Find Quests"
            onPress={handleFindQuests}
            icon={<Search size={16} color="white" />}
            variant="secondary"
            style={styles.findButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    flex: 1,
  },
  welcomeContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  welcomeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
  },
  notificationContainer: {
    position: 'relative',
  },
  bellIcon: {
    transform: [{ rotate: '15deg' }],
  },
  notificationGlow: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarContainer: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    backgroundColor: colors.primaryLight,
  },
  xpText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  supplyRunsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoriesContainer: {
    paddingTop: 16,
  },
  questsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  viewMoreButton: {
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewMoreText: {
    ...typography.button,
    color: colors.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  postButton: {
    flex: 1,
  },
  findButton: {
    flex: 1,
  },
});
