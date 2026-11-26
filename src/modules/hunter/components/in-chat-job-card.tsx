import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowUpRight, Bookmark, Check, MapPin } from 'lucide-react-native';
import { Job } from '@/modules/jobs/jobs.types';
import { usePipeline } from '@/modules/pipeline';
import { Body, Heading, Label } from '@/components/atoms/typography';
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
  const [saveError, setSaveError] = useState<string | null>(null);

  const isSavedInPipeline = allItems.some(item => item.job.id === job.id);

  const handleSaveToPipeline = async () => {
    if (isSavedInPipeline || isSaving) return;

    setSaveError(null);
    setIsSaving(true);
    try {
      await create({ job, stage: 'shortlisted' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (err: any) {
      setSaveError(err?.message || 'Unable to save role to pipeline. Please retry.');
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
      {/* Top Header: Logo + Title + View Detail Action */}
      <Pressable
        onPress={handleCardPress}
        style={state => [
          styles.cardHeaderPressable,
          state.pressed && styles.pressedFade,
          Platform.OS === 'web' && (state as { focused?: boolean }).focused
            ? styles.webFocusRing
            : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View full details for ${job.title} at ${job.company}`}>
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

        <View style={styles.viewDetailIcon} accessibilityElementsHidden>
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

      {saveError ? (
        <View style={styles.errorBanner} accessibilityLiveRegion="polite">
          <Text style={styles.errorBannerText}>{saveError}</Text>
        </View>
      ) : null}

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
            style={state => [
              styles.saveButton,
              isSaving && styles.disabledBtn,
              state.pressed && !isSaving && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityState={{ busy: isSaving, disabled: isSaving }}
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
    borderColor: Colors.light.border,
    padding: 14,
    marginVertical: 6,
    gap: 12,
  },
  cardHeaderPressable: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
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
    backgroundColor: '#9CA3AF',
  },
  locationText: {
    fontSize: 11.5,
    color: '#5A5D54',
    flexShrink: 1,
  },
  viewDetailIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  salaryBadge: {
    backgroundColor: '#EFF3E8',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  salaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flexShrink: 1,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  errorBannerText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#991B1B',
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F3E9',
    paddingTop: 10,
  },
  saveButton: {
    minHeight: 44,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#9ED42B',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  disabledBtn: {
    opacity: 0.65,
  },
  saveButtonText: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#121212',
  },
  savedIndicator: {
    minHeight: 44,
    backgroundColor: '#EFF3E8',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  savedText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#2F4F00',
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
