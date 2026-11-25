import React, { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Redirect } from 'expo-router';
import { Colors } from '@/constants/theme';
import {
  useJobs,
  ExploreHeader,
  CareerPulseCard,
  MiniAppGateway,
  DailyMatchHeroBanner,
  DailyMatchModal,
  JobDetailModal,
  DossierReadinessCard,
} from '@/modules/jobs';
import { useOnboardingStore } from '@/modules/onboarding';

export default function HomeScreen() {
  const isHydrated = useOnboardingStore((state) => state.isHydrated);
  const hasCompletedWalkthrough = useOnboardingStore((state) => state.hasCompletedWalkthrough);

  const {
    jobs,
    activeJob,
    isLoading,
    setActiveJob,
    refresh,
  } = useJobs();

  const [isDailyMatchVisible, setIsDailyMatchVisible] = useState(false);

  // First-time cold launch: redirect to onboarding once storage is hydrated
  if (isHydrated && !hasCompletedWalkthrough) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* 1. Header: Candidate Greeting */}
      <ExploreHeader candidateName="Michel Clark" />

      {/* 2. Main Executive Gateway Dashboard */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              refresh();
            }}
            tintColor="#38A100"
            colors={['#38A100']}
          />
        }>
        {/* Section A: Daily Match Hero Spotlight (Dark Obsidian Card) */}
        <DailyMatchHeroBanner
          count={5}
          topRole="Senior Mobile Engineer"
          topCompany="Stripe"
          topScore={94}
          topSalary="$145k - $175k / yr"
          topLocation="San Francisco, CA"
          topWorkplace="Remote"
          onOpenDeck={() => setIsDailyMatchVisible(true)}
        />

        {/* Section B: Compact Quick-Action Rail (Career Launchpad) */}
        <MiniAppGateway
          onOpenDailyMatch={() => setIsDailyMatchVisible(true)}
          unreviewedMatchCount={5}
        />

        {/* Section C: Actionable Career Intelligence (Activity & Radar Pulse) */}
        <CareerPulseCard
          nextInterviewCompany="Uber"
          nextInterviewStage="Technical Deep Dive"
          nextInterviewTime="Thursday, 2:00 PM"
          hunterDiscoveredCount={12}
        />

        {/* Section D: Dossier & ATS Readiness */}
        <DossierReadinessCard />
      </ScrollView>

      {/* 3. Interactive Daily Match Deck Modal (Mini-App Triage Experience) */}
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
    paddingBottom: 110, // Breathing space so FloatingDock never overlaps
    gap: 14,
  },
});
