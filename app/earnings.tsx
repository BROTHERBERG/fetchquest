import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowDown, 
  ArrowUp,
  Wallet,
  BanknoteIcon,
  Calendar,
  Info
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/user-store';
import { formatCurrency, formatDate } from '@/utils/format';
import { PLATFORM_FEE } from '@/hooks/use-stripe';

// Mock transaction data
const mockTransactions = [
  {
    id: 'txn_1',
    type: 'payment',
    amount: 45.00,
    description: 'Payment for "Fix my leaky faucet" quest',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'txn_2',
    type: 'payment',
    amount: 25.00,
    description: 'Payment for "Help me move furniture" quest',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'txn_3',
    type: 'withdrawal',
    amount: -50.00,
    description: 'Withdrawal to bank account',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'txn_4',
    type: 'payment',
    amount: 30.00,
    description: 'Payment for "Walk my dog" quest',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];

export default function EarningsScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your earnings.</Text>
      </View>
    );
  }
  
  const handleWithdraw = () => {
    if (user.earnings <= 0) {
      Alert.alert("No Funds", "You don't have any available funds to withdraw.");
      return;
    }
    
    Alert.alert(
      "Withdraw Funds",
      `Are you sure you want to withdraw ${formatCurrency(user.earnings)} to your bank account?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Withdraw",
          onPress: () => {
            setLoading(true);
            
            // Simulate withdrawal process
            setTimeout(() => {
              setLoading(false);
              
              Alert.alert(
                "Withdrawal Initiated",
                `Your withdrawal of ${formatCurrency(user.earnings)} has been initiated. The funds should arrive in your bank account within 1-3 business days.`,
                [{ text: "OK" }]
              );
            }, 1500);
          }
        }
      ]
    );
  };
  
  const handleAddBankAccount = () => {
    // In a real app, this would navigate to a bank account setup screen
    Alert.alert(
      "Add Bank Account",
      "This would navigate to a bank account setup screen in a real app.",
      [{ text: "OK" }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Earnings',
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
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(user.earnings || 0)}</Text>
          
          <View style={styles.pendingContainer}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.pendingText}>
              Pending: {formatCurrency(user.pendingEarnings || 0)}
            </Text>
          </View>
          
          <Button
            title="Withdraw to Bank Account"
            onPress={handleWithdraw}
            loading={loading}
            disabled={user.earnings <= 0}
            icon={<BanknoteIcon size={20} color="white" />}
            style={styles.withdrawButton}
          />
          
          <Button
            title="Add Bank Account"
            onPress={handleAddBankAccount}
            variant="outline"
            icon={<Wallet size={20} color={colors.primary} />}
            style={styles.addBankButton}
          />
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.infoTitle}>How Earnings Work</Text>
          </View>
          
          <Text style={styles.infoText}>
            When you complete a quest, the payment is held in escrow until the quest giver confirms completion. Once confirmed, the payment moves to your available balance, minus the platform fee.
          </Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoItemIcon}>
              <Clock size={16} color={colors.secondary} />
            </View>
            <Text style={styles.infoItemText}>
              Pending earnings become available after quest completion is confirmed
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoItemIcon}>
              <DollarSign size={16} color={colors.secondary} />
            </View>
            <Text style={styles.infoItemText}>
              Platform fee is a flat {formatCurrency(PLATFORM_FEE)} per transaction
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoItemIcon}>
              <BanknoteIcon size={16} color={colors.secondary} />
            </View>
            <Text style={styles.infoItemText}>
              Withdrawals typically take 1-3 business days to process
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {mockTransactions.length > 0 ? (
            mockTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIconContainer}>
                  {transaction.type === 'payment' ? (
                    <ArrowDown size={20} color={colors.success} />
                  ) : (
                    <ArrowUp size={20} color={colors.primary} />
                  )}
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  
                  <View style={styles.transactionMeta}>
                    <Calendar size={12} color={colors.textTertiary} />
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
                    </Text>
                    
                    {transaction.status === 'pending' && (
                      <View style={styles.pendingBadge}>
                        <Clock size={12} color={colors.warning} />
                        <Text style={styles.pendingBadgeText}>Pending</Text>
                      </View>
                    )}
                    
                    {transaction.status === 'completed' && (
                      <View style={styles.completedBadge}>
                        <CheckCircle size={12} color={colors.success} />
                        <Text style={styles.completedBadgeText}>Completed</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <Text 
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'payment' 
                      ? styles.paymentAmount 
                      : styles.withdrawalAmount
                  ]}
                >
                  {transaction.type === 'payment' ? '+' : ''}
                  {formatCurrency(Math.abs(transaction.amount))}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsText}>
                No transactions yet. Complete quests to earn money!
              </Text>
            </View>
          )}
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
  balanceCard: {
    margin: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pendingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  withdrawButton: {
    marginBottom: 12,
  },
  addBankButton: {},
  infoCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  transactionsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
    marginRight: 8,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    color: colors.warning,
    marginLeft: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedBadgeText: {
    fontSize: 10,
    color: colors.success,
    marginLeft: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentAmount: {
    color: colors.success,
  },
  withdrawalAmount: {
    color: colors.primary,
  },
  emptyTransactions: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTransactionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});