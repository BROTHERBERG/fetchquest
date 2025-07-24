import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'large', 
  color = colors.primary,
  overlay = false,
  fullScreen = false 
}: LoadingStateProps) {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    overlay && styles.overlay,
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

// Inline loading for buttons and small components
export function InlineLoading({ 
  size = 'small', 
  color = colors.white 
}: Pick<LoadingStateProps, 'size' | 'color'>) {
  return <ActivityIndicator size={size} color={color} />;
}

// Loading with custom content
export function LoadingWithContent({ 
  children, 
  loading, 
  loadingComponent,
  overlay = false 
}: { 
  children: React.ReactNode; 
  loading: boolean; 
  loadingComponent?: React.ReactNode;
  overlay?: boolean;
}) {
  if (!loading) {
    return <>{children}</>;
  }

  if (overlay) {
    return (
      <View style={styles.relative}>
        {children}
        <View style={styles.overlayContainer}>
          {loadingComponent || <LoadingState overlay />}
        </View>
      </View>
    );
  }

  return <>{loadingComponent || <LoadingState />}</>;
}

// Skeleton loading component
export function SkeletonLoader({ 
  width, 
  height, 
  borderRadius = 4,
  style 
}: { 
  width: number | string; 
  height: number; 
  borderRadius?: number;
  style?: any;
}) {
  return (
    <View 
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style
      ]} 
    />
  );
}

// Common skeleton patterns
export function TaskCardSkeleton() {
  return (
    <View style={styles.taskCardSkeleton}>
      <SkeletonLoader width="60%" height={20} style={styles.skeletonTitle} />
      <SkeletonLoader width="40%" height={16} style={styles.skeletonPrice} />
      <SkeletonLoader width="100%" height={40} style={styles.skeletonDescription} />
      <View style={styles.skeletonFooter}>
        <SkeletonLoader width={60} height={16} />
        <SkeletonLoader width={80} height={16} />
      </View>
    </View>
  );
}

export function UserAvatarSkeleton({ size = 40 }: { size?: number }) {
  return (
    <SkeletonLoader 
      width={size} 
      height={size} 
      borderRadius={size / 2}
    />
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  relative: {
    position: 'relative',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  skeleton: {
    backgroundColor: colors.border,
    opacity: 0.7,
  },
  taskCardSkeleton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonTitle: {
    marginBottom: 8,
  },
  skeletonPrice: {
    marginBottom: 12,
  },
  skeletonDescription: {
    marginBottom: 16,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});