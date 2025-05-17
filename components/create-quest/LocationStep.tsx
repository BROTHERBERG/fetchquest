import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { MapPin, Navigation, Home, Building, MapPinOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SimpleMapView } from '@/components/SimpleMapView';

interface LocationStepProps {
  location: string;
  setLocation: (location: string) => void;
  coordinates: { latitude: number; longitude: number } | null;
  setCoordinates: (coords: { latitude: number; longitude: number } | null) => void;
}

export const LocationStep = ({
  location,
  setLocation,
  coordinates,
  setCoordinates,
}: LocationStepProps) => {
  const [recentLocations] = useState([
    { id: '1', address: '123 Main St, San Francisco, CA', type: 'home', coords: { latitude: 37.7749, longitude: -122.4194 } },
    { id: '2', address: '456 Market St, San Francisco, CA', type: 'work', coords: { latitude: 37.7908, longitude: -122.3970 } },
    { id: '3', address: 'Golden Gate Park, San Francisco, CA', type: 'recent', coords: { latitude: 37.7694, longitude: -122.4862 } },
  ]);
  
  const [mapRegion, setMapRegion] = useState({
    latitude: coordinates?.latitude || 37.7749,
    longitude: coordinates?.longitude || -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [selectedPin, setSelectedPin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(coordinates);
  
  useEffect(() => {
    if (coordinates) {
      setSelectedPin(coordinates);
      setMapRegion({
        ...mapRegion,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }
  }, [coordinates]);
  
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color={colors.primary} />;
      case 'work':
        return <Building size={20} color={colors.secondary} />;
      default:
        return <MapPin size={20} color={colors.textSecondary} />;
    }
  };
  
  const handleMapPress = (event: any) => {
    if (Platform.OS === 'web') return;
    
    const { coordinate } = event.nativeEvent;
    setSelectedPin(coordinate);
    setCoordinates(coordinate);
    
    // In a real app, you would use reverse geocoding to get the address
    // For now, we'll just set a placeholder
    setLocation(`Location at ${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`);
  };
  
  const handleSelectRecentLocation = (item: any) => {
    setLocation(item.address);
    setCoordinates(item.coords);
    setSelectedPin(item.coords);
    setMapRegion({
      ...mapRegion,
      latitude: item.coords.latitude,
      longitude: item.coords.longitude,
    });
  };
  
  const handleGetCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      alert('Location services are only available on mobile devices');
      return;
    }
    
    try {
      const Location = require('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setSelectedPin(currentCoords);
      setCoordinates(currentCoords);
      setMapRegion({
        ...mapRegion,
        ...currentCoords,
      });
      
      // In a real app, you would use reverse geocoding to get the address
      setLocation(`Current location (${currentCoords.latitude.toFixed(6)}, ${currentCoords.longitude.toFixed(6)})`);
    } catch (error) {
      console.log('Error getting location:', error);
      alert('Could not get your current location. Please enter it manually.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quest Location</Text>
        <View style={styles.locationInputContainer}>
          <MapPin size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter address or location"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>
      
      <View style={styles.mapContainer}>
        {Platform.OS !== 'web' ? (
          <SimpleMapView
            tasks={[]}
            initialRegion={mapRegion}
            showsUserLocation={true}
            style={styles.map}
            onMapPress={handleMapPress}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              In a real app, a map would be displayed here to select a location
            </Text>
          </View>
        )}
        
        {selectedPin && Platform.OS !== 'web' && (
          <View style={[
            styles.selectedPinIndicator,
            {
              left: '50%',
              top: '50%',
            }
          ]}>
            <MapPin size={32} color={colors.primary} />
          </View>
        )}
        
        <Pressable 
          style={styles.currentLocationButton}
          onPress={handleGetCurrentLocation}
        >
          <Navigation size={20} color={colors.primary} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </Pressable>
      </View>
      
      <View style={styles.recentLocationsContainer}>
        <Text style={styles.sectionTitle}>Recent Locations</Text>
        
        {recentLocations.map((item) => (
          <Pressable
            key={item.id}
            style={styles.recentLocationItem}
            onPress={() => handleSelectRecentLocation(item)}
          >
            {getLocationIcon(item.type)}
            <Text style={styles.recentLocationText}>{item.address}</Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Location Tips</Text>
        <View style={styles.helpItem}>
          <Text style={styles.helpBullet}>•</Text>
          <Text style={styles.helpText}>Be as specific as possible with the address</Text>
        </View>
        <View style={styles.helpItem}>
          <Text style={styles.helpBullet}>•</Text>
          <Text style={styles.helpText}>Include any special instructions for finding the location</Text>
        </View>
        <View style={styles.helpItem}>
          <Text style={styles.helpBullet}>•</Text>
          <Text style={styles.helpText}>For remote quests, you can specify "Remote" or "Online"</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  locationInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    height: 200,
    borderRadius: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  selectedPinIndicator: {
    position: 'absolute',
    transform: [{ translateX: -16 }, { translateY: -32 }],
    zIndex: 10,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  recentLocationsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  recentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentLocationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  helpContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  helpBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
});