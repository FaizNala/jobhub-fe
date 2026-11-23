import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  FileText,
  Sparkles,
  Pencil,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import {
  useCandidateProfile,
  useATSMatcher,
  CvExperienceList,
  CvSkillsSection,
  CvAtsMatcherCard,
  CvEditModal,
  TargetJobOption,
} from '@/modules/cv-studio';
import { usePipeline } from '@/modules/pipeline';

export default function CvStudioScreen() {
  const { profile, updateProfile } = useCandidateProfile();
  const { atsResult, isCalculating, calculateATS } = useATSMatcher();
  const { items } = usePipeline();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const displayName = profile?.fullName || 'Alex Vance';
  const displayRole = profile?.headline || 'Senior Mobile Engineer';
  const displaySkills = profile?.skills || ['React Native', 'TypeScript', 'Expo SDK'];
  const displaySummary = profile?.summary || '';
  const displayExperiences = profile?.experiences || [];
  const displayEducation = profile?.education || [];

  // Active target jobs from pipeline
  const targetJobs: TargetJobOption[] = useMemo(() => {
    const fromPipeline = items.map(i => ({
      id: i.job.id,
      title: i.job.title,
      company: i.job.company,
    }));
    if (fromPipeline.length > 0) return fromPipeline;
    return [
      { id: 'job-1', title: 'Senior React Native Engineer', company: 'Uber' },
      { id: 'job-2', title: 'Mobile Solutions Architect', company: 'Amazon' },
      { id: 'job-3', title: 'Product Mobile Designer', company: 'Spotify' },
    ];
  }, [items]);

  useEffect(() => {
    if (targetJobs.length > 0 && !selectedJobId) {
      const initialId = targetJobs[0].id;
      setSelectedJobId(initialId);
      calculateATS(initialId);
    }
  }, [targetJobs, selectedJobId, calculateATS]);

  const handleSelectTargetJob = (jobId: string) => {
    setSelectedJobId(jobId);
    calculateATS(jobId);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <FileText size={14} color="#121212" />
            </View>
            <Label style={styles.badgeText}>CV STUDIO & ATS TAILOR</Label>
          </View>

          <View style={styles.titleRow}>
            <Display style={styles.title}>
              MASTER{'\n'}CV DOSSIER
            </Display>
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(true)}
              style={styles.editHeaderButton}
              activeOpacity={0.8}
              accessibilityLabel="Edit master CV">
              <Pencil size={13} color="#121212" />
              <Label style={styles.editHeaderText}>EDIT DOSSIER</Label>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Hunter Co-Pilot Integration Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerTop}>
            <View style={styles.aiIconBadge}>
              <Sparkles size={14} color="#121212" />
            </View>
            <Label style={styles.aiBannerTag}>AI HUNTER CO-PILOT INTEGRATION</Label>
          </View>
          <Body style={styles.aiBannerText}>
            Targeting a specific role? Let Hunter analyze vacancy criteria and rewrite your bullet points using the Google XYZ formula.
          </Body>
          <TouchableOpacity
            onPress={() => router.push('/agent' as any)}
            style={styles.aiBannerButton}
            activeOpacity={0.85}
            accessibilityLabel="Launch Hunter AI Co-pilot">
            <Label style={styles.aiBannerButtonText}>LAUNCH HUNTER CO-PILOT</Label>
            <ArrowRight size={14} color="#121212" />
          </TouchableOpacity>
        </View>

        {/* Candidate Master Summary Card */}
        <View style={styles.dossierSummaryCard}>
          <View style={styles.dossierHeaderRow}>
            <View style={styles.dossierTitleBlock}>
              <Heading style={styles.candidateName}>{displayName}</Heading>
              <Body style={styles.candidateRole}>{displayRole}</Body>
            </View>
            <View style={styles.verifiedChip}>
              <ShieldCheck size={13} color="#2F4F00" />
              <Label style={styles.verifiedText}>ATS READY</Label>
            </View>
          </View>

          {displaySummary ? (
            <Body style={styles.summaryText}>{displaySummary}</Body>
          ) : null}
        </View>

        {/* Real-time ATS Keyword Matcher */}
        <CvAtsMatcherCard
          targetJobs={targetJobs}
          selectedJobId={selectedJobId}
          onSelectJob={handleSelectTargetJob}
          atsResult={atsResult}
          isCalculating={isCalculating}
        />

        {/* Technical Inventory */}
        <CvSkillsSection skills={displaySkills} />

        {/* Work Experience & Education Milestones */}
        <CvExperienceList
          experiences={displayExperiences}
          education={displayEducation}
        />
      </ScrollView>

      {/* Edit Modal */}
      <CvEditModal
        visible={isEditModalVisible}
        profile={profile}
        onClose={() => setIsEditModalVisible(false)}
        onSave={async dto => {
          await updateProfile(dto);
          if (selectedJobId) {
            calculateATS(selectedJobId);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    color: '#121212',
    fontWeight: '900',
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  editHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#121212',
    letterSpacing: 0.5,
  },
  aiBanner: {
    backgroundColor: '#121212',
    marginHorizontal: 20,
    borderRadius: Radius.md,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(184, 242, 62, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  aiBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#B8F23E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B8F23E',
    letterSpacing: 0.5,
  },
  aiBannerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#E8ECDF',
  },
  aiBannerButton: {
    backgroundColor: '#B8F23E',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  aiBannerButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  dossierSummaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: Radius.md,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  dossierHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dossierTitleBlock: {
    flex: 1,
    gap: 2,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#121212',
  },
  candidateRole: {
    fontSize: 13,
    color: '#5A5D54',
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2F4F00',
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#343830',
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
    paddingTop: 10,
  },
});
