import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Rating } from '@/components/Rating';
import { getUserById } from '@/mocks/users';
import { getReviewsByUser } from '@/mocks/reviews';
import { getTaskById } from '@/mocks/tasks';
import { formatDate } from '@/utils/format';

export default function UserReviewsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const user = getUserById(id as string);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }
  
  const reviews = getReviewsByUser(user.id, 'reviewee');
  
  const renderReviewItem = ({ item }) => {
    const reviewer = getUserById(item.reviewerId);
    const task = getTaskById(item.taskId);
    
    if (!reviewer || !task) return null;
    
    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Image 
            source={{ uri: reviewer.avatar }}
            style={styles.avatar}
          />
          
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>{reviewer.name}</Text>
            <Text style={styles.taskTitle} numberOfLines={1}>
              Task: {task.title}
            </Text>
          </View>
          
          <Text style={styles.reviewDate}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Rating value={item.rating} size="medium" />
          <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
        </View>
        
        <Text style={styles.reviewText}>{item.comment}</Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: `${user.name}'s Reviews`,
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
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.rating.toFixed(1)}</Text>
          <Rating value={user.rating} size="small" />
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.reviewCount}</Text>
          <Text style={styles.statLabel}>Total Reviews</Text>
        </View>
      </View>
      
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItem}
          contentContainerStyle={styles.reviewsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reviews yet</Text>
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  reviewsList: {
    padding: 16,
  },
  reviewItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});