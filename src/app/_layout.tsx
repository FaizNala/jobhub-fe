import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, usePathname, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { FloatingDock } from '@/components/organisms/floating-dock';
import { Colors } from '@/constants/theme';
import { NetworkListener } from '@/modules/network';
import { NetworkErrorModal, OfflineAmbientBanner } from '@/components/organisms/network-error-modal';
import { InteractiveSplashScreen } from '@/components/organisms/interactive-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const isAuthScreen = pathname === '/login' || pathname === '/register' || pathname === '/auth';
  const [isSplashActive, setIsSplashActive] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
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
        </Stack>
        {!isAuthScreen && <FloatingDock />}
        <NetworkErrorModal />

        {/* Minimalist Anti-Slop Splash Screen (Option B) */}
        {isSplashActive && (
          <InteractiveSplashScreen onFinish={() => setIsSplashActive(false)} />
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
