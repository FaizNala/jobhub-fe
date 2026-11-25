import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, usePathname, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FloatingDock } from '@/components/organisms/floating-dock';
import { Colors } from '@/constants/theme';
import { NetworkListener } from '@/modules/network';
import { NetworkErrorModal, OfflineAmbientBanner } from '@/components/organisms/network-error-modal';
import { InteractiveSplashScreen } from '@/components/organisms/interactive-splash-screen';
import { useOnboardingStore } from '@/modules/onboarding';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const isHydrated = useOnboardingStore((state) => state.isHydrated);
  const setHydrated = useOnboardingStore((state) => state.setHydrated);

  const [isSplashActive, setIsSplashActive] = useState(true);

  const isExcludedFromDock =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/auth' ||
    pathname === '/onboarding' ||
    pathname === '/setup-profile';

  // 1. Hide native OS splash screen once root layout renders
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // 2. Track Zustand store hydration state
  useEffect(() => {
    if (useOnboardingStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return () => {
      unsub();
    };
  }, [setHydrated]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.rootContainer}>
          <NetworkListener />
          <OfflineAmbientBanner />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.light.background },
              animation: 'none',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="jobs" />
            <Stack.Screen name="agent" />
            <Stack.Screen name="cv" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="explore" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="setup-profile" />
            <Stack.Screen name="auth" />
          </Stack>
          {!isExcludedFromDock && <FloatingDock />}
          <NetworkErrorModal />

          {/* Minimalist Splash Screen with Zero-Flicker Gatekeeper */}
          {isSplashActive && (
            <InteractiveSplashScreen
              isReady={isHydrated}
              onFinish={() => setIsSplashActive(false)}
            />
          )}
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
