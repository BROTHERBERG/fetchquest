import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BadgeIcon } from '@/components/BadgeIcon';
import { useUserStore } from '@/store/user-store';
import { badges, getUserBadges } from '@/constants/badges';

export default function BadgesScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your badges.</Text>
      </View>
    );
  }
  
  const userBadges = getUserBadges(user.points, user.tasksCompleted);
  const userBadgeIds = userBadges.map(badge => badge.id);
  
  const renderBadgeItem = ({ item }) => {
    const isUnlocked = userBadgeIds.includes(item.id);
    
    return (
      <View style={styles.badgeItem}>
        <BadgeIcon 
          badge={item}
          size="large"
          locked={!isUnlocked}
        />
        
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{item.name}</Text>
          <Text style={styles.badgeDescription}>{item.description}</Text>
          
          {!isUnlocked && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              {item.pointsRequired > 0 && (
                <Text style={styles.requirementText}>
                  • {user.points}/{item.pointsRequired} points
                </Text>
              )}
              {item.tasksRequired && (
                <Text style={styles.requirementText}>
                  • {user.tasksCompleted}/{item.tasksRequired} tasks completed
                </Text>
              )}
              {item.specialRequirement && (
                <Text style={styles.requirementText}>
                  • {item.specialRequirement}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'My Badges',
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
        <Text style={styles.statsText}>
          <Text style={styles.statsHighlight}>{userBadges.length}</Text> of <Text style={styles.statsHighlight}>{badges.length}</Text> badges unlocked
        </Text>
      </View>
      
      <FlatList
        data={badges}
        keyExtractor={(item) => item.id}
        renderItem={renderBadgeItem}
        contentContainerStyle={styles.badgesList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  badgesList: {
    padding: 16,
  },
  badgeItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  badgeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
});