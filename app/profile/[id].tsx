import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle, 
  Calendar, 
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Shield
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Rating } from '@/components/Rating';
import { getUserById } from '@/mocks/users';
import { getTasksByUser } from '@/mocks/tasks';
import { getReviewsByUser } from '@/mocks/reviews';
import { useUserStore } from '@/store/user-store';
import { formatDate } from '@/utils/format';
import { VerificationBadge } from '@/components/VerificationBadge';
import { ReportButton } from '@/components/ReportButton';
import { BlockUserButton } from '@/components/BlockUserButton';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = useUserStore();
  
  const user = getUserById(id as string);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }
  
  const isCurrentUser = currentUser?.id === user.id;
  const userTasks = getTasksByUser(user.id, 'requester');
  const helpedTasks = getTasksByUser(user.id, 'helper');
  const reviews = getReviewsByUser(user.id, 'reviewee');
  
  const handleMessage = () => {
    // In a real app, would create or navigate to a conversation
    Alert.alert("Message", "Messaging functionality would be implemented here");
  };
  
  const handleVerifyIdentity = () => {
    if (isCurrentUser) {
      router.push('/verify-identity');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: '',
          headerLeft: () => (
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
          headerRight: () => (
            !isCurrentUser && (
              <View style={styles.headerActions}>
                <BlockUserButton userId={user.id} />
                <ReportButton 
                  userId={currentUser?.id || ''}
                  contentType="user"
                  contentId={user.id}
                />
              </View>
            )
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
                <CheckCircle size={16} color={colors.success} fill="white" />
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Rating value={user.rating} />
            <Text style={styles.ratingText}>
              {user.rating.toFixed(1)} ({user.reviewCount} reviews)
            </Text>
          </View>
          
          <View style={styles.verificationContainer}>
            <VerificationBadge 
              status={user.isVerified ? 'verified' : 'unverified'}
              onPress={isCurrentUser ? handleVerifyIdentity : undefined}
            />
          </View>
          
          {!isCurrentUser && (
            <Button
              title="Message"
              onPress={handleMessage}
              variant="primary"
              size="small"
              icon={<MessageSquare size={16} color="white" />}
              style={styles.messageButton}
            />
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.tasksRequested}</Text>
            <Text style={styles.statLabel}>Quests Posted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Quests Completed</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.length > 0 && (
              <Pressable onPress={() => router.push(`/reviews/${user.id}`)}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            )}
          </View>
          
          {reviews.length > 0 ? (
            reviews.slice(0, 2).map((review) => {
              const reviewer = getUserById(review.reviewerId);
              if (!reviewer) return null;
              
              return (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Image 
                      source={{ uri: reviewer.avatar }}
                      style={styles.reviewerAvatar}
                    />
                    <View>
                      <Text style={styles.reviewerName}>
                        {reviewer.name}
                        {reviewer.isVerified && " ✓"}
                      </Text>
                      <Rating value={review.rating} size="small" />
                    </View>
                    <Text style={styles.reviewDate}>
                      {formatDate(review.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          )}
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
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
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
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  verificationContainer: {
    marginBottom: 16,
  },
  messageButton: {
    minWidth: 120,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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
  reviewItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 'auto',
  },
  reviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});