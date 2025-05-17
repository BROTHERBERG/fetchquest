import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet
} from 'react-native';
import { colors } from '@/constants/colors';
import { Task } from '@/types';
import { MapPin } from 'lucide-react-native';

// Web fallback component
const MapViewFallback = ({ tasks }: { tasks: Task[] }) => {
  return (
    <View style={styles.fallbackContainer}>
      <View style={styles.fallbackContent}>
        <MapPin size={48} color={colors.primary} />
        <Text style={styles.fallbackTitle}>Map View</Text>
        <Text style={styles.fallbackText}>
          Map view is only available on mobile devices.
        </Text>
        <Text style={styles.fallbackSubtext}>
          {tasks.length} quests in this area
        </Text>
      </View>
    </View>
  );
};

interface SimpleMapViewProps {
  tasks: Task[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress?: (task: Task) => void;
  mapType?: string;
  showsUserLocation?: boolean;
  style?: any;
  onMapPress?: (event: any) => void;
}

export const SimpleMapView = ({
  tasks,
  style,
}: SimpleMapViewProps) => {
  // Always use the web fallback to avoid import errors
  return <MapViewFallback tasks={tasks} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  fallbackContent: {
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});