console.log('👤 ProfileScreen loaded!');

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  Settings, 
  Star, 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  LogOut,
  Edit,
  ChevronRight,
  Award,
  CreditCard,
  DollarSign,
  Wallet
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Rating } from '@/components/Rating';
import { useUserStore } from '@/store/user-store';
import { formatCurrency, formatDate } from '@/utils/format';
import { getTasksByUser } from '@/mocks/tasks';
import { getReviewsByUser } from '@/mocks/reviews';
import { LevelBadge } from '@/components/LevelBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { BadgeIcon } from '@/components/BadgeIcon';
import { badges, getUserBadges, getNextBadge } from '@/constants/badges';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile.</Text>
      </View>
    );
  }
  
  const userTasks = getTasksByUser(user.id, 'requester');
  const helpedTasks = getTasksByUser(user.id, 'helper');
  const reviews = getReviewsByUser(user.id, 'reviewee');
  
  // Calculate progress to next level
  const currentLevelPoints = user.level * 100 - 100;
  const nextLevelPoints = user.level * 100;
  const pointsProgress = (user.points - currentLevelPoints) / 100;
  
  // Get user badges
  const userBadges = getUserBadges(user.points, user.tasksCompleted);
  const nextBadge = getNextBadge(user.points, user.tasksCompleted);
  
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };
  
  const handleLogout = () => {
    logout();
    // In a real app, would navigate to login screen
  };
  
  const handleViewAllBadges = () => {
    router.push('/badges');
  };
  
  const handleViewPaymentMethods = () => {
    router.push('/payment-methods');
  };
  
  const handleViewEarnings = () => {
    router.push('/earnings');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Profile',
          headerRight: () => (
            <Pressable 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={20} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={16} color={colors.primary} fill="white" />
              </View>
            )}
            <View style={styles.levelBadgeContainer}>
              <LevelBadge level={user.level} size="medium" />
            </View>
          </View>
          
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Rating value={user.rating} />
            <Text style={styles.ratingText}>
              {user.rating.toFixed(1)} ({user.reviewCount} reviews)
            </Text>
          </View>
          
          <View style={styles.levelProgressContainer}>
            <Text style={styles.levelText}>Level {user.level}</Text>
            <ProgressBar 
              progress={pointsProgress}
              height={6}
              style={styles.progressBar}
            />
            <Text style={styles.pointsText}>
              {user.points} XP total • {user.points - currentLevelPoints}/{100} to Level {user.level + 1}
            </Text>
          </View>
          
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            icon={<Edit size={16} color={colors.primary} />}
            style={styles.editButton}
          />
        </View>
        
        {/* Earnings Card */}
        <Pressable style={styles.earningsCard} onPress={handleViewEarnings}>
          <View style={styles.earningsHeader}>
            <Text style={styles.earningsTitle}>Earnings</Text>
            <ChevronRight size={20} color={colors.textTertiary} />
          </View>
          
          <View style={styles.earningsContent}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>Available</Text>
              <Text style={styles.earningsValue}>{formatCurrency(user.earnings || 0)}</Text>
            </View>
            
            <View style={styles.earningsDivider} />
            
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>Pending</Text>
              <Text style={styles.earningsValue}>{formatCurrency(user.pendingEarnings || 0)}</Text>
            </View>
          </View>
          
          <Button
            title="View Earnings"
            onPress={handleViewEarnings}
            variant="outline"
            size="small"
            icon={<Wallet size={16} color={colors.primary} />}
            style={styles.earningsButton}
          />
        </Pressable>
        
        <View style={styles.badgesSection}>
          <View style={styles.badgesSectionHeader}>
            <Text style={styles.badgesSectionTitle}>Badges</Text>
            <Pressable onPress={handleViewAllBadges}>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesContainer}
          >
            {userBadges.slice(0, 5).map(badge => (
              <BadgeIcon 
                key={badge.id}
                badge={badge}
                showName
                size="medium"
              />
            ))}
            
            {nextBadge && (
              <BadgeIcon 
                badge={nextBadge}
                showName
                size="medium"
                locked
              />
            )}
          </ScrollView>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.tasksRequested}</Text>
            <Text style={styles.statLabel}>Tasks Posted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>
        
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoItem}>
            <Mail size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          
          {user.phone && (
            <View style={styles.infoItem}>
              <Phone size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
          )}
          
          {user.address && (
            <View style={styles.infoItem}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.address}</Text>
            </View>
          )}
          
          <View style={styles.infoItem}>
            <Calendar size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              Joined {formatDate(user.joinedDate)}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/my-tasks')}>
            <View style={styles.menuItemContent}>
              <Clock size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>My Tasks</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/my-reviews')}>
            <View style={styles.menuItemContent}>
              <Star size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>My Reviews</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/badges')}>
            <View style={styles.menuItemContent}>
              <Award size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>My Badges</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={handleViewPaymentMethods}>
            <View style={styles.menuItemContent}>
              <CreditCard size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={handleViewEarnings}>
            <View style={styles.menuItemContent}>
              <DollarSign size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Earnings</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings')}>
            <View style={styles.menuItemContent}>
              <Settings size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/test-verification')}>
            <View style={styles.menuItemContent}>
              <CheckCircle size={20} color={colors.warning} />
              <Text style={styles.menuItemText}>Test Verification</Text>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <View style={styles.menuItemContent}>
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </Pressable>
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
  settingsButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelBadgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  levelProgressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  progressBar: {
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  editButton: {
    minWidth: 120,
  },
  earningsCard: {
    margin: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  earningsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  earningsDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  earningsButton: {
    alignSelf: 'center',
  },
  badgesSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badgesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  badgesSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  badgesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  bioText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: colors.error,
  },
});