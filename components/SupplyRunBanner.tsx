import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ShoppingBag, ArrowRight, MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface SupplyRunBannerProps {
  onCreateSupplyRun?: () => void;
}

export const SupplyRunBanner = ({ onCreateSupplyRun }: SupplyRunBannerProps) => {
  const router = useRouter();
  
  const handleCreateSupplyRun = () => {
    if (onCreateSupplyRun) {
      onCreateSupplyRun();
    } else {
      // Navigate to create supply run page
      router.push('/create-supply-run');
    }
  };
  
  const handleViewSupplyRun = (id: string) => {
    // Navigate to supply run details
    router.push(`/supply-runs/${id}`);
  };
  
  // Mock data for nearby supply runs
  const nearbySupplyRuns = [
    {
      id: 'sr1',
      user: {
        name: 'Alex',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
      },
      destination: 'Grocery Store',
      departureTime: '15 min',
      location: '0.5 miles away'
    },
    {
      id: 'sr2',
      user: {
        name: 'Jamie',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
      },
      destination: 'Pharmacy',
      departureTime: '30 min',
      location: '0.8 miles away'
    }
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ShoppingBag size={16} color={colors.primary} />
          <Text style={styles.title}>Supply Runs</Text>
        </View>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateSupplyRun}
        >
          <Text style={styles.createButtonText}>I'm heading out</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Neighbors on the go near you</Text>
      
      <View style={styles.runsList}>
        {nearbySupplyRuns.map(run => (
          <TouchableOpacity 
            key={run.id}
            style={styles.runItem}
            onPress={() => handleViewSupplyRun(run.id)}
          >
            <Image 
              source={{ uri: run.user.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.runInfo}>
              <Text style={styles.runTitle}>
                {run.user.name} is going to {run.destination}
              </Text>
              <View style={styles.runDetails}>
                <View style={styles.timeContainer}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.runTime}>Leaving in {run.departureTime}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={12} color={colors.textSecondary} />
                  <Text style={styles.runLocation}>{run.location}</Text>
                </View>
              </View>
            </View>
            <ArrowRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  createButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  createButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  runsList: {
    gap: 8,
  },
  runItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  runInfo: {
    flex: 1,
  },
  runTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  runDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  runTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});