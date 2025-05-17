import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { STRIPE_PUBLISHABLE_KEY, MERCHANT_NAME, formatAmountForStripe, CURRENCY } from '@/config/stripe';
import { useTaskStore } from '@/store/task-store';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Flat platform fee of $2.50 per user
export const PLATFORM_FEE = 2.50;

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const { updatePaymentIntent } = useTaskStore();
  
  // Initialize Firebase Functions
  const functions = getFunctions();
  const createPaymentIntentFunction = httpsCallable(functions, 'createPaymentIntent');
  
  // Create a payment intent using Firebase Functions
  const initializePayment = async (taskId: string, amount: number, tipAmount = 0, userId: string) => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to make a payment');
      return { success: false };
    }

    setLoading(true);
    try {
      // Add platform fee to the total amount for the requester
      const totalAmount = formatAmountForStripe(amount + tipAmount + PLATFORM_FEE);
      
      // Call Firebase Function to create payment intent
      const result = await createPaymentIntentFunction({
        amount: totalAmount,
        currency: CURRENCY,
        metadata: {
          taskId,
          userId,
          tipAmount: formatAmountForStripe(tipAmount),
          platformFee: formatAmountForStripe(PLATFORM_FEE)
        }
      });
      
      // Extract client secret from response
      const { clientSecret, paymentIntentId } = result.data as { 
        clientSecret: string;
        paymentIntentId: string;
      };
      
      // Create a payment intent object for local state
      const paymentIntent = {
        id: paymentIntentId,
        taskId,
        amount,
        tipAmount,
        platformFee: PLATFORM_FEE,
        status: 'requires_payment_method',
        clientSecret,
        createdAt: new Date().toISOString(),
      };
      
      setLoading(false);
      return { success: true, paymentIntent };
    } catch (error) {
      console.error('Error initializing payment:', error);
      Alert.alert('Error', 'Failed to initialize payment');
      setLoading(false);
      return { success: false };
    }
  };

  const confirmPayment = async (taskId: string, paymentIntentId: string) => {
    setLoading(true);
    try {
      // In a real implementation, this would use the Stripe SDK to confirm payment
      // For now, we'll simulate a successful payment
      
      // Update the payment intent status
      updatePaymentIntent(paymentIntentId, { status: 'succeeded' });
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'Failed to process payment');
      setLoading(false);
      return { success: false, error: 'Failed to process payment' };
    }
  };

  return {
    loading,
    initializePayment,
    confirmPayment,
  };
};