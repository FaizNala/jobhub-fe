import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Job } from '@/types/job';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { PillButton } from '@/components/atoms/pill-button';
import { StageStepCard } from '@/components/molecules/stage-step-card';

interface JobDetailModalProps {
  job: Job | null;
  visible: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, visible, onClose }: JobDetailModalProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!job) return null;

  const handleApply = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setIsApplied(true);
  };

  const handleToggleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsSaved(prev => !prev);
  };

  const handleClose = () => {
    setIsApplied(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalContainer}>
        {/* Top Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Back to vacancies"
            style={styles.navButton}>
            <ArrowLeft size={20} color="#121212" />
            <Label style={styles.navText}>Back</Label>
          </Pressable>

          <Pressable
            onPress={handleToggleSave}
            accessibilityRole="button"
            accessibilityLabel="Bookmark this job"
            style={[styles.saveButton, isSaved && styles.savedActive]}>
            <Bookmark
              size={18}
              color={isSaved ? '#121212' : '#6B6D66'}
              fill={isSaved ? '#B8F23E' : 'transparent'}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Company Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.logoCircle}>
              <Label style={styles.logoText}>{job.companyInitial}</Label>
            </View>

            <Heading style={styles.companyHeading}>{job.company}</Heading>
            <Display style={styles.titleDisplay}>{job.title}</Display>
            <Body style={styles.locationDetail}>
              📍 {job.location} · {job.workplaceType}
            </Body>

            <View style={styles.metaPillsRow}>
              <BadgeChip label={job.salary} variant="dark" />
              <BadgeChip label={job.workplaceType} variant="neutral" />
              <BadgeChip label={job.employmentType} variant="lime" />
            </View>
          </View>

          {/* Interview Stages Section (Image 5 Reference) */}
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

        {/* Bottom CTA Bar */}
        <View style={styles.bottomBar}>
          {isApplied ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={20} color="#2F4F00" />
              <Label style={styles.successText}>Application Submitted Successfully!</Label>
            </View>
          ) : (
            <PillButton
              label="APPLY FOR THIS JOB"
              variant="dark"
              onPress={handleApply}
              style={{ width: '100%' }}
            />
          )}
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  navText: {
    fontSize: 14,
    color: '#121212',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  savedActive: {
    backgroundColor: '#EAF9CE',
    borderColor: '#B8F23E',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 10,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#121212',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 20,
    color: '#121212',
  },
  companyHeading: {
    fontSize: 16,
    color: '#6B6D66',
  },
  titleDisplay: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    color: '#121212',
  },
  locationDetail: {
    fontSize: 13,
    color: '#6B6D66',
  },
  metaPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#121212',
  },
  stagesList: {
    gap: 12,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  successBox: {
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: '#EAF9CE',
    borderWidth: 1.5,
    borderColor: '#B8F23E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successText: {
    color: '#2F4F00',
    fontSize: 14,
  },
});
