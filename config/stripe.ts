import { Platform } from 'react-native';

// Stripe configuration
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R8E2SR0Q02kACG8ow5VXUKt9ANI4niZ0wJ4qvGfjQkqPM4Epb56JySYakJjvGiBBJzIJBq4yoHXPhgsSGA0uzXX00KyT8B8Bj';

// Merchant name that will appear in the payment sheet
export const MERCHANT_NAME = 'FetchQuest';

// Helper function to determine if Stripe is available on the platform
export const isStripeAvailable = () => {
  // Stripe is available on iOS, Android, and web
  return true;
};

// Currency code for payments
export const CURRENCY = 'cad';

// Format amount for Stripe (converts dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format amount from Stripe (converts cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};