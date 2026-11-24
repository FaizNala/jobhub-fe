import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, usePathname, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { FloatingDock } from '@/components/organisms/floating-dock';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const isAuthScreen = pathname === '/login' || pathname === '/register' || pathname === '/auth';

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.rootContainer}>
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
