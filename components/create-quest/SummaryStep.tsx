import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { colors } from '@/constants/colors';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Award,
  Info
} from 'lucide-react-native';
import { categories } from '@/constants/categories';
import { formatCurrency, formatDate, formatTime } from '@/utils/format';

interface SummaryStepProps {
  title: string;
  description: string;
  category: string;
  location: string;
  price: string;
  setPrice: (price: string) => void;
  dueDate: string;
  isUrgent: boolean;
  setIsUrgent: (isUrgent: boolean) => void;
  pointsReward: number;
  rarityInfo: any;
}

export const SummaryStep = ({
  title,
  description,
  category,
  location,
  price,
  setPrice,
  dueDate,
  isUrgent,
  setIsUrgent,
  pointsReward,
  rarityInfo,
}: SummaryStepProps) => {
  const selectedCategory = categories.find(c => c.id === category);
  
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
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quest Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{title}</Text>
          
          <View style={styles.categoryContainer}>
            {selectedCategory && (
              <View style={styles.categoryBadge}>
                <View style={[styles.categoryIcon, { backgroundColor: selectedCategory.color + '20' }]}>
                  {React.createElement(selectedCategory.icon, { 
                    size: 16, 
                    color: selectedCategory.color,
                  })}
                </View>
                <Text style={styles.categoryText}>{selectedCategory.name}</Text>
              </View>
            )}
            
            <View style={[styles.rarityBadge, { backgroundColor: rarityInfo.color + '20' }]}>
              <Text style={[styles.rarityText, { color: rarityInfo.color }]}>
                {rarityInfo.name}
              </Text>
            </View>
          </View>
          
          <Text style={styles.summaryDescription}>{description}</Text>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{location}</Text>
          </View>
          
          {dueDate && (
            <View style={styles.detailRow}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {formatDate(dueDate)} at {formatTime(dueDate)}
              </Text>
            </View>
          )}
        </View>
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
        
        <View style={styles.rewardsContainer}>
          <View style={styles.rewardItem}>
            <View style={styles.rewardIconContainer}>
              <DollarSign size={20} color={colors.secondary} />
            </View>
            <View>
              <Text style={styles.rewardLabel}>Cash Reward</Text>
              <Text style={styles.rewardValue}>{formatCurrency(parseFloat(price) || 0)}</Text>
            </View>
          </View>
          
          <View style={styles.rewardItem}>
            <View style={[styles.rewardIconContainer, { backgroundColor: colors.primaryLight }]}>
              <Award size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.rewardLabel}>XP Points</Text>
              <Text style={styles.rewardValue}>+{pointsReward} XP</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.urgentContainer}>
          <View style={styles.urgentTextContainer}>
            <AlertTriangle size={20} color={colors.warning} />
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
      
      <View style={styles.infoSection}>
        <Info size={16} color={colors.textSecondary} style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Review your quest details carefully. You can still make changes before posting.
        </Text>
      </View>
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: 4,
  },
  rewardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
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
  infoSection: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});