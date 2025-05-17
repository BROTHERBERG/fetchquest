import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  DollarSign, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  X,
  Award,
  CreditCard,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  Scroll,
  MapPinned,
  ClipboardList,
  Coins
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { categories } from '@/constants/categories';
import { Task } from '@/types';
import { useTaskStore } from '@/store/task-store';
import { useUserStore } from '@/store/user-store';
import { calculateQuestRarity, questRarity } from '@/constants/rpg';
import { formatCurrency } from '@/utils/format';

// Step components
import { BasicInfoStep } from '@/components/create-quest/BasicInfoStep';
import { LocationStep } from '@/components/create-quest/LocationStep';
import { SummaryStep } from '@/components/create-quest/SummaryStep';
import { PaymentStep } from '@/components/create-quest/PaymentStep';
import { SuccessStep } from '@/components/create-quest/SuccessStep';

export default function CreateQuestScreen() {
  const router = useRouter();
  const { addTask } = useTaskStore();
  const { user, getDefaultPaymentMethod, requestTask } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [isUrgent, setIsUrgent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
  
  const paymentMethods = user?.paymentMethods || [];
  
  // Set default payment method if available
  useEffect(() => {
    const defaultMethod = getDefaultPaymentMethod();
    if (defaultMethod) {
      setSelectedPaymentMethodId(defaultMethod.id);
    }
  }, []);
  
  // Validation for each step
  const isStep1Valid = title.trim() !== '' && description.trim() !== '' && category !== '';
  const isStep2Valid = location.trim() !== '';
  const isStep3Valid = price.trim() !== '';
  const isStep4Valid = selectedPaymentMethodId !== '';
  
  // Calculate points reward based on price and urgency
  const calculatePointsReward = () => {
    if (!price) return 0;
    
    const basePoints = Math.round(parseFloat(price));
    const urgencyBonus = isUrgent ? 5 : 0;
    
    return basePoints + urgencyBonus;
  };
  
  const pointsReward = calculatePointsReward();
  
  // Calculate quest rarity
  const questRarityLevel = price ? calculateQuestRarity(parseFloat(price), isUrgent) : 'common';
  const rarityInfo = questRarity[questRarityLevel];
  
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1 && !isStep1Valid) {
      Alert.alert("Missing Information", "Please fill in all required fields to continue.");
      return;
    }
    
    if (currentStep === 2 && !isStep2Valid) {
      Alert.alert("Missing Location", "Please enter a location for your quest.");
      return;
    }
    
    if (currentStep === 3 && !isStep3Valid) {
      Alert.alert("Missing Reward", "Please enter a reward amount for your quest.");
      return;
    }
    
    if (currentStep === 4 && !isStep4Valid) {
      Alert.alert("Payment Method Required", "Please add a payment method to continue.");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  const handleAddPaymentMethod = () => {
    router.push('/payment-methods');
  };
  
  const handleSelectPaymentMethod = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
  };
  
  const handleSubmit = () => {
    if (!user) return;
    
    setLoading(true);
    
    // In a real app, would make an API call here
    setTimeout(() => {
      // Combine date and time
      const combinedDueDate = new Date(dueDate);
      if (dueTime) {
        combinedDueDate.setHours(
          dueTime.getHours(),
          dueTime.getMinutes(),
          dueTime.getSeconds()
        );
      }
      
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title,
        description,
        category,
        price: parseFloat(price),
        location: {
          address: location,
          latitude: coordinates?.latitude || 37.7749 + (Math.random() * 0.02 - 0.01),
          longitude: coordinates?.longitude || -122.4194 + (Math.random() * 0.02 - 0.01)
        },
        createdAt: new Date(),
        dueDate: combinedDueDate,
        status: 'open',
        requesterId: user.id,
        isUrgent,
        pointsReward,
        images,
        rarity: questRarityLevel
      };
      
      addTask(newTask);
      requestTask(); // Update user's task count
      
      setLoading(false);
      setShowSuccess(true);
    }, 1000);
  };
  
  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <Scroll size={24} color={colors.primary} />;
      case 2:
        return <MapPinned size={24} color={colors.primary} />;
      case 3:
        return <ClipboardList size={24} color={colors.primary} />;
      case 4:
        return <Coins size={24} color={colors.primary} />;
      default:
        return null;
    }
  };
  
  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return "Quest Details";
      case 2:
        return "Location";
      case 3:
        return "Quest Summary";
      case 4:
        return "Payment";
      default:
        return "";
    }
  };
  
  const renderStepContent = () => {
    if (showSuccess) {
      return (
        <SuccessStep 
          questTitle={title}
          onViewQuests={() => router.push('/my-tasks')}
          onBackToHome={() => router.push('/')}
        />
      );
    }
    
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            images={images}
            setImages={setImages}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
            dueDate={dueDate}
            setDueDate={setDueDate}
            dueTime={dueTime}
            setDueTime={setDueTime}
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            onNext={handleNextStep}
            categories={categories}
          />
        );
      case 2:
        return (
          <LocationStep
            location={location}
            setLocation={setLocation}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        );
      case 3:
        return (
          <SummaryStep
            title={title}
            description={description}
            category={category}
            location={location}
            price={price}
            setPrice={setPrice}
            dueDate={dueDate.toISOString()}
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            pointsReward={pointsReward}
            rarityInfo={rarityInfo}
          />
        );
      case 4:
        return (
          <PaymentStep
            price={price}
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectPaymentMethod={handleSelectPaymentMethod}
            onAddPaymentMethod={handleAddPaymentMethod}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Create a Quest',
          headerLeft: () => (
            <Pressable onPress={handlePrevStep} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      {!showSuccess && (
        <View style={styles.stepsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View key={index} style={styles.stepIndicatorContainer}>
              <View 
                style={[
                  styles.stepIndicator, 
                  currentStep >= index + 1 ? styles.stepActive : styles.stepInactive
                ]}
              >
                <Text 
                  style={[
                    styles.stepNumber,
                    currentStep >= index + 1 ? styles.stepNumberActive : styles.stepNumberInactive
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {index < totalSteps - 1 && (
                <View 
                  style={[
                    styles.stepConnector,
                    currentStep > index + 1 ? styles.stepConnectorActive : styles.stepConnectorInactive
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      )}
      
      {!showSuccess && (
        <View style={styles.stepTitleContainer}>
          {getStepIcon(currentStep)}
          <Text style={styles.stepTitle}>{getStepTitle(currentStep)}</Text>
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderStepContent()}
        </ScrollView>
        
        {!showSuccess && (
          <View style={styles.footer}>
            <Button
              title={currentStep < totalSteps ? "Next Step" : "Post Quest"}
              onPress={handleNextStep}
              disabled={
                (currentStep === 1 && !isStep1Valid) ||
                (currentStep === 2 && !isStep2Valid) ||
                (currentStep === 3 && !isStep3Valid) ||
                (currentStep === 4 && !isStep4Valid) ||
                loading
              }
              loading={loading}
              icon={currentStep < totalSteps ? <ArrowRight size={20} color="white" /> : null}
              style={styles.nextButton}
            />
            
            {currentStep > 1 && (
              <Button
                title="Previous"
                onPress={handlePrevStep}
                variant="outline"
                icon={<ChevronLeft size={20} color={colors.primary} />}
                style={styles.prevButton}
              />
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  backButton: {
    padding: 8
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepInactive: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepNumberInactive: {
    color: colors.textSecondary,
  },
  stepConnector: {
    height: 2,
    width: 40,
  },
  stepConnectorActive: {
    backgroundColor: colors.primary,
  },
  stepConnectorInactive: {
    backgroundColor: colors.border,
  },
  stepTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    paddingBottom: 24
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: 12,
  },
  nextButton: {
    width: '100%',
  },
  prevButton: {
    width: '100%',
  }
});