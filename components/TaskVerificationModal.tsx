import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Button } from './Button';

interface TaskVerificationModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onVerify: (task: Task, approved: boolean, feedback: string, rating?: number) => Promise<void>;
  isLoading?: boolean;
}

export const TaskVerificationModal = ({
  task,
  visible,
  onClose,
  onVerify,
  isLoading = false,
}: TaskVerificationModalProps) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  if (!task) return null;

  const handleVerify = async () => {
    if (!action) return;
    
    try {
      await onVerify(
        task,
        action === 'approve',
        feedback,
        action === 'approve' ? rating : undefined
      );
      setFeedback('');
      setRating(0);
      setAction(null);
      onClose();
    } catch (error) {
      // Handle error
    }
  };

  const renderRatingStars = () => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>Rate the completion:</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => setRating(value)}
            style={styles.star}
          >
            <Star
              size={32}
              color={colors.warning}
              fill={value <= rating ? colors.warning : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
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

          <Text style={styles.title}>
            {action === 'approve'
              ? 'Approve Completion'
              : action === 'reject'
              ? 'Reject Completion'
              : 'Verify Quest Completion'}
          </Text>

          {!action ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => setAction('reject')}
              >
                <AlertCircle size={32} color={colors.error} />
                <Text style={[styles.actionText, { color: colors.error }]}>
                  Reject
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => setAction('approve')}
              >
                <CheckCircle2 size={32} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>
                  Approve
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.scrollView}>
              {action === 'approve' && renderRatingStars()}

              <Text style={styles.feedbackLabel}>
                {action === 'approve' ? 'Add feedback (optional):' : 'Reason for rejection:'}
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder={
                  action === 'approve'
                    ? 'Great job! Thanks for...'
                    : 'Please fix the following issues...'
                }
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.buttonContainer}>
                <Button
                  title="Back"
                  onPress={() => setAction(null)}
                  variant="outline"
                  style={[styles.button, { marginBottom: 8 }]}
                />
                <Button
                  title={action === 'approve' ? 'Approve Quest' : 'Reject Quest'}
                  onPress={handleVerify}
                  variant={action === 'approve' ? 'primary' : 'danger'}
                  loading={isLoading}
                  style={styles.button}
                  disabled={action === 'reject' && !feedback}
                />
              </View>
            </ScrollView>
          )}
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
    maxHeight: '90%',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '45%',
  },
  approveButton: {
    backgroundColor: colors.success + '10',
  },
  rejectButton: {
    backgroundColor: colors.error + '10',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  scrollView: {
    marginTop: 16,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    padding: 4,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  feedbackInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    width: '100%',
  },
});
