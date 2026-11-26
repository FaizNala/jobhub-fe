import React, { useEffect, useCallback, useRef, useState } from 'react';
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
  useReducedMotion,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';

interface Props {
  onFinish?: () => void;
  minDurationMs?: number;
  isReady?: boolean;
}

/**
 * InteractiveSplashScreen (Option B: Minimalist Modern)
 * 
 * - Background: Pure White (#FFFFFF)
 * - Wordmark: Deep Obsidian Black (#121212) grotesk lettering ("jobhub")
 * - Accent: Vibrant Electric Lime (#B8F23E) punctuation dot
 * - Anti-Slop: Zero clutter, zero extra text, ultra-fast 650ms delight budget
 * - Responsive & Interactive: UI-thread Reanimated 60fps + Haptic Tap-to-skip
 * - Zero-Flicker Gatekeeper: Holds viewport until store hydration and route gate are resolved
 */
export function InteractiveSplashScreen({
  onFinish,
  minDurationMs = 650,
  isReady = true,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const hasFinishedRef = useRef(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Allow QA / Visual testing to inspect splash screen state
  const isHeld =
    typeof window !== 'undefined' &&
    (Boolean((window as any).__HOLD_SPLASH__) ||
      window.location?.search?.includes('splash=1'));
  const effectiveDuration = isHeld ? 999999 : minDurationMs;

  // Animated values
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(prefersReducedMotion ? 1 : 0.94);
  const logoOpacity = useSharedValue(prefersReducedMotion ? 1 : 0);
  const dotScale = useSharedValue(prefersReducedMotion ? 1 : 0);

  const handleComplete = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  const triggerExit = useCallback(() => {
    if (prefersReducedMotion) {
      handleComplete();
      return;
    }
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
  }, [containerOpacity, handleComplete, prefersReducedMotion]);

  const handleTapToSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    triggerExit();
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      logoOpacity.value = 1;
      logoScale.value = 1;
      dotScale.value = 1;
      return;
    }

    // 1. Entrance animation (immediate spring pop)
    logoOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
    logoScale.value = withSpring(1, { damping: 16, stiffness: 160 });

    // 2. Micro delayed spring for electric lime dot
    const dotTimer = setTimeout(() => {
      dotScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, 120);

    return () => {
      clearTimeout(dotTimer);
    };
  }, [dotScale, logoOpacity, logoScale, prefersReducedMotion]);

  // 3. Minimum duration timer
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, effectiveDuration);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [effectiveDuration]);

  // 4. Smoothly exit only when BOTH minimum duration has elapsed AND app is hydrated & ready
  useEffect(() => {
    if (minTimeElapsed && isReady) {
      triggerExit();
    }
  }, [minTimeElapsed, isReady, triggerExit]);

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
        style={({ focused }: any) => [
          styles.pressableArea,
          Platform.OS === 'web' && focused && styles.webFocusRing,
        ]}
        onPress={handleTapToSkip}
        accessibilityRole="button"
        accessibilityLabel="JobHub Splash Screen. Tap anywhere to skip."
        accessibilityHint="Dismisses splash screen and continues to app.">
        <View style={styles.content}>
          <Animated.View style={[styles.logoRow, logoAnimatedStyle]}>
            <Text style={styles.logoText}>jobhub</Text>
            <Animated.View style={[styles.dot, dotAnimatedStyle]} />
          </Animated.View>
        </View>

        {/* Micro subtle cue on web/mobile - ultra minimal */}
        <View style={styles.footer}>
          <Text style={styles.hintText}>Tap to skip</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } as any, default: {} }),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'Inter, system-ui, -apple-system, sans-serif',
    }),
    fontSize: 48,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -1.5,
    includeFontPadding: false,
    lineHeight: 52,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#B8F23E', // Signature Electric Lime
    marginLeft: 3,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textMuted,
    letterSpacing: 0.3,
  },
  webFocusRing: Platform.select({
    web: {
      outlineWidth: 2,
      outlineColor: '#121212',
      outlineStyle: 'solid',
      outlineOffset: -4,
    } as any,
    default: {},
  }),
});
