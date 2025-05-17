import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { X, AlertCircle, CheckCircle2, Clock } from 'lucide-react-native';
import { Button } from './Button';
import { formatCurrency } from '@/utils/format';

interface TaskAcceptanceModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onAccept: (task: Task) => Promise<void>;
  isLoading?: boolean;
}

export const TaskAcceptanceModal = ({
  task,
  visible,
  onClose,
  onAccept,
  isLoading = false,
}: TaskAcceptanceModalProps) => {
  const [step, setStep] = useState<'confirm' | 'guidelines' | 'accepted'>('confirm');

  if (!task) return null;

  const handleAccept = async () => {
    try {
      await onAccept(task);
      setStep('accepted');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept the task. Please try again.');
    }
  };

  const renderConfirmStep = () => (
    <>
      <Text style={styles.title}>Accept this Quest?</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reward:</Text>
          <Text style={styles.infoValue}>{formatCurrency(task.price)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time Estimate:</Text>
          <Text style={styles.infoValue}>{task.timeEstimate || 'Not specified'}</Text>
        </View>
        {task.dueDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Due Date:</Text>
            <Text style={styles.infoValue}>
              {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Review Guidelines"
          onPress={() => setStep('guidelines')}
          style={styles.button}
        />
      </View>
    </>
  );

  const renderGuidelinesStep = () => (
    <>
      <Text style={styles.title}>Quest Guidelines</Text>
      <ScrollView style={styles.guidelinesContainer}>
        <View style={styles.guidelineItem}>
          <Clock size={24} color={colors.primary} />
          <View style={styles.guidelineContent}>
            <Text style={styles.guidelineTitle}>Time Management</Text>
            <Text style={styles.guidelineText}>
              Complete the quest within the specified timeframe. If you can't make it,
              communicate with the quest giver.
            </Text>
          </View>
        </View>

        <View style={styles.guidelineItem}>
          <AlertCircle size={24} color={colors.primary} />
          <View style={styles.guidelineContent}>
            <Text style={styles.guidelineTitle}>Safety First</Text>
            <Text style={styles.guidelineText}>
              Follow all safety guidelines and local regulations. Don't take unnecessary risks.
            </Text>
          </View>
        </View>

        <View style={styles.guidelineItem}>
          <CheckCircle2 size={24} color={colors.primary} />
          <View style={styles.guidelineContent}>
            <Text style={styles.guidelineTitle}>Quality Assurance</Text>
            <Text style={styles.guidelineText}>
              Document your work with photos. Make sure to meet all requirements specified
              in the quest description.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Accept Quest"
          onPress={handleAccept}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </>
  );

  const renderAcceptedStep = () => (
    <>
      <View style={styles.successIcon}>
        <CheckCircle2 size={64} color={colors.success} />
      </View>
      <Text style={styles.title}>Quest Accepted!</Text>
      <Text style={styles.successText}>
        You've successfully accepted this quest. Head to your active quests to get started!
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="View Active Quests"
          onPress={onClose}
          style={styles.button}
        />
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>

          {step === 'confirm' && renderConfirmStep()}
          {step === 'guidelines' && renderGuidelinesStep()}
          {step === 'accepted' && renderAcceptedStep()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: '50%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  button: {
    width: '100%',
  },
  guidelinesContainer: {
    maxHeight: 400,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  guidelineContent: {
    flex: 1,
    marginLeft: 16,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  guidelineText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
