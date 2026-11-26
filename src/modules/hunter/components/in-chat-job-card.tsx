import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Bookmark, Check, ArrowUpRight, MapPin } from 'lucide-react-native';
import { Job } from '@/modules/jobs/jobs.types';
import { usePipeline } from '@/modules/pipeline';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { Colors, Radius } from '@/constants/theme';

interface InChatJobCardProps {
  job: Job;
  onViewDetail?: (job: Job) => void;
}

export function InChatJobCard({ job, onViewDetail }: InChatJobCardProps) {
  const { allItems, create } = usePipeline();
  const [isSaving, setIsSaving] = useState(false);

  // Check if job is already saved in pipeline
  const isSavedInPipeline = allItems.some(item => item.job.id === job.id);

  const handleSaveToPipeline = async () => {
    if (isSavedInPipeline || isSaving) return;

    setIsSaving(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await create({ job, stage: 'shortlisted' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onViewDetail) onViewDetail(job);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Top Header: Logo + Title + View Detail Button */}
      <Pressable
        onPress={handleCardPress}
        style={styles.cardHeaderPressable}
        accessibilityRole="button"
        accessibilityLabel={`View full details for ${job.title} at ${job.company}`}>
        <View style={styles.headerLeft}>
          <CompanyLogo
            company={job.company}
            size={38}
          />
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

        <View style={styles.viewDetailIcon}>
          <ArrowUpRight size={16} color="#121212" />
        </View>
      </Pressable>

      {/* Salary & Tags Row */}
      <View style={styles.metaRow}>
        <View style={styles.salaryBadge}>
          <Label style={styles.salaryText}>{job.salary}</Label>
        </View>

        <View style={styles.tagsContainer}>
          {job.tags.slice(0, 2).map(tag => (
            <BadgeChip key={tag} label={tag} variant="neutral" />
          ))}
        </View>
      </View>

      {/* 1-Tap Action Footer: Save to Application Tracker */}
      <View style={styles.footerRow}>
        {isSavedInPipeline ? (
          <View style={styles.savedIndicator}>
            <Check size={14} color="#2F4F00" strokeWidth={2.5} />
            <Label style={styles.savedText}>TRACKED IN PIPELINE</Label>
          </View>
        ) : (
          <Pressable
            onPress={handleSaveToPipeline}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Save ${job.title} to pipeline`}>
            <Bookmark size={14} color="#121212" />
            <Label style={styles.saveButtonText}>
              {isSaving ? 'SAVING...' : 'SAVE TO PIPELINE'}
            </Label>
          </Pressable>
        )}
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
    padding: 14,
    marginVertical: 6,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  viewDetailIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E6D9',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  salaryBadge: {
    backgroundColor: '#EFF3E8',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  salaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F3E9',
    paddingTop: 10,
  },
  saveButton: {
    minHeight: 44,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#A4DC35',
  },
  saveButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  saveButtonText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#121212',
  },
  savedIndicator: {
    minHeight: 44,
    backgroundColor: '#EFF3E8',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D8DEC9',
  },
  savedText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#2F4F00',
  },
});
