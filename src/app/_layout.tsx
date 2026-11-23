import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { FloatingDock } from '@/components/organisms/floating-dock';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.rootContainer}>
        <AnimatedSplashOverlay />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.light.background },
            animation: 'none',
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="jobs" />
          <Stack.Screen name="agent" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="explore" />
        </Stack>
        <FloatingDock />
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
