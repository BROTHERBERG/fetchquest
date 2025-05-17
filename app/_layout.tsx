import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { colors } from '@/constants/colors';
import '@/config/firebase';
import { FirebaseAuthProvider } from '@/components/FirebaseAuthProvider';

// Suppress warning only in Expo Go (Bridgeless)
if (__DEV__ && Platform.OS === 'ios') {
  LogBox.ignoreLogs([
    'Unsupported top level event type "topInsetsChange" dispatched',
  ]);
}

export default function RootLayout() {
  useEffect(() => {
    // Keep splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();

    // Hide splash screen after a delay
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 2000); // 2 seconds delay
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FirebaseAuthProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
              headerTitleAlign: 'center',
              title: '',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            <Stack.Screen name="test-verification" options={{ title: 'Test Verification' }} />
          </Stack>
        </SafeAreaProvider>
      </FirebaseAuthProvider>
    </GestureHandlerRootView>
  );
}