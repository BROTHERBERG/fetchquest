import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Plus, Minus, Layers, Navigation, Map } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MapViewMode } from '@/types';

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onMapTypeChange?: (mapType: MapViewMode) => void;
  onCenterToUser?: () => void;
  currentMapType?: MapViewMode;
  isLoading?: boolean;
}

export const MapControls = ({ 
  onZoomIn, 
  onZoomOut, 
  onMapTypeChange, 
  onCenterToUser,
  currentMapType = 'standard',
  isLoading = false
}: MapControlsProps) => {
  // Don't render on web
  if (Platform.OS === 'web') {
    return null;
  }
  
  const handleMapTypeChange = () => {
    if (!onMapTypeChange) return;
    
    // Cycle through map types
    switch (currentMapType) {
      case 'standard':
        onMapTypeChange('satellite');
        break;
      case 'satellite':
        onMapTypeChange('hybrid');
        break;
      case 'hybrid':
        onMapTypeChange('standard');
        break;
    }
  };
  
  return (
    <View style={styles.container}>
      {onZoomIn && (
        <TouchableOpacity style={styles.button} onPress={onZoomIn}>
          <Plus size={20} color={colors.text} />
        </TouchableOpacity>
      )}
      
      {onZoomOut && (
        <TouchableOpacity style={styles.button} onPress={onZoomOut}>
          <Minus size={20} color={colors.text} />
        </TouchableOpacity>
      )}
      
      {onMapTypeChange && (
        <TouchableOpacity style={styles.button} onPress={handleMapTypeChange}>
          <Layers size={20} color={colors.text} />
          <Text style={styles.mapTypeLabel}>
            {currentMapType === 'standard' ? 'Map' : 
             currentMapType === 'satellite' ? 'Sat' : 'Hyb'}
          </Text>
        </TouchableOpacity>
      )}
      
      {onCenterToUser && (
        <TouchableOpacity 
          style={[styles.button, styles.centerButton]} 
          onPress={onCenterToUser}
          disabled={isLoading}
        >
          <Navigation size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  centerButton: {
    borderBottomWidth: 0,
    backgroundColor: colors.primaryLight,
  },
  mapTypeLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
});