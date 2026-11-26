import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ShieldCheck, CheckCircle2, AlertCircle, Bot, ArrowRight } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { CvHealthMetrics } from '../cv.types';

export interface CvHealthIndexCardProps {
  metrics: CvHealthMetrics | null;
  onAuditPress: () => void;
}

export const CvHealthIndexCard: React.FC<CvHealthIndexCardProps> = ({
  metrics,
  onAuditPress,
}) => {
  if (!metrics) return null;

  const { score, level, completedSections, totalSections, auditItems } = metrics;

  const handleAudit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onAuditPress();
  };

  const topItems = auditItems.slice(0, 2);

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Heading style={styles.cardTitle}>Dossier Strength</Heading>
        <View style={styles.levelBadge}>
          <ShieldCheck size={12} color="#121212" />
          <Label style={styles.levelText}>{level}</Label>
        </View>
      </View>

      {/* Dark Inset Score & Progress Sub-Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreMetaRow}>
          <View style={styles.scoreBlock}>
            <Display style={styles.scoreNumber}>{score}</Display>
            <Body style={styles.scoreDenom}>/ 100</Body>
          </View>

          <View style={styles.completenessBadge}>
            <CheckCircle2 size={12} color="#B8F23E" />
            <Text style={styles.completenessText}>
              {completedSections} of {totalSections} Complete
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${score}%` }]} />
        </View>
      </View>

      {/* Key Audit Insights */}
      {topItems.length > 0 ? (
        <View style={styles.insightsList}>
          {topItems.map((item, idx) => (
            <View key={idx} style={styles.insightItem}>
              {item.type === 'strength' ? (
                <CheckCircle2 size={14} color="#B8F23E" style={styles.insightIcon} />
              ) : (
                <AlertCircle size={14} color="#FBBF24" style={styles.insightIcon} />
              )}
              <Body style={styles.insightText} numberOfLines={2}>
                <Text style={styles.insightStrong}>{item.section}:</Text> {item.message}
              </Body>
            </View>
          ))}
        </View>
      ) : null}

      {/* Primary Action: Audit with Hunter */}
      <Pressable
        onPress={handleAudit}
        style={state => [
          styles.auditBtn,
          state.pressed && styles.pressedFade,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRingLight
            : null,
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Review CV with Hunter AI">
        <View style={styles.auditBtnContent}>
          <Bot size={16} color="#121212" strokeWidth={2.3} />
          <Label style={styles.auditBtnLabel}>AUDIT WITH HUNTER</Label>
        </View>
        <ArrowRight size={15} color="#121212" strokeWidth={2.4} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#121212',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: '#2A2D26',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 18,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#B8F23E',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  levelText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.3,
  },
  scoreCard: {
    backgroundColor: '#1C1E1A',
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#2A2D26',
    gap: 12,
  },
  scoreMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  scoreBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  scoreDenom: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  completenessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(184, 242, 62, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(184, 242, 62, 0.3)',
  },
  completenessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B8F23E',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#2D3028',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  insightIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#D1D5DB',
  },
  insightStrong: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  auditBtn: {
    minHeight: 44,
    backgroundColor: '#B8F23E',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  auditBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  auditBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.4,
  },
  pressedFade: {
    opacity: 0.85,
  },
  webFocusRingLight: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#FFFFFF',
    outlineOffset: 2,
  } as any,
});
