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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
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
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
  const userXp = user?.xp || 45;
  const xpToNextLevel = 2200; // This could come from a level calculation function
  const xpProgress = userXp / xpToNextLevel;
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryId ? null : categoryId
    );
  };
  
  const handleTaskCardPress = (taskId: string) => {
    navigation.navigate(`/quests/${taskId}`);
  };
  
  const handlePostQuest = () => {
    navigation.navigate('/create-task');
  };
  
  const handleFindQuests = () => {
    navigation.navigate('/explore');
  };

  const handleCreateSupplyRun = () => {
    navigation.navigate('/create-supply-run');
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
                onPress={() => navigation.navigate('/notifications')}
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
                  onPress={() => navigation.navigate('/profile')}
                >
                  <UserAvatar user={user} size="small" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={xpProgress} 
              height={6}
              backgroundColor={`${colors.primary}20`}
              fillColor={colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.xpText}>{userXp}/{xpToNextLevel} XP to Level {userLevel + 1}</Text>
          </View>
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Supply Runs Banner */}
          <View style={styles.supplyRunsContainer}>
            <SupplyRunBanner onCreateSupplyRun={handleCreateSupplyRun} />
          </View>
          
          {/* Category Filters */}
          <View style={styles.categoriesContainer}>
            <CategoryList 
              selectedCategory={selectedCategory || undefined}
              onSelectCategory={handleCategorySelect}
              hideLabels={true}
            />
          </View>
          
          {/* Available Quests Section */}
          <View style={styles.questsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Award size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>
                  {selectedCategory 
                    ? `${categories.find(c => c.id === selectedCategory)?.name} Quests` 
                    : 'Available Quests'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => navigation.navigate('/explore?filter=true')}
              >
                <Filter size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {sortedTasks.length > 0 ? (
              sortedTasks.slice(0, 4).map(task => (
                <QuestCard 
                  key={task.id}
                  quest={task}
                  onPress={() => handleTaskCardPress(task.id)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Quests Available</Text>
                <Text style={styles.emptyStateText}>
                  {selectedCategory 
                    ? `There are no ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} quests available right now.`
                    : 'There are no quests available in your area right now.'}
                </Text>
              </View>
            )}
            
            {sortedTasks.length > 4 && (
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => navigation.navigate('/explore')}
              >
                <Text style={styles.viewMoreText}>View More Quests</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Post a Quest"
            onPress={handlePostQuest}
            icon={<Plus size={18} color="white" />}
            style={styles.postButton}
          />
          <Button
            title="Find Quests"
            onPress={handleFindQuests}
            variant="secondary"
            icon={<Search size={18} color="white" />}
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
    backgroundColor: colors.background,
  },
  welcomeContainer: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  progressBar: {
    marginBottom: 6,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  notificationButton: {
    padding: 8,
  },
  notificationContainer: {
    position: 'relative',
  },
  bellIcon: {
    zIndex: 2,
  },
  notificationGlow: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    zIndex: 1,
  },
  avatarContainer: {
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  supplyRunsContainer: {
    marginTop: 16,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  questsSection: {
    marginTop: 24,
    marginBottom: 100, // Extra space for bottom buttons
  },
  filterButton: {
    padding: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  viewMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  postButton: {
    flex: 1,
    marginRight: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  findButton: {
    flex: 1,
    marginLeft: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});