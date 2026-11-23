import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, CheckCircle2, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Job } from '@/types/job';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { PillButton } from '@/components/atoms/pill-button';
import { StageStepCard } from '@/components/molecules/stage-step-card';
import { CompanyLogo } from '@/components/atoms/company-logo';

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

          {/* Interview Stages Section */}
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
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
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
  },
  savedActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
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
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.full,
    backgroundColor: '#EAF9CE',
  },
  successText: {
    fontSize: 14,
    color: '#2F4F00',
    fontWeight: '700',
  },
});
