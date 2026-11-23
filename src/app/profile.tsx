import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  User,
  ShieldCheck,
  Mail,
  MapPin,
  Pencil,
  FileText,
  Bot,
  Briefcase,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Sliders,
} from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { CandidateAvatar } from '@/components/atoms/candidate-avatar';
import { useCandidateProfile, ProfileEditModal } from '@/modules/cv-studio';
import { useAuth } from '@/modules/auth';
import { usePipeline } from '@/modules/pipeline';

export default function ProfileScreen() {
  const { profile, updateProfile } = useCandidateProfile();
  const { user } = useAuth();
  const { countsByStage } = usePipeline();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const displayName = profile?.fullName || user?.name || 'Alex Vance';
  const displayRole = profile?.headline || 'Senior Mobile Engineer & Systems Architect';
  const displayLocation = profile?.location || 'San Francisco, CA';
  const displayEmail = user?.email || 'alex.vance@example.com';
  const displaySummary = profile?.summary || '';

  // Target Roles & Job Preferences (Multi-select)
  const targetRoles = profile?.preferences?.targetRoles ?? [
    'Senior React Native Engineer',
    'Mobile Solutions Architect',
  ];
  const workModels = profile?.preferences?.workModels ?? ['Remote', 'Hybrid'];
  const targetLocations = profile?.preferences?.targetLocations ?? [
    'San Francisco, CA',
    'Remote (US)',
  ];
  const minCompensation =
    profile?.preferences?.minCompensation || '$150k - $210k / year';

  const interviewCount = countsByStage.interviewing ?? 0;
  const shortlistCount = countsByStage.shortlisted ?? 0;
  const scoutedCount = countsByStage.scouted ?? 0;

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
              <User size={14} color="#121212" />
            </View>
            <Label style={styles.badgeText}>CANDIDATE DOSSIER</Label>
          </View>

          <View style={styles.titleRow}>
            <Display style={styles.title}>
              APPLICANT{'\n'}PROFILE
            </Display>
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(true)}
              style={styles.editHeaderButton}
              activeOpacity={0.8}
              accessibilityLabel="Edit profile details and preferences">
              <Pencil size={13} color="#121212" />
              <Label style={styles.editHeaderText}>EDIT PROFILE</Label>
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Identity Card */}
        <View style={styles.profileCard}>
          <CandidateAvatar size={64} />

          <Heading style={styles.name}>{displayName}</Heading>
          <Body style={styles.role}>{displayRole}</Body>

          {/* Location & Email */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={12} color="#5A5D54" />
              <Body style={styles.metaText}>{displayLocation}</Body>
            </View>
            <View style={styles.metaItem}>
              <Mail size={12} color="#5A5D54" />
              <Body style={styles.metaText}>{displayEmail}</Body>
            </View>
            <View style={styles.metaItem}>
              <ShieldCheck size={12} color="#2F4F00" />
              <Body style={styles.verifiedText}>Verified</Body>
            </View>
          </View>

          {/* Professional Summary */}
          {displaySummary ? (
            <View style={styles.summaryContainer}>
              <Body style={styles.summaryText}>{displaySummary}</Body>
            </View>
          ) : null}
        </View>

        {/* Section: Target Roles & Career Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heading style={styles.sectionTitle}>Job Preferences & Targets</Heading>
          </View>

          <View style={styles.preferencesCard}>
            {/* Target Roles */}
            <View style={styles.preferenceBlock}>
              <Label style={styles.preferenceLabel}>TARGET ROLES</Label>
              <View style={styles.chipsRow}>
                {targetRoles.length > 0 ? (
                  targetRoles.map(role => (
                    <View key={role} style={styles.roleChip}>
                      <Briefcase size={12} color="#2F4F00" />
                      <Body style={styles.roleChipText}>{role}</Body>
                    </View>
                  ))
                ) : (
                  <Body style={styles.emptyPreferenceText}>No target roles specified</Body>
                )}
              </View>
            </View>

            {/* Work Model Preference */}
            <View style={styles.preferenceBlock}>
              <Label style={styles.preferenceLabel}>WORK MODEL PREFERENCE</Label>
              <View style={styles.chipsRow}>
                {workModels.length > 0 ? (
                  workModels.map(model => (
                    <View key={model} style={styles.modelChip}>
                      <Body style={styles.modelChipText}>{model}</Body>
                    </View>
                  ))
                ) : (
                  <Body style={styles.emptyPreferenceText}>Flexible / Open to any work model</Body>
                )}
              </View>
            </View>

            {/* Target Locations */}
            <View style={styles.preferenceBlock}>
              <Label style={styles.preferenceLabel}>TARGET LOCATIONS</Label>
              <View style={styles.chipsRow}>
                {targetLocations.length > 0 ? (
                  targetLocations.map(loc => (
                    <View key={loc} style={styles.locationChip}>
                      <MapPin size={11} color="#5A5D54" />
                      <Body style={styles.locationChipText}>{loc}</Body>
                    </View>
                  ))
                ) : (
                  <Body style={styles.emptyPreferenceText}>Open to remote / any location</Body>
                )}
              </View>
            </View>

            {/* Expected Compensation */}
            <View style={[styles.preferenceBlock, { borderBottomWidth: 0 }]}>
              <Label style={styles.preferenceLabel}>EXPECTED COMPENSATION</Label>
              <View style={styles.compensationRow}>
                <DollarSign size={14} color="#2F4F00" />
                <Heading style={styles.compensationValue}>
                  {minCompensation || 'Open to discussion'}
                </Heading>
              </View>
            </View>
          </View>
        </View>

        {/* Section: Active Hiring Loops Momentum */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heading style={styles.sectionTitle}>Hiring Pipeline</Heading>
            <TouchableOpacity
              onPress={() => router.push('/jobs' as any)}
              accessibilityLabel="View pipeline tracker">
              <Body style={styles.viewTrackerLink}>View tracker &rarr;</Body>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Briefcase size={16} color="#121212" />
              <Display style={styles.metricValue}>{interviewCount}</Display>
              <Body style={styles.metricLabel}>Interview Loop</Body>
            </View>

            <View style={styles.metricBox}>
              <TrendingUp size={16} color="#2F4F00" />
              <Display style={[styles.metricValue, { color: '#2F4F00' }]}>
                {shortlistCount}
              </Display>
              <Body style={styles.metricLabel}>Shortlisted</Body>
            </View>

            <View style={styles.metricBox}>
              <Bot size={16} color="#5A5D54" />
              <Display style={styles.metricValue}>{scoutedCount}</Display>
              <Body style={styles.metricLabel}>AI Scouted</Body>
            </View>
          </View>
        </View>

        {/* Section: Career Preparation & Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heading style={styles.sectionTitle}>Career Tools</Heading>
          </View>

          <View style={styles.toolsContainer}>
            {/* CV Studio Card */}
            <TouchableOpacity
              onPress={() => router.push('/cv' as any)}
              activeOpacity={0.85}
              style={styles.toolCard}>
              <View style={styles.toolIconCircle}>
                <FileText size={18} color="#121212" />
              </View>
              <View style={styles.toolContent}>
                <Heading style={styles.toolTitle}>CV Studio & ATS Tailor</Heading>
                <Body style={styles.toolSub}>
                  Master dossier with work achievements & ATS keyword alignment.
                </Body>
              </View>
              <ArrowRight size={16} color="#121212" />
            </TouchableOpacity>

            {/* Hunter Agent Card */}
            <TouchableOpacity
              onPress={() => router.push('/agent' as any)}
              activeOpacity={0.85}
              style={[styles.toolCard, styles.toolCardDark]}>
              <View style={[styles.toolIconCircle, styles.toolIconLime]}>
                <Bot size={18} color="#121212" />
              </View>
              <View style={styles.toolContent}>
                <Heading style={[styles.toolTitle, styles.toolTitleLight]}>
                  AI Career Hunter Co-Pilot
                </Heading>
                <Body style={[styles.toolSub, styles.toolSubLight]}>
                  Autonomous discovery across public boards & ATS feeds.
                </Body>
              </View>
              <ArrowRight size={16} color="#B8F23E" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={isEditModalVisible}
        profile={profile}
        onClose={() => setIsEditModalVisible(false)}
        onSave={async dto => {
          await updateProfile(dto);
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#121212',
  },
  role: {
    fontSize: 13,
    color: '#5A5D54',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#5A5D54',
  },
  verifiedText: {
    fontSize: 12,
    color: '#2F4F00',
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#F9FAF7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E8ECDF',
    marginTop: 12,
    width: '100%',
  },
  summaryText: {
    fontSize: 12.5,
    lineHeight: 21,
    color: '#343830',
    textAlign: 'left',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  viewTrackerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5D54',
  },
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 14,
  },
  preferenceBlock: {
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F0',
  },
  preferenceLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  roleChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2F4F00',
  },
  modelChip: {
    backgroundColor: '#121212',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  modelChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  locationChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5A5D54',
  },
  emptyPreferenceText: {
    fontSize: 12,
    color: '#8A8F82',
    fontStyle: 'italic',
  },
  compensationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compensationValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricValue: {
    fontSize: 22,
    lineHeight: 26,
    color: '#121212',
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#5A5D54',
    fontWeight: '600',
  },
  toolsContainer: {
    gap: 10,
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  toolCardDark: {
    backgroundColor: '#121212',
    borderColor: 'rgba(184, 242, 62, 0.4)',
  },
  toolIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIconLime: {
    backgroundColor: '#B8F23E',
  },
  toolContent: {
    flex: 1,
    gap: 2,
  },
  toolTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#121212',
  },
  toolTitleLight: {
    color: '#FFFFFF',
  },
  toolSub: {
    fontSize: 11,
    color: '#5A5D54',
    lineHeight: 16,
  },
  toolSubLight: {
    color: '#C4C9BD',
  },
});
