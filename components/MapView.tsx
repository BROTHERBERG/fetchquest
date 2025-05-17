import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { MapPin } from 'lucide-react-native';
import { TaskMarker } from './TaskMarker';
import { TaskDetailsModal } from './TaskDetailsModal';
import * as Location from 'expo-location';
import MapViewClustering from 'react-native-map-clustering';

// Web fallback component
const MapViewFallback = ({ tasks }: { tasks: Task[] }) => {
  return (
    <View style={styles.fallbackContainer}>
      <MapPin size={48} color={colors.primary} />
      <Text style={styles.fallbackText}>Map view is not available on web</Text>
      <Text style={styles.fallbackSubtext}>
        {tasks.length} {tasks.length === 1 ? 'quest' : 'quests'} in this area
      </Text>
    </View>
  );
};

interface MapViewProps {
  tasks: Task[];
  onMarkerPress?: (task: Task) => void;
  showsUserLocation?: boolean;
  initialRegion?: Region;
  style?: any;
  searchRadius?: number; // in kilometers
  onSearchRadiusChange?: (radius: number) => void;
}

export const TaskMapView = ({ 
  tasks, 
  onMarkerPress, 
  showsUserLocation = false,
  initialRegion,
  style,
  searchRadius = 5, // default 5km radius
  onSearchRadiusChange
}: MapViewProps) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <MapPin size={48} color={colors.primary} />
        <Text style={styles.fallbackText}>Map view is not available on web</Text>
        <Text style={styles.fallbackSubtext}>
          {tasks.length} {tasks.length === 1 ? 'quest' : 'quests'} in this area
        </Text>
      </View>
    );
  }

  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion || {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Request location permission and get current location
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setCurrentRegion(region);
      mapRef.current?.animateToRegion(region);
    };

    if (!initialRegion) {
      getLocation();
    }
  }, [initialRegion]);

  useEffect(() => {
    // Filter tasks based on current region and search radius
    const filterTasks = () => {
      return tasks.filter(task => {
        const distance = getDistanceFromLatLonInKm(
          currentRegion.latitude,
          currentRegion.longitude,
          task.location.latitude,
          task.location.longitude
        );
        return distance <= searchRadius;
      });
    };

    setFilteredTasks(filterTasks());
  }, [tasks, currentRegion, searchRadius]);

  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleMarkerPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
    onMarkerPress?.(task);
  };

  const handleAcceptTask = (task: Task) => {
    // This will be implemented in the task acceptance flow
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      <MapViewClustering
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={showsUserLocation}
        initialRegion={currentRegion}
        onRegionChangeComplete={setCurrentRegion}
        clusterColor={colors.primary}
        radius={70}
        extent={512}
        nodeSize={64}
      >
        {filteredTasks.map(task => (
          <TaskMarker
            key={task.id}
            task={task}
            onPress={handleMarkerPress}
          />
        ))}
      </MapViewClustering>

      <View style={styles.radiusControl}>
        <Text style={styles.radiusLabel}>
          Search Radius: {searchRadius}km
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          value={searchRadius}
          onValueChange={(value) => {
            if (typeof value === 'number') {
              onSearchRadiusChange?.(Math.round(value));
            }
          }}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
        />
      </View>

      <TaskDetailsModal
        task={selectedTask}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAccept={handleAcceptTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  radiusControl: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radiusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    padding: 16,
  },
});