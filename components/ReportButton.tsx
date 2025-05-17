import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Flag, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from './Button';

interface ReportButtonProps {
  userId: string;
  contentType: 'user' | 'quest' | 'message';
  contentId: string;
  size?: 'small' | 'medium' | 'large';
}

export const ReportButton = ({ 
  userId, 
  contentType, 
  contentId,
  size = 'medium' 
}: ReportButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };
  
  const handleReport = () => {
    if (!reportReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for your report');
      return;
    }
    
    setLoading(true);
    
    // In a real app, this would send the report to a backend
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
      setReportReason('');
      
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. Our team will review it shortly.',
        [{ text: 'OK' }]
      );
    }, 1000);
  };
  
  return (
    <>
      <Pressable 
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Flag size={getIconSize()} color={colors.error} />
      </Pressable>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report</Text>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={colors.text} />
              </Pressable>
            </View>
            
            <Text style={styles.modalSubtitle}>
              {contentType === 'user' ? 'Why are you reporting this user?' : 
               contentType === 'quest' ? 'Why are you reporting this quest?' :
               'Why are you reporting this message?'}
            </Text>
            
            <View style={styles.reasonContainer}>
              <TextInput
                style={styles.reasonInput}
                value={reportReason}
                onChangeText={setReportReason}
                placeholder="Please provide details..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <Text style={styles.noteText}>
              Your report will be reviewed by our team. We take all reports seriously and will take appropriate action if necessary.
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Submit Report"
                onPress={handleReport}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  reasonContainer: {
    marginBottom: 16,
  },
  reasonInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    minHeight: 100,
  },
  noteText: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});