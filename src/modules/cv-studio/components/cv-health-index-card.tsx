import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ShieldCheck, CheckCircle2, AlertCircle, Bot, ArrowRight } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
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
      {/* Top Header: Title on left, Badge on right with safe flex layout */}
      <View style={styles.headerRow}>
        <Heading style={styles.cardTitle}>Dossier Strength</Heading>
        <View style={styles.levelBadge}>
          <ShieldCheck size={12} color="#2F4F00" />
          <Label style={styles.levelText}>{level}</Label>
        </View>
      </View>

      {/* Score & Progress Section */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreMetaRow}>
          <View style={styles.scoreBlock}>
            <Display style={styles.scoreNumber}>{score}</Display>
            <Body style={styles.scoreDenom}>/ 100</Body>
          </View>

          <View style={styles.completenessBadge}>
            <CheckCircle2 size={12} color="#2F4F00" />
            <Text style={styles.completenessText}>
              {completedSections} of {totalSections} Sections Complete
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
                <CheckCircle2 size={13} color="#2F4F00" style={styles.insightIcon} />
              ) : (
                <AlertCircle size={13} color="#8A6508" style={styles.insightIcon} />
              )}
              <Body style={styles.insightText} numberOfLines={2}>
                <Text style={styles.insightStrong}>{item.section}:</Text> {item.message}
              </Body>
            </View>
          ))}
        </View>
      ) : null}

      {/* Action: Audit with Hunter */}
      <TouchableOpacity
        onPress={handleAudit}
        style={styles.auditBtn}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Review CV with Hunter AI">
        <View style={styles.auditBtnContent}>
          <Bot size={15} color="#121212" />
          <Label style={styles.auditBtnLabel}>Audit with Hunter</Label>
        </View>
        <ArrowRight size={13} color="#121212" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  levelText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2F4F00',
    letterSpacing: 0.3,
  },
  scoreCard: {
    backgroundColor: '#F9FAF7',
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E8ECDF',
    gap: 12,
  },
  scoreMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  scoreBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#121212',
    lineHeight: 30,
  },
  scoreDenom: {
    fontSize: 12,
    fontWeight: '600',
    color: '#73786B',
  },
  completenessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  completenessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E8ECDF',
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
    gap: 7,
  },
  insightIcon: {
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#3A3D34',
  },
  insightStrong: {
    fontWeight: '700',
    color: '#121212',
  },
  auditBtn: {
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E8ECDF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
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
    fontSize: 11.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.3,
  },
});
