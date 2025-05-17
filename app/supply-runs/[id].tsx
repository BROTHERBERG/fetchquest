import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShoppingCart, 
  Check, 
  X, 
  Plus,
  MessageSquare,
  Share2,
  Heart,
  AlertTriangle
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { UserAvatar } from '@/components/UserAvatar';
import { formatDate, formatTime } from '@/utils/format';
import { getUserById } from '@/mocks/users';

// Mock supply run data
const supplyRuns = [
  {
    id: '1',
    title: 'Costco Grocery Run',
    description: 'I\'m heading to Costco this Saturday morning. Happy to pick up items for neighbors. Limited to 5 items per person due to space constraints.',
    organizer: 'user_1', // Alex Johnson
    location: {
      name: 'Costco Wholesale',
      address: '450 10th St, San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194
    },
    date: '2023-06-15T10:00:00Z',
    maxParticipants: 5,
    participants: ['user_2', 'user_3'],
    status: 'upcoming',
    items: [
      { id: '1', name: 'Paper Towels (Bulk)', requester: 'user_2', status: 'confirmed' },
      { id: '2', name: 'Rotisserie Chicken', requester: 'user_2', status: 'confirmed' },
      { id: '3', name: 'Organic Eggs (24 pack)', requester: 'user_3', status: 'confirmed' },
      { id: '4', name: 'Almond Milk (3 pack)', requester: 'user_3', status: 'confirmed' }
    ]
  },
  {
    id: '2',
    title: 'Trader Joe\'s Run',
    description: 'Going to Trader Joe\'s on Sunday afternoon. Can pick up items for neighbors in the building. Let me know what you need!',
    organizer: 'user_2', // Sarah Miller
    location: {
      name: 'Trader Joe\'s',
      address: '555 9th St, San Francisco, CA',
      latitude: 37.7724,
      longitude: -122.4100
    },
    date: '2023-06-16T15:00:00Z',
    maxParticipants: 3,
    participants: ['user_1'],
    status: 'upcoming',
    items: [
      { id: '1', name: 'Everything But The Bagel Seasoning', requester: 'user_1', status: 'confirmed' },
      { id: '2', name: 'Cauliflower Gnocchi', requester: 'user_1', status: 'confirmed' }
    ]
  }
];

export default function SupplyRunDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [supplyRun, setSupplyRun] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    // Find the supply run by ID
    const run = supplyRuns.find(run => run.id === id);
    if (run) {
      setSupplyRun(run);
      
      // Get organizer details
      const organizerData = getUserById(run.organizer);
      if (organizerData) {
        setOrganizer(organizerData);
      }
      
      // Check if current user is participating
      // In a real app, you would use the authenticated user's ID
      const currentUserId = 'user_1'; // Alex Johnson
      setIsParticipating(run.participants.includes(currentUserId));
    }
    
    setLoading(false);
  }, [id]);
  
  const handleJoin = () => {
    if (!supplyRun) return;
    
    if (supplyRun.participants.length >= supplyRun.maxParticipants) {
      Alert.alert('Supply Run Full', 'This supply run has reached its maximum number of participants.');
      return;
    }
    
    // In a real app, you would make an API call to join the supply run
    setIsParticipating(true);
    Alert.alert('Success', 'You have joined the supply run!');
  };
  
  const handleLeave = () => {
    if (!supplyRun) return;
    
    // In a real app, you would make an API call to leave the supply run
    setIsParticipating(false);
    Alert.alert('Success', 'You have left the supply run.');
  };
  
  const handleAddItem = () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }
    
    // In a real app, you would make an API call to add the item
    Alert.alert('Success', `"${newItem}" has been added to your request.`);
    setNewItem('');
    setShowAddItemModal(false);
  };
  
  const handleMessageOrganizer = () => {
    if (!organizer) return;
    router.push(`/conversation/${organizer.id}`);
  };
  
  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading supply run details...</Text>
      </SafeAreaView>
    );
  }
  
  if (!supplyRun) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Supply run not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }
  
  const runDate = new Date(supplyRun.date);
  const formattedDate = formatDate(supplyRun.date);
  const formattedTime = formatTime(supplyRun.date);
  const spotsLeft = supplyRun.maxParticipants - supplyRun.participants.length;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Supply Run Details',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{supplyRun.title}</Text>
          
          <View style={styles.organizerContainer}>
            {organizer && (
              <TouchableOpacity
                style={styles.organizerInfo}
                onPress={() => router.push(`/profile/${organizer.id}`)}
              >
                <UserAvatar user={organizer} size="small" />
                <Text style={styles.organizerName}>
                  Organized by {organizer.name}
                  {organizer.isVerified && " ✓"}
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {supplyRun.status === 'upcoming' ? 'Upcoming' : supplyRun.status}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={colors.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formattedTime}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{supplyRun.location.name}</Text>
              <Text style={styles.detailSubvalue}>{supplyRun.location.address}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Users size={20} color={colors.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Participants</Text>
              <Text style={styles.detailValue}>
                {supplyRun.participants.length} of {supplyRun.maxParticipants} spots filled
              </Text>
              {spotsLeft > 0 && (
                <Text style={styles.detailSubvalue}>
                  {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{supplyRun.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requested Items</Text>
          
          {supplyRun.items.length > 0 ? (
            <View style={styles.itemsContainer}>
              {supplyRun.items.map(item => {
                const requester = getUserById(item.requester);
                return (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemInfo}>
                      <ShoppingCart size={16} color={colors.textSecondary} />
                      <Text style={styles.itemName}>{item.name}</Text>
                    </View>
                    
                    <View style={styles.itemRequester}>
                      {requester && (
                        <>
                          <Text style={styles.itemRequesterText}>
                            Requested by {requester.name.split(' ')[0]}
                          </Text>
                          <View style={styles.itemStatus}>
                            {item.status === 'confirmed' ? (
                              <Check size={14} color={colors.success} />
                            ) : (
                              <AlertTriangle size={14} color={colors.warning} />
                            )}
                            <Text 
                              style={[
                                styles.itemStatusText,
                                { color: item.status === 'confirmed' ? colors.success : colors.warning }
                              ]}
                            >
                              {item.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No items have been requested yet.</Text>
            </View>
          )}
          
          {isParticipating && (
            <Button
              title="Add Item Request"
              onPress={() => setShowAddItemModal(true)}
              variant="outline"
              icon={<Plus size={18} color={colors.primary} />}
              style={styles.addItemButton}
            />
          )}
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <Button
            title={isParticipating ? "Leave Supply Run" : "Join Supply Run"}
            onPress={isParticipating ? handleLeave : handleJoin}
            variant={isParticipating ? "outline" : "primary"}
            icon={isParticipating ? <X size={18} color={colors.primary} /> : <Check size={18} color="white" />}
            style={styles.mainActionButton}
          />
          
          <View style={styles.secondaryActionsContainer}>
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={handleMessageOrganizer}
            >
              <MessageSquare size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryActionButton}>
              <Heart size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Add Item Modal would go here in a real implementation */}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  organizerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  detailsCard: {
    margin: 16,
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
  detailSubvalue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    padding: 16,
    marginBottom: 8,
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
  itemsContainer: {
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  itemRequester: {
    alignItems: 'flex-end',
  },
  itemRequesterText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemStatusText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addItemButton: {
    marginTop: 16,
  },
  actionButtonsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  mainActionButton: {
    marginBottom: 16,
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
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
  // Modal styles would go here
});