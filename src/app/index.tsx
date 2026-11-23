import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';
import { Job, JobCategory } from '@/types/job';
import { MOCK_JOBS } from '@/constants/mock-jobs';
import { ExploreHeader } from '@/components/organisms/explore-header';
import { FilterPillBar } from '@/components/molecules/filter-pill-bar';
import { BentoJobCard } from '@/components/organisms/bento-job-card';
import { JobDetailModal } from '@/components/organisms/job-detail-modal';
import { Heading, Body } from '@/components/atoms/typography';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('all');
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    if (selectedCategory === 'all') return MOCK_JOBS;
    if (selectedCategory === 'remote') {
      return MOCK_JOBS.filter(job => job.workplaceType === 'Remote');
    }
    return MOCK_JOBS.filter(job => job.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <ExploreHeader />

        {/* Category Filter Pills */}
        <FilterPillBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Vacancies Count Subtitle */}
        <View style={styles.listHeader}>
          <Heading style={styles.listTitle}>Featured Openings</Heading>
          <Body style={styles.countText}>{filteredJobs.length} Positions Available</Body>
        </View>

        {/* Bento Job Cards List */}
        {filteredJobs.map(job => (
          <BentoJobCard
            key={job.id}
            job={job}
            onPress={selected => setActiveJob(selected)}
          />
        ))}

        {filteredJobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heading style={styles.emptyTitle}>No Vacancies Found</Heading>
            <Body style={styles.emptySubtitle}>
              Try selecting a different filter category above.
            </Body>
          </View>
        ) : null}
      </ScrollView>

      {/* Interactive Detail & Interview Stages Modal */}
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
  scrollContent: {
    paddingBottom: 60,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    color: '#121212',
  },
  countText: {
    fontSize: 12,
    color: '#6B6D66',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#121212',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B6D66',
    textAlign: 'center',
  },
});
