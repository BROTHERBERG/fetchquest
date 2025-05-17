import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';

interface TipSelectorProps {
  baseAmount: number;
  onTipChange: (tipAmount: number) => void;
}

export const TipSelector = ({ baseAmount, onTipChange }: TipSelectorProps) => {
  const [selectedTipIndex, setSelectedTipIndex] = useState<number | null>(null);
  
  // Predefined tip percentages
  const tipPercentages = [0, 5, 10, 15, 20];
  
  const handleSelectTip = (index: number) => {
    setSelectedTipIndex(index);
    const tipAmount = calculateTipAmount(tipPercentages[index]);
    onTipChange(tipAmount);
  };
  
  const calculateTipAmount = (percentage: number): number => {
    return (baseAmount * percentage) / 100;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Tip</Text>
      <Text style={styles.subtitle}>
        Tips are optional and go directly to the adventurer who completes your quest.
      </Text>
      
      <View style={styles.tipOptions}>
        {tipPercentages.map((percentage, index) => (
          <Pressable
            key={index}
            style={[
              styles.tipOption,
              selectedTipIndex === index && styles.selectedTipOption
            ]}
            onPress={() => handleSelectTip(index)}
          >
            <Text 
              style={[
                styles.tipPercentage,
                selectedTipIndex === index && styles.selectedTipText
              ]}
            >
              {percentage === 0 ? 'No Tip' : `${percentage}%`}
            </Text>
            
            {percentage > 0 && (
              <Text 
                style={[
                  styles.tipAmount,
                  selectedTipIndex === index && styles.selectedTipText
                ]}
              >
                {formatCurrency(calculateTipAmount(percentage))}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
      
      <View style={styles.infoContainer}>
        <DollarSign size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          100% of your tip goes to the adventurer. No platform fees are charged on tips.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  tipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tipOption: {
    flex: 1,
    minWidth: '18%',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTipOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipAmount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedTipText: {
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});