import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingState, LoadingWithContent } from './LoadingState';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { isLoading } = useUserStore();

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to external service in production
        console.error('App Error:', error, errorInfo);
      }}
    >
      <View style={styles.container}>
        <LoadingWithContent 
          loading={isLoading} 
          loadingComponent={
            <LoadingState 
              message="Initializing FetchQuest..." 
              fullScreen 
            />
          }
        >
          {children}
        </LoadingWithContent>
      </View>
    </ErrorBoundary>
  );
}

// Screen-level error boundary for individual screens
export function ScreenWrapper({ 
  children, 
  title 
}: { 
  children: React.ReactNode; 
  title?: string;
}) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <View style={styles.screenError}>
          <LoadingState 
            message={`Error loading ${title || 'screen'}: ${error.message}`}
          />
        </View>
      )}
    >
      <View style={styles.screenContainer}>
        {children}
      </View>
    </ErrorBoundary>
  );
}

// Component-level error boundary for smaller components
export function ComponentWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => 
        fallback || (
          <View style={styles.componentError}>
            <LoadingState 
              message="Component error" 
              size="small"
            />
          </View>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  screenError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  componentError: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
});