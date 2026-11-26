import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { Colors, Radius } from '@/constants/theme';
import { resolveSplashDurationMs } from '@/modules/onboarding';

interface Props {
  onFinish?: () => void;
  minDurationMs?: number;
  isReady?: boolean;
}

/**
 * InteractiveSplashScreen (Opsi A: Seamless Warm Linen)
 *
 * - Background: Warm Linen (#F4F6F0 / Colors.light.background) matching app canvas with zero tone jump
 * - Wordmark: Deep Obsidian Black (#121212) lettering ("jobhub") + Electric Lime (#B8F23E) dot
 * - Idempotent Exit: Prevents double fade triggers when tap-to-skip races hydration timer
 */
export function InteractiveSplashScreen({
  onFinish,
  minDurationMs,
  isReady = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const hasFinishedRef = useRef(false);
  const isExitingRef = useRef(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const isHeld =
    typeof window !== 'undefined' &&
    (Boolean((window as any).__HOLD_SPLASH__) ||
      window.location?.search?.includes('splash=1'));

  const effectiveDuration = resolveSplashDurationMs({
    minDurationMs,
    isWeb: Platform.OS === 'web',
    prefersReducedMotion,
    isHeld,
  });

  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(prefersReducedMotion ? 1 : 0.94);
  const logoOpacity = useSharedValue(prefersReducedMotion ? 1 : 0);
  const dotScale = useSharedValue(prefersReducedMotion ? 1 : 0);

  const handleComplete = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    onFinish?.();
  }, [onFinish]);

  const triggerExit = useCallback(() => {
    if (isExitingRef.current || hasFinishedRef.current) return;
    isExitingRef.current = true;

    if (prefersReducedMotion) {
      handleComplete();
      return;
    }

    containerOpacity.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleComplete)();
        }
      }
    );
  }, [containerOpacity, handleComplete, prefersReducedMotion]);

  const handleTapToSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    triggerExit();
  }, [triggerExit]);

  useEffect(() => {
    if (prefersReducedMotion) {
      logoOpacity.value = 1;
      logoScale.value = 1;
      dotScale.value = 1;
      return;
    }

    logoOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) });
    logoScale.value = withSpring(1, { damping: 16, stiffness: 160 });

    const dotTimer = setTimeout(() => {
      dotScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, 100);

    return () => {
      clearTimeout(dotTimer);
    };
  }, [dotScale, logoOpacity, logoScale, prefersReducedMotion]);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, effectiveDuration);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [effectiveDuration]);

  useEffect(() => {
    if (minTimeElapsed && isReady) {
      triggerExit();
    }
  }, [minTimeElapsed, isReady, triggerExit]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
        event.preventDefault();
        handleTapToSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [handleTapToSkip]);

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

  const footerBottom = Math.max(insets.bottom + 20, 32);
  const skipHintLabel =
    Platform.OS === 'web'
      ? 'Click or press Enter to continue'
      : 'Tap anywhere to continue';

  return (
    <Animated.View style={[styles.overlay, containerAnimatedStyle]}>
      <Pressable
        style={styles.pressableArea}
        onPress={handleTapToSkip}
        accessibilityRole="button"
        accessibilityLabel="JobHub Splash Screen. Activate to continue to app."
        accessibilityHint="Dismisses splash screen immediately.">
        {({ pressed, focused }: any) => (
          <>
            <View style={styles.content}>
              <Animated.View style={[styles.logoRow, logoAnimatedStyle]}>
                <Text style={styles.logoText}>jobhub</Text>
                <Animated.View style={[styles.dot, dotAnimatedStyle]} />
              </Animated.View>
            </View>

            <View style={[styles.footer, { bottom: footerBottom }]}>
              <View
                style={[
                  styles.hintPill,
                  pressed && styles.hintPressed,
                  Platform.OS === 'web' && focused && styles.webFocusRing,
                ]}>
                <Text style={styles.hintText}>{skipHintLabel}</Text>
              </View>
            </View>
          </>
        )}
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
    backgroundColor: Colors.light.background,
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
    ...Platform.select({
      web: { cursor: 'pointer', outlineStyle: 'none' } as any,
      default: {},
    }),
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
    backgroundColor: '#B8F23E',
    marginLeft: 3,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    alignItems: 'center',
  },
  hintPill: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintPressed: {
    opacity: 0.65,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textMuted,
    letterSpacing: 0.25,
  },
  webFocusRing: Platform.select({
    web: {
      outlineWidth: 2,
      outlineColor: '#121212',
      outlineStyle: 'solid',
      outlineOffset: 2,
    } as any,
    default: {},
  }),
});
