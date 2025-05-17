import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Share2, 
  Heart, 
  AlertTriangle, 
  Award, 
  CheckCircle, 
  XCircle,
  User as UserIcon,
  Star,
  Shield,
  Flag,
  ArrowRight,
  Info
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useTaskStore } from '@/store/task-store';
import { useUserStore } from '@/store/user-store';
import { getUserById } from '@/mocks/users';
import { formatCurrency, formatDate, formatTime } from '@/utils/format';
import { categories } from '@/constants/categories';
import { questRarity, calculateQuestRarity } from '@/constants/rpg';
import { StatusBadge } from '@/components/StatusBadge';
import { UserAvatar } from '@/components/UserAvatar';
import { Rating } from '@/components/Rating';
import { Task, UserProfile } from '@/types';
import { PaymentSummary } from '@/components/payment/PaymentSummary';
import { PLATFORM_FEE } from '@/hooks/use-stripe';

export default function QuestDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tasks, acceptTask, completeTask, cancelTask } = useTaskStore();
  const { user } = useUserStore();
  
  const [task, setTask] = useState<Task | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    // Find the task by ID
    const foundTask = tasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      
      // Get task owner details
      const taskOwner = getUserById(foundTask.requesterId);
      if (taskOwner) {
        setOwner(taskOwner);
      }
    }
    
    setLoading(false);
  }, [id, tasks]);
  
  const handleAcceptQuest = () => {
    if (!task || !user) return;
    
    setAcceptLoading(true);
    
    // In a real app, you would make an API call here
    setTimeout(() => {
      acceptTask(task.id, user.id);
      setAcceptLoading(false);
      Alert.alert('Success', 'You have accepted this quest!');
    }, 1000);
  };
  
  const handleCompleteQuest = () => {
    if (!task) return;
    
    setCompleteLoading(true);
    
    // In a real app, you would make an API call here
    setTimeout(() => {
      completeTask(task.id);
      setCompleteLoading(false);
      Alert.alert('Success', 'Quest marked as completed!');
    }, 1000);
  };
  
  const handleCancelQuest = () => {
    if (!task) return;
    
    Alert.alert(
      'Cancel Quest',
      'Are you sure you want to cancel this quest?',
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            setCancelLoading(true);
            
            // In a real app, you would make an API call here
            setTimeout(() => {
              cancelTask(task.id);
              setCancelLoading(false);
              Alert.alert('Success', 'Quest has been cancelled.');
            }, 1000);
          },
        }
      ]
    );
  };
  
  const handleMessageOwner = () => {
    if (!owner) return;
    router.push(`/conversation/${owner.id}`);
  };
  
  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  const handleSaveQuest = () => {
    Alert.alert('Save', 'Quest saved to your favorites.');
  };
  
  const handleReportQuest = () => {
    Alert.alert('Report', 'Report functionality would be implemented here.');
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading quest details...</Text>
      </SafeAreaView>
    );
  }
  
  if (!task) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Quest not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }
  
  const category = categories.find(c => c.id === task.category);
  const rarity = calculateQuestRarity(task.price, task.isUrgent);
  const rarityInfo = questRarity[rarity];
  const isOwner = user && user.id === task.requesterId;
  const isAssignedToMe = task.assigneeId === user?.id;
  const canAccept = task.status === 'open' && !isOwner;
  const canComplete = (task.status === 'assigned' || task.status === 'in_progress') && isAssignedToMe;
  const canCancel = (task.status === 'open' || task.status === 'assigned' || task.status === 'in_progress') && isOwner;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Quest Details',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {category && (
              <View style={styles.categoryBadge}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  {React.createElement(category.icon, { 
                    size: 16, 
                    color: category.color,
                  })}
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
                
                {task.isUrgent && (
                  <AlertTriangle size={14} color={colors.error} style={styles.urgentIcon} />
                )}
              </View>
            )}
            
            <View style={styles.statusContainer}>
              <StatusBadge status={task.status} />
              
              <View style={[styles.rarityBadge, { backgroundColor: rarityInfo.color + '20' }]}>
                <Text style={[styles.rarityText, { color: rarityInfo.color }]}>
                  {rarityInfo.name}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.title}>{task.title}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
        
        <View style={styles.rewardsCard}>
          <View style={styles.rewardItem}>
            <View style={styles.rewardIconContainer}>
              <DollarSign size={20} color={colors.secondary} />
            </View>
            <View>
              <Text style={styles.rewardLabel}>Reward</Text>
              <Text style={styles.rewardValue}>{formatCurrency(task.price)}</Text>
            </View>
          </View>
          
          <View style={styles.rewardItem}>
            <View style={[styles.rewardIconContainer, { backgroundColor: colors.primaryLight }]}>
              <Award size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.rewardLabel}>XP Points</Text>
              <Text style={styles.rewardValue}>+{task.pointsReward} XP</Text>
            </View>
          </View>
        </View>
        
        {/* Payment Summary for Adventurer */}
        {!isOwner && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Breakdown</Text>
            <PaymentSummary 
              amount={task.price}
              tipAmount={0}
              isRequester={false}
            />
            
            <View style={styles.feeInfoContainer}>
              <Info size={16} color={colors.textSecondary} />
              <Text style={styles.feeInfoText}>
                FetchQuest charges a flat fee of {formatCurrency(PLATFORM_FEE)} to both the quest giver and adventurer for each transaction.
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{task.location.address}</Text>
            </View>
          </View>
          
          {task.dueDate && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Calendar size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>{formatDate(task.dueDate)}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Clock size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Due Time</Text>
                  <Text style={styles.detailValue}>{formatTime(task.dueDate)}</Text>
                </View>
              </View>
            </>
          )}
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={colors.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Posted</Text>
              <Text style={styles.detailValue}>{formatDate(task.createdAt)}</Text>
            </View>
          </View>
        </View>
        
        {owner && (
          <View style={styles.requesterCard}>
            <Text style={styles.requesterTitle}>Quest Giver</Text>
            
            <TouchableOpacity 
              style={styles.requesterInfo}
              onPress={() => router.push(`/profile/${owner.id}`)}
            >
              <UserAvatar user={owner} size="medium" />
              
              <View style={styles.requesterDetails}>
                <View style={styles.requesterNameContainer}>
                  <Text style={styles.requesterName}>{owner.name}</Text>
                  {owner.isVerified && (
                    <Shield size={14} color={colors.primary} style={styles.verifiedIcon} />
                  )}
                </View>
                
                <View style={styles.requesterStats}>
                  <View style={styles.requesterStat}>
                    <Star size={14} color={colors.warning} />
                    <Text style={styles.requesterStatText}>{owner.rating.toFixed(1)}</Text>
                  </View>
                  
                  <View style={styles.requesterStat}>
                    <CheckCircle size={14} color={colors.success} />
                    <Text style={styles.requesterStatText}>{owner.completedTasks || 0} quests</Text>
                  </View>
                </View>
              </View>
              
              <ArrowRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.actionButtonsContainer}>
          {canAccept && (
            <Button
              title="Accept Quest"
              onPress={handleAcceptQuest}
              loading={acceptLoading}
              icon={<CheckCircle size={18} color="white" />}
              style={styles.mainActionButton}
            />
          )}
          
          {canComplete && (
            <Button
              title="Mark as Completed"
              onPress={handleCompleteQuest}
              loading={completeLoading}
              icon={<CheckCircle size={18} color="white" />}
              style={styles.mainActionButton}
            />
          )}
          
          {canCancel && (
            <Button
              title="Cancel Quest"
              onPress={handleCancelQuest}
              loading={cancelLoading}
              variant="outline"
              icon={<XCircle size={18} color={colors.primary} />}
              style={styles.cancelButton}
            />
          )}
          
          <View style={styles.secondaryActionsContainer}>
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={handleMessageOwner}
            >
              <MessageSquare size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={handleSaveQuest}
            >
              <Heart size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={handleReportQuest}
            >
              <Flag size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 120,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  urgentIcon: {
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  rewardsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  feeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  feeInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  detailsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  requesterCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  requesterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  requesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requesterDetails: {
    flex: 1,
    marginLeft: 12,
  },
  requesterNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requesterName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  requesterStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  requesterStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  requesterStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  actionButtonsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  mainActionButton: {
    marginBottom: 16,
  },
  cancelButton: {
    marginBottom: 16,
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});