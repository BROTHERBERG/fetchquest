import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Info,
  Check,
  Calendar,
  AlertCircle
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function CreateSupplyRunScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('15 minutes');
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [maxItems, setMaxItems] = useState(5);
  const [routeRadius, setRouteRadius] = useState(0.5); // miles
  
  const timeOptions = ['15 minutes', '30 minutes', '1 hour', '2 hours'];
  const itemOptions = [3, 5, 10, 'No limit'];
  const radiusOptions = [0.5, 1, 2, 5];
  
  const handleSubmit = () => {
    // Here you would save the supply run to your backend
    console.log('Creating supply run:', { 
      destination, 
      departureTime, 
      notes,
      maxItems: maxItems === 'No limit' ? null : maxItems,
      routeRadius
    });
    
    // Navigate to success screen or back to explore
    router.push('/(tabs)/explore');
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'Create Supply Run',
          headerBackTitle: 'Cancel',
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ShoppingBag size={24} color={colors.primary} />
              <Text style={styles.headerTitle}>I'm heading out</Text>
              <Text style={styles.headerSubtitle}>
                Let neighbors know you're making a trip and can pick up items for them
              </Text>
            </View>
            
            {/* Step indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, currentStep >= 1 && styles.activeStepDot]}>
                <Text style={[styles.stepNumber, currentStep >= 1 && styles.activeStepNumber]}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.stepDot, currentStep >= 2 && styles.activeStepDot]}>
                <Text style={[styles.stepNumber, currentStep >= 2 && styles.activeStepNumber]}>2</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.stepDot, currentStep >= 3 && styles.activeStepDot]}>
                <Text style={[styles.stepNumber, currentStep >= 3 && styles.activeStepNumber]}>3</Text>
              </View>
            </View>
            
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Where are you going?</Text>
                
                <View style={styles.inputContainer}>
                  <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter destination (e.g., Grocery Store)"
                    value={destination}
                    onChangeText={setDestination}
                  />
                </View>
                
                <Text style={styles.stepTitle}>When are you leaving?</Text>
                
                <View style={styles.timeOptions}>
                  {timeOptions.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        departureTime === time && styles.timeOptionSelected
                      ]}
                      onPress={() => setDepartureTime(time)}
                    >
                      <Text 
                        style={[
                          styles.timeOptionText,
                          departureTime === time && styles.timeOptionTextSelected
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Button 
                  title="Continue" 
                  onPress={nextStep} 
                  disabled={!destination}
                />
              </View>
            )}
            
            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>How many items can you pick up?</Text>
                
                <View style={styles.optionsGrid}>
                  {itemOptions.map(option => (
                    <TouchableOpacity
                      key={typeof option === 'number' ? option.toString() : option}
                      style={[
                        styles.gridOption,
                        maxItems === option && styles.gridOptionSelected
                      ]}
                      onPress={() => setMaxItems(option)}
                    >
                      <Text 
                        style={[
                          styles.gridOptionText,
                          maxItems === option && styles.gridOptionTextSelected
                        ]}
                      >
                        {typeof option === 'number' ? option.toString() : option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text style={styles.stepTitle}>How far from your route can you go?</Text>
                
                <View style={styles.optionsGrid}>
                  {radiusOptions.map(option => (
                    <TouchableOpacity
                      key={option.toString()}
                      style={[
                        styles.gridOption,
                        routeRadius === option && styles.gridOptionSelected
                      ]}
                      onPress={() => setRouteRadius(option)}
                    >
                      <Text 
                        style={[
                          styles.gridOptionText,
                          routeRadius === option && styles.gridOptionTextSelected
                        ]}
                      >
                        {option} {option === 1 ? 'mile' : 'miles'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.buttonRow}>
                  <Button 
                    title="Back" 
                    onPress={prevStep} 
                    type="secondary"
                    style={styles.backButton}
                  />
                  <Button 
                    title="Continue" 
                    onPress={nextStep} 
                    style={styles.continueButton}
                  />
                </View>
              </View>
            )}
            
            {currentStep === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Additional Information</Text>
                
                <View style={styles.notesContainer}>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add any notes about your trip (optional)"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
                
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryTitle}>Trip Summary</Text>
                  
                  <View style={styles.summaryItem}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.summaryText}>Going to: {destination}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Clock size={16} color={colors.primary} />
                    <Text style={styles.summaryText}>Leaving in: {departureTime}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <ShoppingBag size={16} color={colors.primary} />
                    <Text style={styles.summaryText}>
                      Can pick up: {maxItems === 'No limit' ? 'No limit on items' : `Up to ${maxItems} items`}
                    </Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.summaryText}>
                      Route radius: {routeRadius} {routeRadius === 1 ? 'mile' : 'miles'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoBox}>
                  <AlertCircle size={16} color={colors.primary} />
                  <Text style={styles.infoText}>
                    Neighbors within {routeRadius} {routeRadius === 1 ? 'mile' : 'miles'} will be notified about your trip and can request items
                  </Text>
                </View>
                
                <View style={styles.buttonRow}>
                  <Button 
                    title="Back" 
                    onPress={prevStep} 
                    type="secondary"
                    style={styles.backButton}
                  />
                  <Button 
                    title="Create Supply Run" 
                    onPress={handleSubmit} 
                    style={styles.submitButton}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeStepDot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeStepNumber: {
    color: 'white',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
    maxWidth: 60,
  },
  stepContainer: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  timeOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  gridOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gridOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  gridOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gridOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  continueButton: {
    flex: 2,
  },
  submitButton: {
    flex: 2,
  },
});