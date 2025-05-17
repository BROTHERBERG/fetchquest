import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { CreditCard, Plus, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { PaymentMethod } from '@/types';
import { Button } from '@/components/Button';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId?: string;
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
}

export const PaymentMethodSelector = ({
  paymentMethods,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
}: PaymentMethodSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      
      {paymentMethods.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paymentMethodsContainer}
        >
          {paymentMethods.map((method) => (
            <Pressable
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethodId === method.id && styles.selectedCard
              ]}
              onPress={() => onSelectPaymentMethod(method.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>
                  {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)}
                </Text>
                {selectedPaymentMethodId === method.id && (
                  <CheckCircle size={16} color={colors.primary} />
                )}
              </View>
              
              <View style={styles.cardNumberContainer}>
                <CreditCard size={24} color={colors.text} />
                <Text style={styles.cardNumber}>•••• {method.card.last4}</Text>
              </View>
              
              <Text style={styles.cardExpiry}>
                Expires {method.card.expMonth}/{method.card.expYear}
              </Text>
              
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </Pressable>
          ))}
          
          <Pressable
            style={styles.addCardButton}
            onPress={onAddPaymentMethod}
          >
            <Plus size={24} color={colors.primary} />
            <Text style={styles.addCardText}>Add New</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <CreditCard size={40} color={colors.textTertiary} />
          <Text style={styles.emptyStateText}>No payment methods added yet</Text>
          <Button
            title="Add Payment Method"
            onPress={onAddPaymentMethod}
            variant="outline"
            icon={<Plus size={16} color={colors.primary} />}
            style={styles.addButton}
          />
        </View>
      )}
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
    marginBottom: 12,
  },
  paymentMethodsContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  paymentMethodCard: {
    width: 180,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  cardExpiry: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  defaultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.primary,
  },
  addCardButton: {
    width: 100,
    height: 120,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  addButton: {
    minWidth: 180,
  },
});