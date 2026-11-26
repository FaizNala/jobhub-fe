import React, { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Job } from '../jobs.types';
import { Body, Display, Heading, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { PillButton } from '@/components/atoms/pill-button';
import { StageStepCard } from './stage-step-card';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { usePipeline } from '@/modules/pipeline';

interface JobDetailModalProps {
  job: Job | null;
  visible: boolean;
  onClose: () => void;
}

export function JobDetailModal({
  job,
  visible,
  onClose,
}: JobDetailModalProps) {
  const { allItems, create, remove, updateStage } = usePipeline();

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, visible]);

  if (!job) return null;

  const existingItem = allItems.find(i => i.job.id === job.id);
  const isSaved = Boolean(existingItem);

  const handleApply = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (existingItem) {
      await updateStage(existingItem.id, 'applied');
    } else {
      await create({ job, stage: 'applied' });
    }
  };

  const handleToggleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (existingItem) {
      await remove(existingItem.id);
    } else {
      await create({ job, stage: 'shortlisted' });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.sheetWrapper}>
          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back to previous screen"
              style={state => [
                styles.navButton,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}>
              <ArrowLeft size={20} color="#121212" />
              <Label style={styles.navText}>Back</Label>
            </Pressable>

            {/* Bookmark Action */}
            <Pressable
              onPress={handleToggleSave}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
              style={state => [
                styles.saveButton,
                isSaved && styles.savedActive,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}>
              <Bookmark
                size={18}
                color={isSaved ? '#121212' : '#5A5D54'}
                fill={isSaved ? '#B8F23E' : 'transparent'}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Company Hero Card */}
            <View style={styles.heroCard}>
              <CompanyLogo company={job.company} size={56} />

              <Heading style={styles.companyHeading}>{job.company}</Heading>
              <Display style={styles.titleDisplay}>{job.title}</Display>
              <View style={styles.locationContainer}>
                <MapPin size={13} color="#5A5D54" />
                <Body style={styles.locationDetail}>
                  {job.location} · {job.workplaceType}
                </Body>
              </View>

              <View style={styles.metaPillsRow}>
                <BadgeChip label={job.salary} variant="lime" />
                <BadgeChip label={job.workplaceType} variant="neutral" />
                <BadgeChip label={job.employmentType} variant="outline" />
              </View>
            </View>

            {/* Company Interview Stages Guide Section */}
            <View style={styles.sectionHeader}>
              <Heading style={styles.sectionTitle}>Interview Stages</Heading>
              <BadgeChip label={`${job.interviewStages.length} Stages`} variant="neutral" />
            </View>

            <View style={styles.stagesList}>
              {job.interviewStages.map(stage => (
                <StageStepCard key={stage.stageNumber} stage={stage} />
              ))}
            </View>
          </ScrollView>

          {/* Bottom CTA Bar: Only when viewed outside tracker and role has not been applied */}
          {!existingItem ? (
            <View style={styles.bottomBar}>
              <PillButton
                label="APPLY FOR THIS ROLE"
                variant="dark"
                onPress={handleApply}
                style={{ width: '100%' }}
              />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  sheetWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  navText: {
    fontSize: 14,
    color: '#121212',
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  savedActive: {
    backgroundColor: '#EFF3E8',
    borderColor: '#B8F23E',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  companyHeading: {
    fontSize: 15,
    color: '#5A5D54',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titleDisplay: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    color: '#121212',
    fontWeight: '800',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationDetail: {
    fontSize: 13,
    color: '#5A5D54',
  },
  metaPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#121212',
    fontWeight: '700',
  },
  stagesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
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
