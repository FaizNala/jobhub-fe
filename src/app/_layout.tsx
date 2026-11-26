import { useEffect, useState } from 'react';
import { DefaultTheme, ThemeProvider, usePathname, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FloatingDock } from '@/components/organisms/floating-dock';
import { Colors } from '@/constants/theme';
import { NetworkListener } from '@/modules/network';
import { NetworkErrorModal, OfflineAmbientBanner } from '@/components/organisms/network-error-modal';
import { InteractiveSplashScreen } from '@/components/organisms/interactive-splash-screen';
import { HYDRATION_FAILSAFE_MS, useOnboardingStore } from '@/modules/onboarding';

SplashScreen.preventAutoHideAsync().catch(() => {});

const DOCK_EXCLUDED_ROUTES = [
  '/login',
  '/register',
  '/auth',
  '/onboarding',
  '/setup-profile',
] as const;

export default function RootLayout() {
  const pathname = usePathname();

  const isHydrated = useOnboardingStore((state) => state.isHydrated);
  const setHydrated = useOnboardingStore((state) => state.setHydrated);

  const [isSplashActive, setIsSplashActive] = useState(true);

  const isExcludedFromDock = DOCK_EXCLUDED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Hide native OS splash screen once root layout renders
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // 2. Track Zustand store hydration state with a failsafe timeout so UI never deadlocks
  useEffect(() => {
    let settled = useOnboardingStore.persist.hasHydrated();
    if (settled) {
      setHydrated(true);
      return;
    }

    const failsafeTimer = setTimeout(() => {
      if (!settled) {
        settled = true;
        setHydrated(true);
      }
    }, HYDRATION_FAILSAFE_MS);

    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      settled = true;
      clearTimeout(failsafeTimer);
      setHydrated(true);
    });
    return () => {
      clearTimeout(failsafeTimer);
      unsub();
    };
  }, [setHydrated]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <ThemeProvider value={DefaultTheme}>
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
