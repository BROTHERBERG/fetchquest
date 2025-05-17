import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Modal
} from 'react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Calendar, Clock, DollarSign, Info, Image as ImageIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskImagePicker } from '../ImagePicker';

interface BasicInfoStepProps {
  images: string[];
  setImages: (images: string[]) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  price: string;
  setPrice: (price: string) => void;
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void;
  dueTime: Date | null;
  setDueTime: (time: Date | null) => void;
  isUrgent: boolean;
  setIsUrgent: (isUrgent: boolean) => void;
  onNext: () => void;
  categories: any[];
}

export const BasicInfoStep = ({
  images,
  setImages,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  price,
  setPrice,
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  isUrgent,
  setIsUrgent,
  onNext,
  categories,
}: BasicInfoStepProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(dueDate || new Date());
  const [tempTime, setTempTime] = useState(dueTime || new Date());
  
  // Initialize date and time if they're null
  useEffect(() => {
    if (dueDate === null) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow);
      setTempDate(tomorrow);
    }
    
    if (dueTime === null) {
      const noon = new Date();
      noon.setHours(12, 0, 0, 0);
      setDueTime(noon);
      setTempTime(noon);
    }
  }, []);
  
  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
  };
  
  const handlePriceChange = (value: string) => {
    // Only allow numbers and decimal point
    const filteredValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (filteredValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }
    
    // Limit to 2 decimal places
    const parts = filteredValue.split('.');
    if (parts.length > 1 && parts[1].length > 2) {
      return;
    }
    
    setPrice(filteredValue);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'ios') {
        // For iOS, we'll set the date when the user confirms
      } else {
        // For Android, set immediately
        setDueDate(selectedDate);
      }
    }
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      setTempTime(selectedTime);
      if (Platform.OS === 'ios') {
        // For iOS, we'll set the time when the user confirms
      } else {
        // For Android, set immediately
        setDueTime(selectedTime);
      }
    }
  };
  
  const confirmIOSDateTime = () => {
    setDueDate(tempDate);
    setDueTime(tempTime);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };
  
  const cancelIOSDateTime = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Select a date';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (time: Date | null) => {
    if (!time) return 'Select a time';
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const isNextDisabled = !title || !description || !category || !price || price === '0';
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's your quest about?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a title for your quest"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Describe your quest</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide details about what you need help with"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={colors.textTertiary}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => {
            const isSelected = cat.id === category;
            const Icon = cat.icon;
            
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  isSelected && { backgroundColor: cat.color + '30' }
                ]}
                onPress={() => handleCategorySelect(cat.id)}
              >
                <View 
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: isSelected ? cat.color : colors.card }
                  ]}
                >
                  <Icon 
                    size={20} 
                    color={isSelected ? 'white' : colors.textSecondary} 
                  />
                </View>
                <Text 
                  style={[
                    styles.categoryText,
                    isSelected && { color: cat.color, fontWeight: '600' }
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reward</Text>
        <View style={styles.inputWithIcon}>
          <DollarSign size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter amount (USD)"
            value={price}
            onChangeText={handlePriceChange}
            keyboardType="decimal-pad"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Due Date & Time</Text>
        <TouchableOpacity 
          style={styles.inputWithIcon}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <Text 
            style={[
              styles.inputText, 
              !dueDate && styles.placeholderText
            ]}
          >
            {dueDate ? formatDate(dueDate) : 'Select a date'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.inputWithIcon, { marginTop: 12 }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Clock size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <Text 
            style={[
              styles.inputText, 
              !dueTime && styles.placeholderText
            ]}
          >
            {dueTime ? formatTime(dueTime) : 'Select a time'}
          </Text>
        </TouchableOpacity>
        
        {/* Date Picker Modal for iOS */}
        {Platform.OS === 'ios' && showDatePicker && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDatePicker}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={cancelIOSDateTime}>
                    <Text style={styles.modalCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Date</Text>
                  <TouchableOpacity onPress={confirmIOSDateTime}>
                    <Text style={styles.modalDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  style={styles.dateTimePicker}
                />
              </View>
            </View>
          </Modal>
        )}
        
        {/* Time Picker Modal for iOS */}
        {Platform.OS === 'ios' && showTimePicker && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showTimePicker}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={cancelIOSDateTime}>
                    <Text style={styles.modalCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Time</Text>
                  <TouchableOpacity onPress={confirmIOSDateTime}>
                    <Text style={styles.modalDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  style={styles.dateTimePicker}
                />
              </View>
            </View>
          </Modal>
        )}
        
        {/* Date Picker for Android */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        
        {/* Time Picker for Android */}
        {Platform.OS === 'android' && showTimePicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photos</Text>
        <TaskImagePicker
          images={images}
          onImagesChange={setImages}
          maxImages={5}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.urgentContainer}>
          <View style={styles.urgentTextContainer}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.urgentText}>Mark as Urgent Quest</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isUrgent ? styles.toggleButtonActive : styles.toggleButtonInactive
            ]}
            onPress={() => setIsUrgent(!isUrgent)}
          >
            <View 
              style={[
                styles.toggleCircle,
                isUrgent ? styles.toggleCircleActive : styles.toggleCircleInactive
              ]} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.urgentDescription}>
          Urgent quests are highlighted and shown at the top of the list. They typically offer higher rewards.
        </Text>
      </View>
      
      <Button
        title="Next"
        onPress={onNext}
        disabled={isNextDisabled}
        style={styles.nextButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  dateTimePicker: {
    height: 200,
  },
  urgentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgentTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  urgentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleButtonInactive: {
    backgroundColor: colors.border,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  toggleCircleActive: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  toggleCircleInactive: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  nextButton: {
    marginBottom: 40,
  },
});