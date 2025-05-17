import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { X, MapPin, Calendar, DollarSign, Clock, Award } from 'lucide-react-native';
import { TaskFeedback } from './TaskFeedback';
import { TaskVerificationModal } from './TaskVerificationModal';
import { Button } from './Button';
import { formatCurrency } from '@/utils/format';

interface TaskDetailsModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onAccept?: (task: Task) => void;
  onSubmitCompletion?: (task: Task, completionImages: string[]) => Promise<void>;
  onVerify?: (task: Task, approved: boolean, feedback: string, rating?: number) => Promise<void>;
  onCancel?: (task: Task) => Promise<void>;
  currentUserId?: string;
}

export const TaskDetailsModal = ({
  task,
  visible,
  onClose,
  onAccept,
  onSubmitCompletion,
  onVerify,
  onCancel,
  currentUserId,
}: TaskDetailsModalProps) => {
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  if (!task) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRarityColor = (rarity: Task['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700';
      case 'epic':
        return '#9B59B6';
      case 'rare':
        return '#3498DB';
      case 'uncommon':
        return '#2ECC71';
      default:
        return '#95A5A6';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            {task.images && task.images.length > 0 && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: task.images[0] }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.header}>
              <Text style={styles.title}>{task.title}</Text>
              <View style={styles.priceContainer}>
                <DollarSign size={20} color={colors.primary} />
                <Text style={styles.price}>{formatCurrency(task.price)}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.infoText}>{task.location.address}</Text>
              </View>

              <View style={styles.infoRow}>
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Award size={20} color={getRarityColor(task.rarity)} />
                <Text style={[styles.infoText, { color: getRarityColor(task.rarity) }]}>
                  {task.rarity.charAt(0).toUpperCase() + task.rarity.slice(1)}
                </Text>
              </View>

              {task.isUrgent && (
                <View style={styles.urgentBadge}>
                  <Clock size={16} color="white" />
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              )}

              {task.feedback && <TaskFeedback task={task} />}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>
            </View>

            <View style={styles.rewardsContainer}>
              <Text style={styles.rewardsTitle}>Rewards</Text>
              <View style={styles.rewardsRow}>
                <View style={styles.rewardItem}>
                  <DollarSign size={24} color={colors.primary} />
                  <Text style={styles.rewardValue}>{formatCurrency(task.price)}</Text>
                  <Text style={styles.rewardLabel}>Payment</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Award size={24} color={colors.primary} />
                  <Text style={styles.rewardValue}>{task.pointsReward}</Text>
                  <Text style={styles.rewardLabel}>Points</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {task.status === 'open' && onAccept && (
              <Button
                title="Accept Quest"
                onPress={() => onAccept(task)}
                style={styles.footerButton}
              />
            )}
            
            {task.status === 'assigned' && task.assigneeId === currentUserId && onSubmitCompletion && (
              <Button
                title="Submit Completion"
                onPress={() => onSubmitCompletion(task)}
                style={styles.footerButton}
                variant="secondary"
              />
            )}
            
            {task.status === 'pending_verification' && task.requesterId === currentUserId && onVerify && (
              <Button
                title="Verify Completion"
                onPress={() => setShowVerificationModal(true)}
                style={styles.footerButton}
                variant="primary"
              />
            )}

            <TaskVerificationModal
              task={task}
              visible={showVerificationModal}
              onClose={() => setShowVerificationModal(false)}
              onVerify={async (task, approved, feedback, rating) => {
                setIsVerifying(true);
                try {
                  await onVerify(task, approved, feedback, rating);
                  setShowVerificationModal(false);
                } finally {
                  setIsVerifying(false);
                }
              }}
              isLoading={isVerifying}
            />
            
            {(task.status === 'assigned' || task.status === 'pending_verification') && 
             ((task.assigneeId === currentUserId) || (task.requesterId === currentUserId)) && 
             onCancel && (
              <Button
                title="Cancel Quest"
                onPress={() => onCancel(task)}
                style={[styles.footerButton, styles.cancelButton]}
                variant="danger"
              />
            )}
          </View>
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
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  urgentText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  descriptionContainer: {
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  rewardsContainer: {
    padding: 16,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 4,
  },
  rewardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerButton: {
    width: '100%',
    marginBottom: 8,
  },
  verificationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  rejectButton: {
    flex: 1,
  },
  approveButton: {
    flex: 1,
  },
  cancelButton: {
    marginTop: 8,
  },
});
