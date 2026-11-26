import React from 'react';
import { Platform, View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MapPin, Calendar, ArrowRight, FileText } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { PipelineItem, PipelineStage } from '../pipeline.types';
import { Job } from '@/modules/jobs/jobs.types';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { Radius } from '@/constants/theme';

interface CircularScoreRingProps {
  score: number;
  size?: number;
}

function getScoreColorMeta(score: number) {
  if (score >= 90) {
    return {
      stroke: '#2E6F00',
      track: '#E2F7BE',
      fill: '#F4FDE8',
      textColor: '#1E4600',
      statusText: 'Top Match',
      statusColor: '#257000',
    };
  }
  if (score >= 80) {
    return {
      stroke: '#2F4F00',
      track: '#DCFCE7',
      fill: '#F0FDF4',
      textColor: '#14532D',
      statusText: 'Strong Fit',
      statusColor: '#15803D',
    };
  }
  if (score >= 70) {
    return {
      stroke: '#0C4A6E',
      track: '#E0F2FE',
      fill: '#F0F9FF',
      textColor: '#0C4A6E',
      statusText: 'Good Match',
      statusColor: '#0C4A6E',
    };
  }
  return {
    stroke: '#92400E',
    track: '#FEF3C7',
    fill: '#FFFBEB',
    textColor: '#92400E',
    statusText: 'Moderate Fit',
    statusColor: '#B45309',
  };
}

function CircularScoreRing({ score, size = 36 }: CircularScoreRingProps) {
  const strokeWidth = 3.2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const meta = getScoreColorMeta(score);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={meta.track}
          strokeWidth={strokeWidth}
          fill={meta.fill}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={meta.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.wheelScoreText, { color: meta.textColor }]}>{score}%</Text>
        </View>
      </View>
    </View>
  );
}

interface PipelineCardProps {
  item: PipelineItem;
  onViewDetail: (job: Job) => void;
  onManageStage: (item: PipelineItem) => void;
}

export function PipelineCard({
  item,
  onViewDetail,
  onManageStage,
}: PipelineCardProps) {
  const { job, stage } = item;

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onViewDetail(job);
  };

  const handleStageAction = (e: any) => {
    e.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onManageStage(item);
  };

  const getStageMeta = (s: PipelineStage) => {
    switch (s) {
      case 'offered':
        return { label: 'OFFER', bg: '#B8F23E', border: '#98DA18', text: '#121212' };
      case 'interviewing':
        return { label: 'INTERVIEW', bg: '#E7F6C4', border: '#C5E68B', text: '#1E4600' };
      case 'applied':
        return { label: 'APPLIED', bg: '#121212', border: '#121212', text: '#FFFFFF' };
      case 'shortlisted':
        return { label: 'SHORTLIST', bg: '#FFFFFF', border: '#D8DEC9', text: '#121212' };
      case 'rejected':
        return { label: 'CLOSED', bg: '#FEE2E2', border: '#FCA5A5', text: '#991B1B' };
      case 'scouted':
      default:
        return { label: 'SCOUTED', bg: '#F4F6F0', border: '#E2E6DC', text: '#5A5D54' };
    }
  };

  const stageMeta = getStageMeta(stage);

  return (
    <View style={styles.cardContainer}>
      {/* Clickable Header & Milestones to View Detail */}
      <Pressable
        onPress={handleCardPress}
        style={state => [
          styles.cardBodyPressable,
          state.pressed && styles.cardPressed,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View full details for ${job.title} at ${job.company}`}>
        {/* Top Header: Brand Logo + Titles + Stage Badge */}
        <View style={styles.topRow}>
          <View style={styles.headerLeft}>
            <CompanyLogo company={job.company} size={40} />
            <View style={styles.titleColumn}>
              <Heading style={styles.jobTitle} numberOfLines={2}>
                {job.title}
              </Heading>
              <View style={styles.companyRow}>
                <Body style={styles.companyName}>{job.company}</Body>
                <View style={styles.dotSeparator} />
                <MapPin size={11} color="#5A5D54" />
                <Body style={styles.locationText} numberOfLines={1}>
                  {job.location}
                </Body>
              </View>
              {/* Salary directly under company and location */}
              <Body style={styles.salaryText}>{job.salary}</Body>
            </View>
          </View>

          {/* Right: Dedicated Application Stage Status Pill */}
          <View
            style={[
              styles.stageBadge,
              { backgroundColor: stageMeta.bg, borderColor: stageMeta.border },
            ]}>
            <Label style={[styles.stageBadgeText, { color: stageMeta.text }]}>
              {stageMeta.label}
            </Label>
          </View>
        </View>

        {/* Contextual Milestones (Only shown when relevant) */}
        {item.nextInterviewDate ? (
          <View style={styles.milestoneRow}>
            <Calendar size={13} color="#2F4F00" />
            <Body style={styles.milestoneText} numberOfLines={1}>
              {item.nextInterviewDate}
            </Body>
          </View>
        ) : item.appliedDate && stage === 'applied' ? (
          <View style={styles.milestoneRow}>
            <Calendar size={13} color="#5A5D54" />
            <Body style={styles.milestoneTextMuted}>
              Submitted on {item.appliedDate}
            </Body>
          </View>
        ) : null}

        {/* Latest Note Snippet (if available) */}
        {item.notes && item.notes.length > 0 ? (
          <View style={styles.noteSnippetRow}>
            <FileText size={12} color="#5A5D54" />
            <Body style={styles.noteSnippetText} numberOfLines={1}>
              {item.notes[item.notes.length - 1]}
            </Body>
          </View>
        ) : null}
      </Pressable>

      {/* Card Action Footer: Circular Match Score Wheel & Stage Action Button */}
      <View style={styles.cardFooter}>
        {item.atsScore ? (
          <View style={styles.matchScoreWheelGroup}>
            <CircularScoreRing score={item.atsScore} size={36} />
            <View style={styles.scoreTextGroup}>
              <Label style={styles.scoreLabelText}>CV MATCH</Label>
              <Text
                style={[
                  styles.scoreSublabelText,
                  { color: getScoreColorMeta(item.atsScore).statusColor },
                ]}>
                {getScoreColorMeta(item.atsScore).statusText}
              </Text>
            </View>
          </View>
        ) : (
          <View />
        )}

        <Pressable
          onPress={handleStageAction}
          style={state => [
            styles.advanceButton,
            state.pressed && styles.advanceButtonPressed,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webFocusRing
              : null,
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Update progress for ${job.title}`}>
          <Label style={styles.advanceButtonText}>UPDATE STAGE</Label>
          <ArrowRight size={13} color="#121212" strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBodyPressable: {
    gap: 10,
  },
  cardPressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  titleColumn: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#121212',
    lineHeight: 19,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  companyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5D54',
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CCD2C0',
  },
  locationText: {
    fontSize: 11,
    color: '#5A5D54',
  },
  salaryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#121212',
    marginTop: 3,
  },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  stageBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F9F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  milestoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F4F00',
  },
  milestoneTextMuted: {
    fontSize: 12,
    color: '#5A5D54',
  },
  noteSnippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  noteSnippetText: {
    fontSize: 12,
    color: '#5A5D54',
    fontStyle: 'italic',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F3E9',
    paddingTop: 12,
  },
  matchScoreWheelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreTextGroup: {
    justifyContent: 'center',
  },
  scoreLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  scoreSublabelText: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 1,
  },
  wheelScoreText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  advanceButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: '#D8DEC9',
  },
  advanceButtonPressed: {
    backgroundColor: '#F4F6F0',
  },
  advanceButtonText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#121212',
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
