import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { CheckCircle2, ChevronDown, ChevronUp, Terminal, Loader2 } from 'lucide-react-native';
import { HunterStatusStep } from '../hunter.types';
import { Body, Label } from '@/components/atoms/typography';
import { Colors, Radius } from '@/constants/theme';

interface HunterStatusTickerProps {
  steps: HunterStatusStep[];
  isHunting?: boolean;
}

export function HunterStatusTicker({ steps, isHunting }: HunterStatusTickerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Animated pulse for live status dot
  const pulseOpacity = useSharedValue(0.4);

  React.useEffect(() => {
    if (isHunting) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [isHunting, pulseOpacity]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!steps || steps.length === 0) return null;

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const isFinished = completedCount === steps.length;

  return (
    <View style={styles.container}>
      {/* Ticker Header / Accordion trigger */}
      <Pressable
        onPress={() => setIsExpanded(prev => !prev)}
        style={styles.headerRow}
        accessibilityRole="button"
        accessibilityLabel="Toggle agent telemetry log">
        <View style={styles.headerLeft}>
          <View style={styles.terminalIconWrap}>
            <Terminal size={13} color="#121212" />
          </View>
          <Animated.View
            style={[
              styles.pulseDot,
              isHunting ? styles.pulseDotActive : styles.pulseDotFinished,
              animatedDotStyle,
            ]}
          />
          <Label style={styles.headerTitle}>
            {isHunting ? 'AGENT ORCHESTRATION IN PROGRESS' : 'DISCOVERY TELEMETRY LOG'}
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
            const isRunning = step.status === 'running' || (isHunting && idx === completedCount);

            return (
              <View key={step.id || `step-${idx}`} style={styles.stepRow}>
                <View style={styles.iconBox}>
                  {isCompleted ? (
                    <CheckCircle2 size={14} color="#2F4F00" />
                  ) : isRunning ? (
                    <Loader2 size={14} color="#121212" />
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
    borderColor: '#E2E6D9',
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#EFF3E8',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  terminalIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D8DEC9',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pulseDotActive: {
    backgroundColor: '#B8F23E',
  },
  pulseDotFinished: {
    backgroundColor: '#2F4F00',
  },
  headerTitle: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#121212',
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterText: {
    fontSize: 10,
    color: '#5A5D54',
    letterSpacing: 0.5,
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
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCD2C0',
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
});
