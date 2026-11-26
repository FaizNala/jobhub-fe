import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowRight, Bot, Calendar } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Label } from '@/components/atoms/typography';

interface CareerPulseCardProps {
  hasScheduledInterview?: boolean;
  nextInterviewCompany?: string;
  nextInterviewStage?: string;
  nextInterviewTime?: string;
  hunterDiscoveredCount?: number;
}

export function CareerPulseCard({
  hasScheduledInterview = false,
  nextInterviewCompany,
  nextInterviewStage,
  nextInterviewTime,
  hunterDiscoveredCount = 0,
}: CareerPulseCardProps) {
  const handleOpenTracker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/jobs?stage=interviewing' as any);
  };

  const handleOpenHunter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/agent');
  };

  const interviewHeadline = hasScheduledInterview && nextInterviewCompany
    ? `${nextInterviewStage || 'Active Interview'} · ${nextInterviewCompany}`
    : 'No upcoming interviews yet';

  const interviewSub = hasScheduledInterview && nextInterviewTime
    ? nextInterviewTime
    : 'Track shortlisted and applied roles in Pipeline Tracker';

  const hunterHeadline = hunterDiscoveredCount > 0
    ? `${hunterDiscoveredCount} ${hunterDiscoveredCount === 1 ? 'opportunity' : 'opportunities'} pending review`
    : 'No scouted roles queued yet';

  const hunterSub = hunterDiscoveredCount > 0
    ? 'Synced from your active Hunter queue'
    : 'Open AI Hunter to discover new matching roles';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Label style={styles.headerLabel}>Schedule & Pipeline</Label>
          <Text style={styles.headerSub}>Live Activity</Text>
        </View>

        {/* Row 1: Next Actionable Interview */}
        <Pressable
          onPress={handleOpenTracker}
          style={state => [
            styles.actionRow,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel="View interview schedule in Tracker">
          <View style={styles.iconCircle}>
            <Calendar size={18} color="#15803D" strokeWidth={2.2} />
          </View>

          <View style={styles.infoCol}>
            <View style={styles.labelRow}>
              <Text style={styles.rowTypeLabel}>Interview Loop</Text>
              {hasScheduledInterview ? <View style={styles.activeDot} /> : null}
            </View>
            <Text style={styles.mainTitle}>{interviewHeadline}</Text>
            <Text style={styles.subText}>{interviewSub}</Text>
          </View>

          <ArrowRight size={15} color="#5A5D54" />
        </Pressable>

        <View style={styles.divider} />

        {/* Row 2: Discovered Opportunities Feed */}
        <Pressable
          onPress={handleOpenHunter}
          style={state => [
            styles.actionRow,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open AI Hunter radar">
          <View style={[styles.iconCircle, styles.hunterIconCircle]}>
            <Bot size={18} color="#0369A1" strokeWidth={2.2} />
          </View>

          <View style={styles.infoCol}>
            <View style={styles.labelRow}>
              <Text style={styles.rowTypeLabel}>Discovered Matches</Text>
            </View>
            <Text style={styles.mainTitle}>{hunterHeadline}</Text>
            <Text style={styles.subText}>{hunterSub}</Text>
          </View>

          <ArrowRight size={15} color="#5A5D54" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.1,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
  },
  actionRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hunterIconCircle: {
    backgroundColor: '#E0F2FE',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTypeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5A5D54',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#15803D',
  },
  mainTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#121212',
  },
  subText: {
    fontSize: 11.5,
    color: '#5A5D54',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F3EA',
  },
  pressedFade: {
    opacity: 0.78,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
