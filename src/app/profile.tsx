import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Bot,
  Briefcase,
  FileText,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Body, Display, Heading, Label } from '@/components/atoms/typography';
import { CandidateAvatar } from '@/components/atoms/candidate-avatar';
import { ProfileEditModal, useCandidateProfile } from '@/modules/cv-studio';
import { useAuth } from '@/modules/auth';
import { usePipeline } from '@/modules/pipeline';

export default function ProfileScreen() {
  const { profile, isLoading, error, getProfile, updateProfile } = useCandidateProfile();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const {
    countsByStage,
    isLoading: isPipelineLoading,
    error: pipelineError,
  } = usePipeline();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setSignOutError(null);
    setIsSigningOut(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await logout();
      router.replace('/login' as any);
    } catch (err: any) {
      setSignOutError(err?.message || 'Unable to sign out right now. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = profile?.fullName || user?.name || 'Candidate Profile';
  const displayRole = profile?.headline || 'Professional headline not set';
  const displayLocation = profile?.location || 'Location not specified';
  const displayEmail = profile?.contact?.email || user?.email || 'No email linked';

  const targetRoles = profile?.preferences?.targetRoles ?? [];
  const workModels = profile?.preferences?.workModels ?? [];
  const targetLocations = profile?.preferences?.targetLocations ?? [];
  const minCompensation = profile?.preferences?.minCompensation ?? '';

  const interviewCount = countsByStage.interviewing ?? 0;
  const shortlistCount = countsByStage.shortlisted ?? 0;
  const scoutedCount = countsByStage.scouted ?? 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.iconCircle} accessibilityElementsHidden>
                <User size={14} color="#121212" />
              </View>
              <Label style={styles.badgeText}>CANDIDATE DOSSIER</Label>
            </View>

            <View style={styles.titleRow}>
              <Display style={styles.title}>
                APPLICANT{'\n'}PROFILE
              </Display>
              {profile ? (
                <Pressable
                  onPress={() => setIsEditModalVisible(true)}
                  style={state => [
                    styles.editHeaderButton,
                    state.pressed && styles.pressedFade,
                    Platform.OS === 'web' && (state as { focused?: boolean }).focused
                      ? styles.webFocusRing
                      : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile details and preferences">
                  <Pencil size={13} color="#121212" />
                  <Label style={styles.editHeaderText}>EDIT PROFILE</Label>
                </Pressable>
              ) : null}
            </View>
          </View>

          {(isLoading || isAuthLoading) && !profile ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <ActivityIndicator size="small" color="#121212" />
              <Body style={styles.stateBody}>Loading your candidate profile...</Body>
            </View>
          ) : error && !profile ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <AlertCircle size={22} color="#991B1B" />
              <Heading style={styles.stateTitle}>Unable to load profile</Heading>
              <Body style={styles.stateBody}>{error}</Body>
              <Pressable
                onPress={() => getProfile()}
                style={state => [
                  styles.retryBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Retry loading profile">
                <Label style={styles.retryBtnText}>RETRY</Label>
              </Pressable>
            </View>
          ) : !profile ? (
            <View style={styles.stateBox}>
              <Heading style={styles.stateTitle}>No profile found</Heading>
              <Body style={styles.stateBody}>
                Refresh to load your candidate identity and job preferences.
              </Body>
              <Pressable
                onPress={() => getProfile()}
                style={state => [
                  styles.retryBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Refresh profile">
                <Label style={styles.retryBtnText}>REFRESH</Label>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Primary Identity Anchor Card (Obsidian Focal Point) */}
              <View style={styles.profileCard}>
                <CandidateAvatar size={64} name={displayName} tone="dark" />

                <Heading style={styles.name}>{displayName}</Heading>
                <Body style={styles.role}>{displayRole}</Body>

                {/* Location & Email */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MapPin size={12} color="#D1D5DB" />
                    <Body style={styles.metaText}>{displayLocation}</Body>
                  </View>
                  <View style={styles.metaItem}>
                    <Mail size={12} color="#D1D5DB" />
                    <Body style={styles.metaText}>{displayEmail}</Body>
                  </View>
                </View>

                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={13} color="#B8F23E" />
                  <Label style={styles.verifiedText}>VERIFIED PROFILE</Label>
                </View>
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
                        <Body style={styles.emptyPreferenceText}>
                          No target roles specified yet
                        </Body>
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
                        <Body style={styles.emptyPreferenceText}>
                          Open to any work arrangement
                        </Body>
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
                        <Body style={styles.emptyPreferenceText}>
                          Open to any location or remote
                        </Body>
                      )}
                    </View>
                  </View>

                  {/* Expected Compensation */}
                  <View style={[styles.preferenceBlock, styles.preferenceBlockLast]}>
                    <Label style={styles.preferenceLabel}>EXPECTED COMPENSATION</Label>
                    <View style={styles.compensationRow}>
                      <Banknote size={15} color="#2F4F00" />
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
                  <Pressable
                    onPress={() => router.push('/jobs' as any)}
                    style={state => [
                      styles.viewTrackerBtn,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Open hiring pipeline tracker">
                    <Body style={styles.viewTrackerLink}>Open tracker</Body>
                  </Pressable>
                </View>

                {pipelineError ? (
                  <View style={styles.inlineWarning} accessibilityLiveRegion="polite">
                    <AlertCircle size={14} color="#991B1B" />
                    <Body style={styles.inlineWarningText}>
                      Pipeline counts unavailable right now.
                    </Body>
                  </View>
                ) : null}

                <View style={styles.metricsContainer}>
                  <Pressable
                    onPress={() => router.push('/jobs?stage=interviewing' as any)}
                    style={state => [
                      styles.metricBox,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${interviewCount} applications in Interview Loop`}>
                    <Briefcase size={16} color="#121212" />
                    <Display style={styles.metricValue}>
                      {isPipelineLoading ? '–' : interviewCount}
                    </Display>
                    <Body style={styles.metricLabel}>Interview Loop</Body>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/jobs?stage=shortlisted' as any)}
                    style={state => [
                      styles.metricBox,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${shortlistCount} shortlisted applications`}>
                    <TrendingUp size={16} color="#2F4F00" />
                    <Display style={[styles.metricValue, styles.metricValueAccent]}>
                      {isPipelineLoading ? '–' : shortlistCount}
                    </Display>
                    <Body style={styles.metricLabel}>Shortlisted</Body>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/jobs?stage=scouted' as any)}
                    style={state => [
                      styles.metricBox,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${scoutedCount} AI scouted roles`}>
                    <Bot size={16} color="#5A5D54" />
                    <Display style={styles.metricValue}>
                      {isPipelineLoading ? '–' : scoutedCount}
                    </Display>
                    <Body style={styles.metricLabel}>AI Scouted</Body>
                  </Pressable>
                </View>
              </View>

              {/* Section: Career Preparation & Tools */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Heading style={styles.sectionTitle}>Career Tools</Heading>
                </View>

                <View style={styles.toolsContainer}>
                  <Pressable
                    onPress={() => router.push('/cv' as any)}
                    style={state => [
                      styles.toolCard,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Open CV Studio and ATS Tailor">
                    <View style={styles.toolIconCircle}>
                      <FileText size={18} color="#121212" />
                    </View>
                    <View style={styles.toolContent}>
                      <Heading style={styles.toolTitle}>CV Studio & ATS Tailor</Heading>
                      <Body style={styles.toolSub}>
                        Master dossier with achievements & ATS keyword alignment.
                      </Body>
                    </View>
                    <ArrowRight size={16} color="#121212" />
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/agent' as any)}
                    style={state => [
                      styles.toolCard,
                      styles.toolCardHighlighted,
                      state.pressed && styles.pressedFade,
                      Platform.OS === 'web' && (state as { focused?: boolean }).focused
                        ? styles.webFocusRing
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Open AI Career Hunter Co-Pilot">
                    <View style={[styles.toolIconCircle, styles.toolIconLime]}>
                      <Bot size={18} color="#121212" />
                    </View>
                    <View style={styles.toolContent}>
                      <Heading style={styles.toolTitle}>AI Career Hunter Co-Pilot</Heading>
                      <Body style={styles.toolSub}>
                        Targeted discovery across curated role feeds & career boards.
                      </Body>
                    </View>
                    <ArrowRight size={16} color="#121212" />
                  </Pressable>
                </View>
              </View>

              {/* Section: Session / Sign out */}
              <View style={styles.signOutSection}>
                {signOutError ? (
                  <View style={styles.inlineWarning} accessibilityLiveRegion="polite">
                    <AlertCircle size={14} color="#991B1B" />
                    <Body style={styles.inlineWarningText}>{signOutError}</Body>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleSignOut}
                  disabled={isSigningOut}
                  style={state => [
                    styles.signOutButton,
                    isSigningOut && styles.disabledButton,
                    state.pressed && !isSigningOut && styles.pressedFade,
                    Platform.OS === 'web' && (state as { focused?: boolean }).focused
                      ? styles.webFocusRing
                      : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ busy: isSigningOut, disabled: isSigningOut }}
                  accessibilityLabel="Sign out of JobHub">
                  {isSigningOut ? (
                    <ActivityIndicator size="small" color="#991B1B" />
                  ) : (
                    <>
                      <LogOut size={15} color="#991B1B" strokeWidth={2.2} />
                      <Text style={styles.signOutText}>Sign out of JobHub</Text>
                    </>
                  )}
                </Pressable>
                <Text style={styles.buildInfoText}>
                  JobHub v1.0.0 · Career Operating System
                </Text>
              </View>
            </>
          )}
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
  contentWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
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
    gap: 12,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    color: '#121212',
    fontWeight: '900',
  },
  editHeaderButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  editHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  stateBox: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  stateBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    maxWidth: 300,
  },
  retryBtn: {
    marginTop: 4,
    minHeight: 44,
    minWidth: 110,
    backgroundColor: '#121212',
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  retryBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: '#121212',
    borderRadius: Radius.lg,
    padding: 22,
    marginHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2A2D26',
    gap: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  role: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  verifiedBadge: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1C1E1A',
    borderWidth: 1,
    borderColor: '#2A2D26',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedText: {
    fontSize: 10.5,
    color: '#B8F23E',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  viewTrackerBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  viewTrackerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2F4F00',
  },
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 14,
  },
  preferenceBlock: {
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F0',
  },
  preferenceBlockLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
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
    paddingVertical: 5,
    borderRadius: Radius.sm,
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
    borderRadius: Radius.sm,
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
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  locationChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5A5D54',
  },
  emptyPreferenceText: {
    fontSize: 12,
    color: '#5A5D54',
    fontStyle: 'italic',
  },
  compensationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compensationValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  inlineWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  inlineWarningText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    minHeight: 96,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  metricValue: {
    fontSize: 22,
    lineHeight: 26,
    color: '#121212',
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  metricValueAccent: {
    color: '#2F4F00',
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#5A5D54',
    fontWeight: '600',
    textAlign: 'center',
  },
  toolsContainer: {
    gap: 10,
  },
  toolCard: {
    minHeight: 74,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  toolCardHighlighted: {
    borderColor: '#C5D89B',
  },
  toolIconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
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
  toolSub: {
    fontSize: 11.5,
    color: '#5A5D54',
    lineHeight: 16,
  },
  signOutSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  signOutButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: Radius.full,
    paddingVertical: 12,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    letterSpacing: 0.2,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buildInfoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
    letterSpacing: 0.3,
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
