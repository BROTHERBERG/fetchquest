import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Task } from '@/types';
import { colors } from '@/constants/colors';
import { X, Camera, CheckCircle2, Upload } from 'lucide-react-native';
import { Button } from './Button';
import { TaskImagePicker } from './TaskImagePicker';

interface TaskCompletionModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Task, completionImages: string[]) => Promise<void>;
  isLoading?: boolean;
}

export const TaskCompletionModal = ({
  task,
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}: TaskCompletionModalProps) => {
  const [step, setStep] = useState<'checklist' | 'photos' | 'review' | 'success'>('checklist');
  const [completionImages, setCompletionImages] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    requirements: false,
    quality: false,
    communication: false,
    safety: false,
  });

  if (!task) return null;

  const isChecklistComplete = Object.values(checklist).every(value => value);

  const handleSubmit = async () => {
    if (completionImages.length === 0) {
      Alert.alert('Error', 'Please add at least one completion photo.');
      return;
    }

    try {
      await onSubmit(task, completionImages);
      setStep('success');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit completion. Please try again.');
    }
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderChecklistStep = () => (
    <>
      <Text style={styles.title}>Completion Checklist</Text>
      <ScrollView style={styles.checklistContainer}>
        <TouchableOpacity
          style={styles.checklistItem}
          onPress={() => toggleChecklistItem('requirements')}
        >
          <View style={[styles.checkbox, checklist.requirements && styles.checkboxChecked]}>
            {checklist.requirements && <CheckCircle2 size={20} color="white" />}
          </View>
          <View style={styles.checklistContent}>
            <Text style={styles.checklistTitle}>Requirements Met</Text>
            <Text style={styles.checklistText}>
              I have completed all requirements specified in the quest description.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checklistItem}
          onPress={() => toggleChecklistItem('quality')}
        >
          <View style={[styles.checkbox, checklist.quality && styles.checkboxChecked]}>
            {checklist.quality && <CheckCircle2 size={20} color="white" />}
          </View>
          <View style={styles.checklistContent}>
            <Text style={styles.checklistTitle}>Quality Standards</Text>
            <Text style={styles.checklistText}>
              The work meets or exceeds the expected quality standards.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checklistItem}
          onPress={() => toggleChecklistItem('communication')}
        >
          <View style={[styles.checkbox, checklist.communication && styles.checkboxChecked]}>
            {checklist.communication && <CheckCircle2 size={20} color="white" />}
          </View>
          <View style={styles.checklistContent}>
            <Text style={styles.checklistTitle}>Communication</Text>
            <Text style={styles.checklistText}>
              I have communicated any relevant updates or issues to the quest giver.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checklistItem}
          onPress={() => toggleChecklistItem('safety')}
        >
          <View style={[styles.checkbox, checklist.safety && styles.checkboxChecked]}>
            {checklist.safety && <CheckCircle2 size={20} color="white" />}
          </View>
          <View style={styles.checklistContent}>
            <Text style={styles.checklistTitle}>Safety Guidelines</Text>
            <Text style={styles.checklistText}>
              I followed all safety guidelines while completing the quest.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Next: Add Photos"
          onPress={() => setStep('photos')}
          disabled={!isChecklistComplete}
          style={styles.button}
        />
      </View>
    </>
  );

  const renderPhotosStep = () => (
    <>
      <Text style={styles.title}>Add Completion Photos</Text>
      <Text style={styles.subtitle}>
        Add photos to show that you've completed the quest. This will help the quest giver verify your work.
      </Text>
      
      <TaskImagePicker
        images={completionImages}
        onImagesChange={setCompletionImages}
        maxImages={4}
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={() => setStep('checklist')}
          variant="outline"
          style={[styles.button, { marginBottom: 8 }]}
        />
        <Button
          title="Next"
          onPress={() => setStep('review')}
          style={styles.button}
          disabled={completionImages.length === 0}
        />
      </View>
    </>
    <>
      <Text style={styles.title}>Add Completion Photos</Text>
      <Text style={styles.subtitle}>
        Add photos to show that you've completed the quest. This will help the quest giver verify your work.
      </Text>
      
      <TaskImagePicker
        images={completionImages}
        onImagesChange={setCompletionImages}
        maxImages={4}
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={() => setStep('checklist')}
          variant="outline"
          style={[styles.button, { marginBottom: 8 }]}
        />
        <Button
          title="Next"
          onPress={() => setStep('review')}
          style={styles.button}
          disabled={completionImages.length === 0}
        />
      </View>
    </>
    <>
      <Text style={styles.title}>Add Completion Photos</Text>
      <Text style={styles.subtitle}>
        Add photos showing the completed quest. This helps verify completion and maintain quality standards.
      </Text>

      <TaskImagePicker
        images={completionImages}
        onImagesChange={setCompletionImages}
        maxImages={4}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Next: Review"
          onPress={() => setStep('review')}
          disabled={completionImages.length === 0}
          style={styles.button}
        />
      </View>
    </>
  );

  const renderReviewStep = () => (
    <>
      <Text style={styles.title}>Review & Submit</Text>
      <ScrollView style={styles.reviewContainer}>
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Completion Photos</Text>
          <View style={styles.imageGrid}>
            {completionImages.map((uri) => (
              <View key={uri} style={styles.imagePreview}>
                <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Checklist</Text>
          {Object.entries(checklist).map(([key, value]) => (
            <View key={key} style={styles.reviewItem}>
              <CheckCircle2 size={20} color={value ? colors.success : colors.border} />
              <Text style={styles.reviewText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={() => setStep('photos')}
          variant="outline"
          style={[styles.button, { marginBottom: 8 }]}
        />
        <Button
          title="Submit Completion"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </>
    <>
      <Text style={styles.title}>Review & Submit</Text>
      <ScrollView style={styles.reviewContainer}>
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Completion Photos</Text>
          <View style={styles.imageGrid}>
            {completionImages.map((uri) => (
              <View key={uri} style={styles.imagePreview}>
                <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Checklist</Text>
          {Object.entries(checklist).map(([key, value]) => (
            <View key={key} style={styles.reviewItem}>
              <CheckCircle2 size={20} color={value ? colors.success : colors.border} />
              <Text style={styles.reviewText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={() => setStep('photos')}
          variant="outline"
          style={[styles.button, { marginBottom: 8 }]}
        />
        <Button
          title="Submit Completion"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </>
    <>
      <Text style={styles.title}>Review & Submit</Text>
      <ScrollView style={styles.reviewContainer}>
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Completion Photos</Text>
          <View style={styles.imageGrid}>
            {completionImages.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: image }} style={styles.previewImage} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Checklist</Text>
          {Object.entries(checklist).map(([key, value]) => (
            <View key={key} style={styles.reviewItem}>
              <CheckCircle2 size={16} color={colors.success} />
              <Text style={styles.reviewText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Submit Completion"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <View style={styles.successIcon}>
        <CheckCircle2 size={64} color={colors.success} />
      </View>
      <Text style={styles.title}>Quest Completed!</Text>
      <Text style={styles.successText}>
        Your quest completion has been submitted successfully. The quest giver will review
        and approve it soon.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Done"
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

          {step === 'checklist' && renderChecklistStep()}
          {step === 'photos' && renderPhotosStep()}
          {step === 'review' && renderReviewStep()}
          {step === 'success' && renderSuccessStep()}
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
    minHeight: '70%',
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
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  checklistContainer: {
    flex: 1,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checklistContent: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  checklistText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    width: '100%',
  },
  reviewContainer: {
    flex: 1,
  },
  reviewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imagePreview: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
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
