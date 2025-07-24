import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export interface AppError {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'firebase' | 'unknown';
  code?: string;
  details?: any;
  timestamp: Date;
}

export interface ErrorHandlerOptions {
  showAlert?: boolean;
  logError?: boolean;
  retryable?: boolean;
  onError?: (error: AppError) => void;
}

export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((
    originalError: any, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showAlert = true,
      logError = true,
      retryable = false,
      onError
    } = options;

    // Transform error to AppError format
    const appError: AppError = {
      message: getErrorMessage(originalError),
      type: getErrorType(originalError),
      code: getErrorCode(originalError),
      details: originalError,
      timestamp: new Date(),
    };

    setError(appError);

    // Log error
    if (logError) {
      console.error('Error handled:', appError);
    }

    // Show alert if requested
    if (showAlert) {
      showErrorAlert(appError, retryable);
    }

    // Call custom error handler
    if (onError) {
      onError(appError);
    }

    return appError;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsRetrying(false);
  }, []);

  const retry = useCallback(async (retryFn: () => Promise<any>) => {
    setIsRetrying(true);
    try {
      const result = await retryFn();
      clearError();
      return result;
    } catch (error) {
      handleError(error, { showAlert: true, retryable: true });
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [handleError, clearError]);

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retry,
  };
}

// Helper function to extract user-friendly error messages
function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  // Firebase Auth errors
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'firestore/permission-denied':
        return 'You do not have permission to perform this action.';
      case 'firestore/unavailable':
        return 'Service temporarily unavailable. Please try again.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  // Network errors
  if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
    return 'Network connection error. Please check your internet connection.';
  }

  // Validation errors
  if (error?.name === 'ValidationError') {
    return error.message || 'Invalid input provided.';
  }

  return 'An unexpected error occurred. Please try again.';
}

// Helper function to categorize error types
function getErrorType(error: any): AppError['type'] {
  if (error?.code?.startsWith('auth/')) {
    return 'auth';
  }

  if (error?.code?.startsWith('firestore/') || error?.code?.startsWith('storage/')) {
    return 'firebase';
  }

  if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
    return 'network';
  }

  if (error?.name === 'ValidationError') {
    return 'validation';
  }

  return 'unknown';
}

// Helper function to extract error codes
function getErrorCode(error: any): string | undefined {
  return error?.code || error?.status || undefined;
}

// Helper function to show appropriate error alerts
function showErrorAlert(error: AppError, retryable: boolean = false) {
  const buttons = retryable 
    ? [
        { text: 'Cancel', style: 'cancel' as const },
        { text: 'Retry', style: 'default' as const }
      ]
    : [{ text: 'OK', style: 'default' as const }];

  Alert.alert(
    getErrorTitle(error.type),
    error.message,
    buttons
  );
}

// Helper function to get appropriate error titles
function getErrorTitle(type: AppError['type']): string {
  switch (type) {
    case 'auth':
      return 'Authentication Error';
    case 'network':
      return 'Connection Error';
    case 'validation':
      return 'Invalid Input';
    case 'firebase':
      return 'Service Error';
    default:
      return 'Error';
  }
}

// Specialized hooks for common use cases
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    setLoading(true);
    clearError();

    try {
      const result = await operation();
      return result;
    } catch (err) {
      handleError(err, options);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  return {
    loading,
    error,
    execute,
    clearError,
  };
}

// Hook for API calls with automatic retry
export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { error, handleError, clearError, retry } = useErrorHandler();

  const executeWithRetry = useCallback(async <T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    setLoading(true);
    clearError();

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        const result = await apiCall();
        setRetryCount(0);
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // All retries failed
    handleError(lastError, options);
    setRetryCount(0);
    return null;
  }, [handleError, clearError, retry]);

  return {
    loading,
    error,
    retryCount,
    executeWithRetry,
    clearError,
  };
}