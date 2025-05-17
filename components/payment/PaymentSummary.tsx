import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';

interface PaymentSummaryProps {
  amount: number;
  tipAmount: number;
  showPlatformFee?: boolean;
  isRequester?: boolean;
}

export const PaymentSummary = ({
  amount,
  tipAmount,
  showPlatformFee = true,
  isRequester = true,
}: PaymentSummaryProps) => {
  // Flat platform fee of $2.50 per user
  const platformFee = 2.50;
  
  // Calculate total based on whether this is for the requester or the adventurer
  const totalAmount = isRequester 
    ? amount + tipAmount + platformFee 
    : amount + tipAmount - platformFee;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Quest {isRequester ? 'Price' : 'Reward'}</Text>
        <Text style={styles.summaryValue}>{formatCurrency(amount)}</Text>
      </View>
      
      {tipAmount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tip</Text>
          <Text style={styles.summaryValue}>{formatCurrency(tipAmount)}</Text>
        </View>
      )}
      
      {showPlatformFee && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform Fee</Text>
          <Text style={styles.summaryValue}>
            {isRequester ? '+' : '-'}{formatCurrency(platformFee)}
          </Text>
        </View>
      )}
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
      </View>
      
      {showPlatformFee && (
        <Text style={styles.feeExplanation}>
          FetchQuest charges a flat fee of {formatCurrency(platformFee)} per transaction to both the quest giver and adventurer.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  feeExplanation: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
    lineHeight: 16,
  },
});