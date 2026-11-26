import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { CheckCircle2, ChevronDown, ChevronUp, Terminal } from 'lucide-react-native';
import { HunterStatusStep } from '../hunter.types';
import { Body, Label } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

interface HunterStatusTickerProps {
  steps: HunterStatusStep[];
  isHunting?: boolean;
}

export function HunterStatusTicker({ steps, isHunting }: HunterStatusTickerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const reducedMotion = useReducedMotion();
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (isHunting && !reducedMotion) {
      pulseOpacity.value = 0.4;
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.35, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = 1;
    }
    return () => {
      cancelAnimation(pulseOpacity);
    };
  }, [isHunting, pulseOpacity, reducedMotion]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!steps || steps.length === 0) return null;

  const completedCount = steps.filter(s => s.status === 'completed').length;

  return (
    <View style={styles.container}>
      {/* Ticker Header / Accordion trigger */}
      <Pressable
        onPress={() => setIsExpanded(prev => !prev)}
        style={state => [
          styles.headerRow,
          state.pressed && styles.pressedFade,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel="Toggle agent telemetry log">
        <View style={styles.headerLeft}>
          <View style={styles.terminalIconWrap} accessibilityElementsHidden>
            <Terminal size={13} color="#121212" />
          </View>
          <Animated.View
            style={[
              styles.pulseDot,
              isHunting ? styles.pulseDotActive : styles.pulseDotFinished,
              animatedDotStyle,
            ]}
            accessibilityElementsHidden
          />
          <Label style={styles.headerTitle}>
            {isHunting ? 'AGENT DISCOVERY IN PROGRESS' : 'DISCOVERY TELEMETRY LOG'}
          </Label>
        </View>

        <View style={styles.headerRight}>
          <Label style={styles.counterText}>
            {completedCount}/{steps.length} STEPS
          </Label>
          {isExpanded ? (
            <ChevronUp size={14} color="#5A5D54" />
          ) : (
            <ChevronDown size={14} color="#5A5D54" />
          )}
        </View>
      </Pressable>

      {/* Expanded Checklist Steps */}
      {isExpanded ? (
        <View style={styles.stepsList}>
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning =
              step.status === 'running' || (Boolean(isHunting) && idx === completedCount);

            return (
              <View key={step.id || `step-${idx}`} style={styles.stepRow}>
                <View style={styles.iconBox}>
                  {isCompleted ? (
                    <CheckCircle2 size={14} color="#2F4F00" />
                  ) : isRunning ? (
                    <ActivityIndicator size="small" color="#121212" />
                  ) : (
                    <View style={styles.pendingDot} />
                  )}
                </View>

                <Body
                  style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isRunning && styles.stepLabelRunning,
                  ]}>
                  {step.label}
                </Body>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9F5',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  headerRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#EFF3E8',
    gap: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  terminalIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pulseDotActive: {
    backgroundColor: '#15803D',
  },
  pulseDotFinished: {
    backgroundColor: '#2F4F00',
  },
  headerTitle: {
    fontSize: 10,
    letterSpacing: 0.6,
    color: '#121212',
    fontWeight: '700',
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterText: {
    fontSize: 10,
    color: '#5A5D54',
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  stepsList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  stepLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#5A5D54',
    flex: 1,
  },
  stepLabelCompleted: {
    color: '#121212',
    fontWeight: '500',
  },
  stepLabelRunning: {
    color: '#121212',
    fontWeight: '700',
  },
  pressedFade: {
    opacity: 0.8,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: -2,
  } as any,
});
