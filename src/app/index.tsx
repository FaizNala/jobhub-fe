import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Redirect } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Body, Heading, Label } from '@/components/atoms/typography';
import { useCandidateProfile, useCvHealth } from '@/modules/cv-studio';
import { usePipeline } from '@/modules/pipeline';
import {
  CareerPulseCard,
  DailyMatchHeroBanner,
  DailyMatchModal,
  DossierReadinessCard,
  ExploreHeader,
  JobDetailModal,
  MiniAppGateway,
  useJobs,
} from '@/modules/jobs';
import { useOnboardingStore } from '@/modules/onboarding';

export default function HomeScreen() {
  const isHydrated = useOnboardingStore(state => state.isHydrated);
  const hasCompletedWalkthrough = useOnboardingStore(
    state => state.hasCompletedWalkthrough
  );

  const { jobs, activeJob, isLoading, error, setActiveJob, refresh } = useJobs();
  const { profile, refresh: refreshProfile } = useCandidateProfile();
  const cvHealth = useCvHealth(profile);
  const {
    allItems,
    countsByStage,
    getAll: refreshPipeline,
  } = usePipeline();

  const [isDailyMatchVisible, setIsDailyMatchVisible] = useState(false);

  // First-time cold launch: redirect to onboarding once storage is hydrated
  if (isHydrated && !hasCompletedWalkthrough) {
    return <Redirect href="/onboarding" />;
  }

  const candidateName = profile?.fullName || 'Candidate';
  const topJob = jobs[0];
  const scoutedCount = countsByStage.scouted ?? 0;
  const nextInterviewItem = allItems.find(item => item.stage === 'interviewing');

  const handleRefresh = () => {
    Promise.all([
      refresh(),
      refreshProfile(),
      refreshPipeline(undefined, { silent: true }),
    ]).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#121212"
            colors={['#121212']}
          />
        }>
        <View style={styles.contentWrapper}>
          {/* 1. Header: Candidate Greeting */}
          <ExploreHeader candidateName={candidateName} />

          {/* 2. Loading, Error, Empty, or Dashboard Content */}
          {isLoading && jobs.length === 0 ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <ActivityIndicator size="small" color="#121212" />
              <Body style={styles.stateBody}>Loading curated opportunities...</Body>
            </View>
          ) : error && jobs.length === 0 ? (
            <View style={styles.stateBox} accessibilityLiveRegion="polite">
              <AlertCircle size={22} color="#991B1B" />
              <Heading style={styles.stateTitle}>Unable to load opportunities</Heading>
              <Body style={styles.stateBody}>{error}</Body>
              <Pressable
                onPress={handleRefresh}
                style={state => [
                  styles.retryBtn,
                  state.pressed && styles.pressedFade,
                  Platform.OS === 'web' && (state as { focused?: boolean }).focused
                    ? styles.webFocusRing
                    : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Retry loading opportunities">
                <Label style={styles.retryBtnText}>RETRY</Label>
              </Pressable>
            </View>
          ) : (
            <View style={styles.sectionsStack}>
              {/* Section A: Daily Match Hero Spotlight or Empty Notice */}
              {topJob ? (
                <DailyMatchHeroBanner
                  topJob={topJob}
                  count={jobs.length}
                  topScore={94}
                  onInspectTopJob={() => setActiveJob(topJob)}
                  onOpenDeck={() => setIsDailyMatchVisible(true)}
                />
              ) : (
                <View style={styles.stateBox}>
                  <Heading style={styles.stateTitle}>No matches queued yet</Heading>
                  <Body style={styles.stateBody}>
                    Check back shortly or launch AI Hunter to discover fresh roles.
                  </Body>
                </View>
              )}

              {/* Section B: Compact Quick-Action Rail */}
              <MiniAppGateway
                onOpenDailyMatch={() => setIsDailyMatchVisible(true)}
                unreviewedMatchCount={jobs.length}
                hunterDiscoveredCount={scoutedCount}
              />

              {/* Section C: Actionable Career Intelligence */}
              <CareerPulseCard
                hasScheduledInterview={Boolean(nextInterviewItem)}
                nextInterviewCompany={nextInterviewItem?.job.company}
                nextInterviewStage={nextInterviewItem?.job.title}
                nextInterviewTime={
                  nextInterviewItem?.nextInterviewDate ||
                  (nextInterviewItem?.job.interviewStages?.[0]?.title
                    ? `${nextInterviewItem.job.interviewStages[0].title} · Active loop`
                    : 'Interview loop active')
                }
                hunterDiscoveredCount={scoutedCount}
              />

              {/* Section D: Dossier & ATS Readiness */}
              <DossierReadinessCard
                candidateName={profile?.fullName}
                atsScore={cvHealth?.score}
                summaryText={
                  profile?.headline
                    ? `Master dossier tailored for ${profile.headline}. Open CV Studio to review or export.`
                    : undefined
                }
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* 3. Interactive Daily Match Deck Modal */}
      <DailyMatchModal
        visible={isDailyMatchVisible}
        onClose={() => setIsDailyMatchVisible(false)}
        jobs={jobs}
      />

      {/* 4. Single Job Detail Modal */}
      <JobDetailModal
        job={activeJob}
        visible={Boolean(activeJob)}
        onClose={() => setActiveJob(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 110,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  sectionsStack: {
    gap: 14,
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
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: Radius.full,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  retryBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
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
