import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowRight, Check, ChevronRight, RotateCcw } from 'lucide-react-native';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { Body, Heading, Label } from '@/components/atoms/typography';
import { Radius } from '@/constants/theme';
import { Job } from '../jobs.types';

interface MatchDeckEmptyProps {
  trackedCount: number;
  savedJobs: Job[];
  passedCount: number;
  onSelectJob: (job: Job) => void;
  onUndoLast?: () => void;
  onResetDeck: () => void;
}

export function MatchDeckEmpty({
  trackedCount,
  savedJobs,
  passedCount,
  onSelectJob,
  onUndoLast,
  onResetDeck,
}: MatchDeckEmptyProps) {
  const handleOpenTracker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.replace('/jobs');
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onResetDeck();
  };

  const handleUndo = () => {
    if (!onUndoLast) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onUndoLast();
  };

  return (
    <View style={styles.cardShell}>
      {/* Dark Editorial Summary Header */}
      <View style={styles.recapHeader}>
        <View style={styles.recapTopRow}>
          <View style={styles.doneIconBadge}>
            <Check size={14} color="#121212" strokeWidth={2.8} />
          </View>
          <Label style={styles.recapEyebrow}>DECK COMPLETE</Label>
        </View>

        <Heading style={styles.recapTitle}>Today's Triage Summary</Heading>

        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricValueHighlight}>{savedJobs.length}</Text>
            <Text style={styles.metricLabel}>Shortlisted</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBlock}>
            <Text style={styles.metricValue}>{passedCount}</Text>
            <Text style={styles.metricLabel}>Passed</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBlock}>
            <Text style={styles.metricValue}>{trackedCount}</Text>
            <Text style={styles.metricLabel}>Total Tracked</Text>
          </View>
        </View>
      </View>

      {/* Real Session Shortlist or Honest Empty Copy */}
      <ScrollView
        style={styles.bodyScroll}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {savedJobs.length > 0 ? (
          <>
            <Label style={styles.sectionLabel}>ADDED TO TRACKER THIS SESSION</Label>
            <View style={styles.savedList}>
              {savedJobs.map(job => (
                <Pressable
                  key={job.id}
                  onPress={() => onSelectJob(job)}
                  style={state => [
                    styles.savedRow,
                    state.pressed && styles.pressedRow,
                    Platform.OS === 'web' && (state as { focused?: boolean }).focused
                      ? styles.webFocusRing
                      : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Inspect ${job.title} at ${job.company}`}>
                  <CompanyLogo company={job.company} size={36} />
                  <View style={styles.savedInfoCol}>
                    <Text style={styles.savedTitle} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <Text style={styles.savedMeta} numberOfLines={1}>
                      {job.company} · {job.salary}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#5A5D54" strokeWidth={2} />
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noSavedBox}>
            <Label style={styles.sectionLabel}>NO ROLES SHORTLISTED</Label>
            <Body style={styles.noSavedBody}>
              You passed all roles in this round. You can undo your last choice or run through the curated list again anytime.
            </Body>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footerActions}>
        <Pressable
          onPress={handleOpenTracker}
          style={state => [
            styles.trackerBtn,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open Job Tracker">
          <Text style={styles.trackerBtnText}>OPEN JOB TRACKER ({trackedCount})</Text>
          <ArrowRight size={15} color="#121212" strokeWidth={2.4} />
        </Pressable>

        <View style={styles.secondaryRow}>
          {onUndoLast ? (
            <Pressable
              onPress={handleUndo}
              style={state => [
                styles.secondaryBtn,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Undo last decision">
              <RotateCcw size={14} color="#5A5D54" strokeWidth={2.1} />
              <Text style={styles.secondaryBtnText}>Undo Last</Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={handleReset}
            style={state => [
              styles.secondaryBtn,
              state.pressed && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Review matches again">
            <RotateCcw size={14} color="#5A5D54" strokeWidth={2.1} />
            <Text style={styles.secondaryBtnText}>Review Deck Again</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    overflow: 'hidden',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  recapHeader: {
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 10,
  },
  recapTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doneIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#B8F23E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B8F23E',
    letterSpacing: 0.8,
  },
  recapTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  metricBlock: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#262626',
    marginHorizontal: 10,
  },
  metricValueHighlight: {
    fontSize: 22,
    fontWeight: '800',
    color: '#B8F23E',
    fontVariant: ['tabular-nums'],
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    padding: 18,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5A5D54',
    letterSpacing: 0.6,
  },
  savedList: {
    gap: 8,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 11,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAF6',
    borderWidth: 1,
    borderColor: '#E5EAE0',
    minHeight: 56,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  pressedRow: {
    backgroundColor: '#EFFCD3',
    borderColor: '#B8F23E',
  },
  savedInfoCol: {
    flex: 1,
    gap: 2,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#121212',
  },
  savedMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5A5D54',
  },
  noSavedBox: {
    backgroundColor: '#F8FAF6',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E5EAE0',
    padding: 16,
    gap: 6,
  },
  noSavedBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
  },
  footerActions: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEFE7',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  trackerBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#B8F23E',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  trackerBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: 0.5,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5A5D54',
  },
  pressedFade: {
    opacity: 0.8,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
