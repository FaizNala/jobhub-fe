import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Props {
  onFinish?: () => void;
  minDurationMs?: number;
}

/**
 * InteractiveSplashScreen (Option B: Minimalist Modern)
 * 
 * - Background: Pure White (#FFFFFF)
 * - Wordmark: Deep Obsidian Black (#121212) grotesk lettering ("jobhub")
 * - Accent: Vibrant Electric Lime (#B8F23E) punctuation dot
 * - Anti-Slop: Zero clutter, zero extra text, ultra-fast 650ms delight budget
 * - Responsive & Interactive: UI-thread Reanimated 60fps + Haptic Tap-to-skip
 */
export function InteractiveSplashScreen({
  onFinish,
  minDurationMs = 650,
}: Props) {
  const hasFinishedRef = useRef(false);

  // Allow QA / Visual testing to inspect splash screen state
  const isHeld =
    typeof window !== 'undefined' &&
    (Boolean((window as any).__HOLD_SPLASH__) ||
      window.location?.search?.includes('splash=1'));
  const effectiveDuration = isHeld ? 999999 : minDurationMs;

  // Animated values
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.94);
  const logoOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0);

  const handleComplete = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  const triggerExit = useCallback(() => {
    containerOpacity.value = withTiming(
      0,
      {
        duration: 220,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleComplete)();
        }
      }
    );
  }, [containerOpacity, handleComplete]);

  const handleTapToSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    triggerExit();
  };

  useEffect(() => {
    // 1. Entrance animation (immediate spring pop)
    logoOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
    logoScale.value = withSpring(1, { damping: 16, stiffness: 160 });

    // 2. Micro delayed spring for electric lime dot
    const dotTimer = setTimeout(() => {
      dotScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, 120);

    // 3. Auto-exit after minimal duration (Zero-Wait Anti-Slop)
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, effectiveDuration);

    return () => {
      clearTimeout(dotTimer);
      clearTimeout(exitTimer);
    };
  }, [dotScale, effectiveDuration, logoOpacity, logoScale, triggerExit]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <Animated.View style={[styles.overlay, containerAnimatedStyle]}>
      <Pressable
        onPress={handleTapToSkip}
        style={styles.pressable}
        accessibilityRole="header"
        accessibilityLabel="JobHub splash screen. Tap to skip.">
        <Animated.View style={[styles.brandRow, logoAnimatedStyle]}>
          <Text style={styles.brandTitle}>jobhub</Text>
          <Animated.View style={[styles.brandDot, dotAnimatedStyle]} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
    elevation: 99999,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: -1.4,
    ...(Platform.OS === 'web'
      ? ({
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          userSelect: 'none',
        } as any)
      : {}),
  },
  brandDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#B8F23E',
    marginLeft: 3,
    marginBottom: 4,
  },
});
