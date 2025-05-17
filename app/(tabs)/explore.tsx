console.log('🔍 ExploreScreen loaded!');

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Animated,
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Search, 
  Filter, 
  MapPin, 
  Compass, 
  List,
  SlidersHorizontal,
  ShoppingBag
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/task-store';
import { SearchBar } from '@/components/SearchBar';
import { QuestCard } from '@/components/QuestCard';
import { CategoryList } from '@/components/CategoryList';
import { TaskMapView } from '@/components/MapView';
import { Task } from '@/types';
import { SupplyRunBanner } from '@/components/SupplyRunBanner';
import FetchQuestLogo from '@/components/FetchQuestLogo';

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { tasks, viewMode, setViewMode, categories } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    typeof params.category === 'string' ? params.category : null
  );
  const [mapView, setMapView] = useState(viewMode === 'map');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showUrgentOnly, setShowUrgentOnly] = useState(params.filter === 'urgent');
  const [showSupplyRuns, setShowSupplyRuns] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Set initial filter from params
  useEffect(() => {
    if (params.filter === 'true') {
      setShowFilters(true);
    } else if (params.filter === 'urgent') {
      setShowUrgentOnly(true);
    }
  }, [params.filter]);

  // Update view mode in store when mapView changes
  useEffect(() => {
    setViewMode(mapView ? 'map' : 'list');
  }, [mapView]);

  // Get user location for map
  const [searchRadius, setSearchRadius] = useState(5);
  const [userLocation, setUserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Request location permissions and get user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission',
            'FetchQuest needs your location to show you nearby quests. Please enable location services in your settings.',
            [{ text: 'OK' }]
          );
          return;
        }

        // Get initial location
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Set initial location
        setUserLocation(prev => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));

        // Watch location updates
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            setUserLocation(prev => ({
              ...prev,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }));
          }
        );

        // Cleanup subscription
        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);
  
  // Filter tasks
  const filteredTasks = tasks
    .filter(task => task.status === 'open')
    .filter(task => showUrgentOnly ? task.isUrgent : true)
    .filter(task => 
      selectedCategory !== null ? task.category === selectedCategory : true
    )
    .filter(task => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.location.address.toLowerCase().includes(query)
      );
    });
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskCardPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const toggleView = () => {
    setMapView(prev => !prev);
    if (selectedTask) {
      setSelectedTask(null);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const handleCreateSupplyRun = () => {
    router.push('/supply-run/create');
  };

  const handleTestVerification = () => {
    router.push('/test-verification');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: '',
          headerShown: true,
          headerTitle: () => (
            <View style={styles.logoContainer}>
              <FetchQuestLogo width={140} height={36} color="#818CF8" />
            </View>
          )
        }}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search quests..." 
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <SlidersHorizontal size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Test Button */}
      <TouchableOpacity 
        style={styles.testButton} 
        onPress={handleTestVerification}
      >
        <Text style={styles.testButtonText}>Test Task Verification</Text>
      </TouchableOpacity>
      
      {/* Category List */}
      <View style={styles.categoryContainer}>
        <CategoryList 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          hideLabels={true}
        />
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity 
          style={[styles.toggleButton, mapView && styles.toggleButtonActive]}
          onPress={toggleView}
        >
          <MapPin size={16} color={mapView ? colors.primary : colors.textSecondary} />
          <Text style={[styles.toggleText, mapView && styles.toggleTextActive]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, !mapView && styles.toggleButtonActive]}
          onPress={toggleView}
        >
          <List size={16} color={!mapView ? colors.primary : colors.textSecondary} />
          <Text style={[styles.toggleText, !mapView && styles.toggleTextActive]}>List</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content - Map or List View */}
      <View style={styles.contentContainer}>
        {mapView ? (
          <View style={styles.mapContainer}>
            <TaskMapView 
              tasks={filteredTasks}
              onMarkerPress={handleTaskPress}
              showsUserLocation={true}
              initialRegion={userLocation}
              style={StyleSheet.absoluteFillObject}
              searchRadius={searchRadius}
              onSearchRadiusChange={setSearchRadius}
            />
            
            {/* Task Preview (when a marker is selected) */}
            {selectedTask && (
              <TouchableOpacity 
                style={styles.taskPreviewContainer}
                onPress={() => handleTaskCardPress(selectedTask.id)}
                activeOpacity={0.9}
              >
                <View style={styles.taskPreviewContent}>
                  <View style={styles.taskPreviewHeader}>
                    <Text style={styles.taskPreviewTitle} numberOfLines={1}>
                      {selectedTask.title}
                    </Text>
                    <Text style={styles.taskPreviewReward}>${selectedTask.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.taskPreviewDescription} numberOfLines={2}>
                    {selectedTask.description}
                  </Text>
                  <View style={styles.taskPreviewFooter}>
                    <View style={styles.taskPreviewLocation}>
                      <MapPin size={14} color={colors.primary} />
                      <Text style={styles.taskPreviewLocationText} numberOfLines={1}>
                        {selectedTask.location.address}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView 
            style={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {showSupplyRuns && (
              <SupplyRunBanner onPress={handleCreateSupplyRun} />
            )}
            
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'Quest' : 'Quests'} Found
              </Text>
            </View>
            
            {filteredTasks.length > 0 ? (
              <View style={styles.questsList}>
                {filteredTasks.map(task => (
                  <QuestCard 
                    key={task.id}
                    quest={task}
                    onPress={() => handleTaskCardPress(task.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Quests Found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your filters or search query.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: -4,
    transform: [{ scale: 0.9 }],
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryContainer: {
    paddingVertical: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  toggleTextActive: {
    color: colors.primary,
  },
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    minHeight: 200,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContentContainer: {
    paddingBottom: 16,
  },
  listHeader: {
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  questsList: {
    gap: 8,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  taskPreviewContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskPreviewContent: {
    flex: 1,
  },
  taskPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  taskPreviewReward: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  taskPreviewDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  taskPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskPreviewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskPreviewLocationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  testButton: {
    backgroundColor: colors.warning,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
