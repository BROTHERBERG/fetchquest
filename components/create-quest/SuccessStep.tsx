import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

interface SuccessStepProps {
  questTitle: string;
  onViewQuests: () => void;
  onBackToHome: () => void;
}

export const SuccessStep = ({
  questTitle,
  onViewQuests,
  onBackToHome,
}: SuccessStepProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.successIconContainer}>
        <CheckCircle size={80} color={colors.success} />
      </View>
      
      <Text style={styles.successTitle}>Quest Posted!</Text>
      
      <Text style={styles.successMessage}>
        Your quest <Text style={styles.questTitle}>"{questTitle}"</Text> has been successfully posted and is now available for adventurers to discover.
      </Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        
        <View style={styles.infoStep}>
          <View style={styles.infoStepNumber}>
            <Text style={styles.infoStepNumberText}>1</Text>
          </View>
          <Text style={styles.infoStepText}>
            Adventurers will see your quest and can choose to accept it
          </Text>
        </View>
        
        <View style={styles.infoStep}>
          <View style={styles.infoStepNumber}>
            <Text style={styles.infoStepNumberText}>2</Text>
          </View>
          <Text style={styles.infoStepText}>
            You'll receive a notification when someone accepts your quest
          </Text>
        </View>
        
        <View style={styles.infoStep}>
          <View style={styles.infoStepNumber}>
            <Text style={styles.infoStepNumberText}>3</Text>
          </View>
          <Text style={styles.infoStepText}>
            You can message the adventurer to discuss details
          </Text>
        </View>
        
        <View style={styles.infoStep}>
          <View style={styles.infoStepNumber}>
            <Text style={styles.infoStepNumberText}>4</Text>
          </View>
          <Text style={styles.infoStepText}>
            Once completed, you'll be prompted to make payment
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <Button
          title="View My Quests"
          onPress={onViewQuests}
          style={styles.viewQuestsButton}
        />
        
        <Button
          title="Back to Home"
          onPress={onBackToHome}
          variant="outline"
          style={styles.homeButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  successIconContainer: {
    marginTop: 32,
    marginBottom: 24,
    backgroundColor: colors.success + '20',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  questTitle: {
    fontWeight: '600',
    color: colors.text,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  infoStepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  infoStepText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  viewQuestsButton: {
    width: '100%',
  },
  homeButton: {
    width: '100%',
  },
});