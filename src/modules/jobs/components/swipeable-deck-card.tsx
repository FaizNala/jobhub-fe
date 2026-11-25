import React, { forwardRef, useImperativeHandle } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  ReduceMotion,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';
import { Check, X } from 'lucide-react-native';

export type SwipeDirection = 'left' | 'right';

export interface SwipeableDeckCardHandle {
  triggerSwipe: (direction: SwipeDirection) => void;
}

interface SwipeableDeckCardProps {
  children: React.ReactNode;
  dragProgressX: SharedValue<number>;
  swipeThreshold?: number;
  enabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeComplete: (direction: SwipeDirection) => void;
}

const SNAP_SPRING_CONFIG = {
  duration: 320,
  dampingRatio: 0.88,
  reduceMotion: ReduceMotion.System,
};

const EXIT_EASING = Easing.out(Easing.cubic);

function fireLightHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/**
 * Interactive top deck card driven by UI-thread pan physics.
 * Supports horizontal swipe-to-triage while yielding vertical drags to inner ScrollView content.
 */
export const SwipeableDeckCard = forwardRef<SwipeableDeckCardHandle, SwipeableDeckCardProps>(
  function SwipeableDeckCard(
    {
      children,
      dragProgressX,
      swipeThreshold = 96,
      enabled = true,
      onSwipeStart,
      onSwipeComplete,
    },
    ref,
  ) {
    const { width: windowWidth } = useWindowDimensions();
    const reducedMotion = useReducedMotion();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const cardOpacity = useSharedValue(1);
    const isDragging = useSharedValue(false);
    const hasCommitted = useSharedValue(false);
    const hasCrossedDetent = useSharedValue(false);

    const exitDistance = Math.max(460, Math.min(windowWidth, 640) * 1.25);

    const commitDismissal = (direction: SwipeDirection) => {
      'worklet';
      if (hasCommitted.get()) return;
      hasCommitted.set(true);
      isDragging.set(false);
      if (onSwipeStart) {
        scheduleOnRN(onSwipeStart);
      }

      if (reducedMotion) {
        dragProgressX.set(direction === 'right' ? swipeThreshold : -swipeThreshold);
        cardOpacity.set(
          withTiming(
            0,
            { duration: 140, easing: EXIT_EASING, reduceMotion: ReduceMotion.System },
            finished => {
              if (finished) {
                scheduleOnRN(onSwipeComplete, direction);
              }
            },
          ),
        );
        return;
      }

      const targetX = direction === 'right' ? exitDistance : -exitDistance;
      dragProgressX.set(
        withTiming(targetX, {
          duration: 220,
          easing: EXIT_EASING,
          reduceMotion: ReduceMotion.System,
        }),
      );
      translateY.set(
        withTiming(24, {
          duration: 220,
          easing: EXIT_EASING,
          reduceMotion: ReduceMotion.System,
        }),
      );
      translateX.set(
        withTiming(
          targetX,
          { duration: 220, easing: EXIT_EASING, reduceMotion: ReduceMotion.System },
          finished => {
            if (finished) {
              scheduleOnRN(onSwipeComplete, direction);
            }
          },
        ),
      );
    };

    useImperativeHandle(
      ref,
      () => ({
        triggerSwipe: (direction: SwipeDirection) => {
          if (!enabled || hasCommitted.get()) return;
          hasCommitted.set(true);
          isDragging.set(false);
          if (onSwipeStart) onSwipeStart();

          if (reducedMotion) {
            dragProgressX.set(direction === 'right' ? swipeThreshold : -swipeThreshold);
            cardOpacity.set(
              withTiming(
                0,
                { duration: 140, easing: EXIT_EASING, reduceMotion: ReduceMotion.System },
                finished => {
                  if (finished) {
                    scheduleOnRN(onSwipeComplete, direction);
                  }
                },
              ),
            );
            return;
          }

          const targetX = direction === 'right' ? exitDistance : -exitDistance;
          dragProgressX.set(
            withTiming(targetX, {
              duration: 240,
              easing: EXIT_EASING,
              reduceMotion: ReduceMotion.System,
            }),
          );
          translateY.set(
            withTiming(20, {
              duration: 240,
              easing: EXIT_EASING,
              reduceMotion: ReduceMotion.System,
            }),
          );
          translateX.set(
            withTiming(
              targetX,
              { duration: 240, easing: EXIT_EASING, reduceMotion: ReduceMotion.System },
              finished => {
                if (finished) {
                  scheduleOnRN(onSwipeComplete, direction);
                }
              },
            ),
          );
        },
      }),
      [
        cardOpacity,
        dragProgressX,
        enabled,
        exitDistance,
        hasCommitted,
        isDragging,
        onSwipeComplete,
        onSwipeStart,
        reducedMotion,
        swipeThreshold,
        translateX,
        translateY,
      ],
    );

    useAnimatedReaction(
      () => Math.abs(translateX.get()) >= swipeThreshold,
      (crossed, prevCrossed) => {
        if (crossed !== prevCrossed) {
          hasCrossedDetent.set(crossed);
          if (crossed && isDragging.get() && !hasCommitted.get()) {
            scheduleOnRN(fireLightHaptic);
          }
        }
      },
    );

    const panGesture = usePanGesture({
      enabled,
      activeOffsetX: [-12, 12],
      failOffsetY: [-12, 12],
      onBegin: () => {
        if (hasCommitted.get()) return;
        startX.set(translateX.get());
        isDragging.set(true);
      },
      onUpdate: event => {
        if (hasCommitted.get()) return;
        const nextX = startX.get() + event.translationX;
        translateX.set(nextX);
        translateY.set(reducedMotion ? 0 : event.translationY * 0.22);
        dragProgressX.set(nextX);
      },
      onDeactivate: event => {
        if (hasCommitted.get()) return;
        isDragging.set(false);

        if (event.canceled) {
          translateX.set(withSpring(0, SNAP_SPRING_CONFIG));
          translateY.set(withSpring(0, SNAP_SPRING_CONFIG));
          dragProgressX.set(withSpring(0, SNAP_SPRING_CONFIG));
          return;
        }

        const projectedX = translateX.get() + event.velocityX * 0.14;
        if (projectedX >= swipeThreshold) {
          commitDismissal('right');
        } else if (projectedX <= -swipeThreshold) {
          commitDismissal('left');
        } else {
          translateX.set(withSpring(0, { ...SNAP_SPRING_CONFIG, velocity: event.velocityX }));
          translateY.set(withSpring(0, SNAP_SPRING_CONFIG));
          dragProgressX.set(withSpring(0, { ...SNAP_SPRING_CONFIG, velocity: event.velocityX }));
        }
      },
    });

    const cardAnimatedStyle = useAnimatedStyle(() => {
      const x = translateX.get();
      const rotateDeg = reducedMotion
        ? 0
        : interpolate(x, [-220, 0, 220], [-9, 0, 9], Extrapolation.CLAMP);

      return {
        opacity: cardOpacity.get(),
        transform: [
          { translateX: x },
          { translateY: translateY.get() },
          { rotate: `${rotateDeg}deg` },
        ],
      };
    });

    const trackStampStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.get(),
        [18, swipeThreshold],
        [0, 1],
        Extrapolation.CLAMP,
      );
      const scale = reducedMotion
        ? 1
        : interpolate(translateX.get(), [18, swipeThreshold], [0.88, 1], Extrapolation.CLAMP);

      return {
        opacity,
        transform: [{ rotate: reducedMotion ? '0deg' : '-10deg' }, { scale }],
      };
    });

    const passStampStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.get(),
        [-18, -swipeThreshold],
        [0, 1],
        Extrapolation.CLAMP,
      );
      const scale = reducedMotion
        ? 1
        : interpolate(translateX.get(), [-18, -swipeThreshold], [0.88, 1], Extrapolation.CLAMP);

      return {
        opacity,
        transform: [{ rotate: reducedMotion ? '0deg' : '10deg' }, { scale }],
      };
    });

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.cardWrapper,
            cardAnimatedStyle,
            Platform.OS === 'web' ? ({ touchAction: 'pan-y', userSelect: 'none' } as any) : null,
          ]}>
          {children}

          {/* Right-Swipe Action Stamp: Dual-coded icon + label (WCAG AA 10.12:1) */}
          <Animated.View
            style={[styles.stampContainer, styles.trackStamp, trackStampStyle]}
            pointerEvents="none"
            accessibilityElementsHidden>
            <Check size={16} color="#1E4600" strokeWidth={2.8} />
            <Text style={styles.trackStampText}>TRACK JOB</Text>
          </Animated.View>

          {/* Left-Swipe Action Stamp: Dual-coded icon + label (WCAG AA 5.30:1+) */}
          <Animated.View
            style={[styles.stampContainer, styles.passStamp, passStampStyle]}
            pointerEvents="none"
            accessibilityElementsHidden>
            <X size={16} color="#991B1B" strokeWidth={2.8} />
            <Text style={styles.passStampText}>PASS</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    position: 'relative',
  },
  stampContainer: {
    position: 'absolute',
    top: 22,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  trackStamp: {
    left: 20,
    backgroundColor: '#EFFCD3',
    borderColor: '#2E6F00',
  },
  trackStampText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E4600',
    letterSpacing: 0.8,
  },
  passStamp: {
    right: 20,
    backgroundColor: '#FEE2E2',
    borderColor: '#B91C1C',
  },
  passStampText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#991B1B',
    letterSpacing: 0.8,
  },
});
