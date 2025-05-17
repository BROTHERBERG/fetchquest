import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CreditCard, Shield, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { PaymentMethod } from '@/types';
import { Button } from '@/components/Button';
import { PaymentSummary } from '@/components/payment/PaymentSummary';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { PLATFORM_FEE } from '@/hooks/use-stripe';

interface PaymentStepProps {
  price: string;
  paymentMethods?: PaymentMethod[];
  selectedPaymentMethodId?: string;
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
}

export const PaymentStep = ({
  price,
  paymentMethods = [],
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
}: PaymentStepProps) => {
  const priceValue = price ? parseFloat(price) : 0;
  
  return (
    <View style={styles.container}>
      <PaymentSummary 
        amount={priceValue}
        tipAmount={0}
        isRequester={true}
      />
      
      <PaymentMethodSelector
        paymentMethods={paymentMethods}
        selectedPaymentMethodId={selectedPaymentMethodId}
        onSelectPaymentMethod={onSelectPaymentMethod}
        onAddPaymentMethod={onAddPaymentMethod}
      />
      
      <View style={styles.securityInfo}>
        <View style={styles.securityHeader}>
          <Shield size={20} color={colors.primary} />
          <Text style={styles.securityTitle}>Secure Payment</Text>
        </View>
        
        <Text style={styles.securityText}>
          Your payment information is securely stored and processed. You will only be charged when an adventurer completes your quest.
        </Text>
        
        <View style={styles.infoContainer}>
          <Info size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Payment is held in escrow until the quest is completed to your satisfaction. A flat fee of {formatCurrency(PLATFORM_FEE)} is charged to both parties.
          </Text>
        </View>
      </View>
      
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By posting this quest, you agree to our Terms of Service and Community Guidelines. You authorize us to charge your payment method when the quest is completed.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  securityInfo: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
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
  termsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  termsText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});