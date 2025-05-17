import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  CreditCard, 
  Plus, 
  CheckCircle, 
  Trash2, 
  Shield, 
  Info,
  MapPin
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/user-store';
import { PaymentMethod } from '@/types';
import { PLATFORM_FEE } from '@/hooks/use-stripe';
import { formatCurrency } from '@/utils/format';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { user, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to manage payment methods.</Text>
      </View>
    );
  }
  
  const paymentMethods = user.paymentMethods || [];
  
  const handleAddPaymentMethod = () => {
    // In a real app, this would open a Stripe payment sheet or navigate to a form
    setLoading(true);
    
    // Simulate adding a new payment method
    setTimeout(() => {
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        card: {
          brand: 'visa',
          last4: `${Math.floor(1000 + Math.random() * 9000)}`.slice(-4),
          expMonth: Math.floor(1 + Math.random() * 12),
          expYear: new Date().getFullYear() + Math.floor(1 + Math.random() * 5),
        },
        isDefault: paymentMethods.length === 0, // Make default if it's the first one
      };
      
      addPaymentMethod(newPaymentMethod);
      setLoading(false);
      
      Alert.alert(
        "Payment Method Added",
        "Your payment method has been successfully added.",
        [{ text: "OK" }]
      );
    }, 1000);
  };
  
  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            
            // Simulate removing a payment method
            setTimeout(() => {
              removePaymentMethod(paymentMethodId);
              setLoading(false);
              
              Alert.alert(
                "Payment Method Removed",
                "Your payment method has been successfully removed.",
                [{ text: "OK" }]
              );
            }, 500);
          }
        }
      ]
    );
  };
  
  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    setLoading(true);
    
    // Simulate setting a default payment method
    setTimeout(() => {
      setDefaultPaymentMethod(paymentMethodId);
      setLoading(false);
      
      Alert.alert(
        "Default Payment Method",
        "Your default payment method has been updated.",
        [{ text: "OK" }]
      );
    }, 500);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Payment Methods',
          headerLeft: () => (
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Payment Methods</Text>
          <Text style={styles.headerSubtitle}>
            Add and manage your payment methods for quest transactions
          </Text>
        </View>
        
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTypeContainer}>
                    <CreditCard size={20} color={colors.text} />
                    <Text style={styles.cardType}>
                      {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)}
                    </Text>
                  </View>
                  
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.cardNumber}>•••• •••• •••• {method.card.last4}</Text>
                
                <Text style={styles.cardExpiry}>
                  Expires {method.card.expMonth}/{method.card.expYear}
                </Text>
                
                <View style={styles.cardActions}>
                  {!method.isDefault && (
                    <Button
                      title="Set as Default"
                      onPress={() => handleSetDefaultPaymentMethod(method.id)}
                      variant="outline"
                      size="small"
                      icon={<CheckCircle size={16} color={colors.primary} />}
                      style={styles.cardActionButton}
                    />
                  )}
                  
                  <Button
                    title="Remove"
                    onPress={() => handleRemovePaymentMethod(method.id)}
                    variant="outline"
                    size="small"
                    icon={<Trash2 size={16} color={colors.error} />}
                    style={[styles.cardActionButton, styles.removeButton]}
                    textStyle={styles.removeButtonText}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CreditCard size={48} color={colors.textTertiary} />
              <Text style={styles.emptyStateTitle}>No Payment Methods</Text>
              <Text style={styles.emptyStateText}>
                Add a payment method to pay for quests and receive payments for completed quests.
              </Text>
            </View>
          )}
        </View>
        
        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          loading={loading}
          icon={<Plus size={20} color="white" />}
          style={styles.addButton}
        />
        
        <View style={styles.securityInfo}>
          <View style={styles.securityHeader}>
            <Shield size={20} color={colors.primary} />
            <Text style={styles.securityTitle}>Secure Payments</Text>
          </View>
          
          <Text style={styles.securityText}>
            Your payment information is securely stored and processed. We use industry-standard encryption to protect your sensitive data.
          </Text>
          
          <View style={styles.infoContainer}>
            <Info size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              FetchQuest charges a flat fee of {formatCurrency(PLATFORM_FEE)} per transaction to both the quest giver and adventurer.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  paymentMethodsContainer: {
    padding: 16,
    gap: 16,
  },
  paymentMethodCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardExpiry: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cardActionButton: {
    minWidth: 120,
  },
  removeButton: {
    borderColor: colors.error + '40',
  },
  removeButtonText: {
    color: colors.error,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  securityInfo: {
    margin: 16,
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
});