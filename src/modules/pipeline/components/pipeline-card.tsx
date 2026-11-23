import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MapPin, Calendar, ArrowRight, FileText } from 'lucide-react-native';
import { PipelineItem, PipelineStage } from '../pipeline.types';
import { Job } from '@/modules/jobs/jobs.types';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { Radius } from '@/constants/theme';

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
      case 'interviewing':
        return { label: 'INTERVIEW', bg: '#EFF3E8', border: '#D8DEC9', text: '#2F4F00' };
      case 'offered':
        return { label: 'OFFER', bg: '#EFF3E8', border: '#B8F23E', text: '#121212' };
      case 'applied':
        return { label: 'APPLIED', bg: '#121212', border: '#121212', text: '#FFFFFF' };
      case 'shortlisted':
        return { label: 'SHORTLIST', bg: '#FFFFFF', border: '#E8ECDF', text: '#5A5D54' };
      case 'scouted':
      default:
        return { label: 'SCOUTED', bg: '#F4F6F0', border: '#E8ECDF', text: '#5A5D54' };
    }
  };

  const stageMeta = getStageMeta(stage);

  return (
    <View style={styles.cardContainer}>
      {/* Clickable Header & Milestones to View Detail */}
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [
          styles.cardBodyPressable,
          pressed && styles.cardPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View full details for ${job.title} at ${job.company}`}>
        {/* Top Header: Brand Logo + Titles + Stage Badge */}
        <View style={styles.topRow}>
          <View style={styles.headerLeft}>
            <CompanyLogo company={job.company} size={38} />
            <View style={styles.titleColumn}>
              <Heading style={styles.jobTitle} numberOfLines={1}>
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
            </View>
          </View>

          {/* Current Stage Pill */}
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
            <FileText size={12} color="#8E9285" />
            <Body style={styles.noteSnippetText} numberOfLines={1}>
              {item.notes[item.notes.length - 1]}
            </Body>
          </View>
        ) : null}
      </Pressable>

      {/* Card Action Footer: Dedicated Progress Update Button */}
      <View style={styles.cardFooter}>
        <Body style={styles.salaryText}>{job.salary}</Body>

        <Pressable
          onPress={handleStageAction}
          style={({ pressed }) => [
            styles.advanceButton,
            pressed && styles.advanceButtonPressed,
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
    alignItems: 'center',
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
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEFE2',
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
    color: '#8E9285',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F3E9',
    paddingTop: 12,
  },
  salaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
  },
  advanceButton: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF3E8',
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#D8DEC9',
  },
  advanceButtonPressed: {
    backgroundColor: '#E2E6D9',
  },
  advanceButtonText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#121212',
  },
});
