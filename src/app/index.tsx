import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';
import { Heading, Body } from '@/components/atoms/typography';
import {
  useJobs,
  BentoJobCard,
  FilterPillBar,
  JobDetailModal,
  ExploreHeader,
} from '@/modules/jobs';

export default function HomeScreen() {
  const {
    jobs,
    selectedCategory,
    activeJob,
    setSelectedCategory,
    setActiveJob,
  } = useJobs();

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
          <Body style={styles.countText}>{jobs.length} Positions Available</Body>
        </View>

        {/* Bento Job Cards List */}
        {jobs.map(job => (
          <BentoJobCard
            key={job.id}
            job={job}
            onPress={selected => setActiveJob(selected)}
          />
        ))}

        {jobs.length === 0 ? (
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
    paddingBottom: 110, // Gives ample space above floating dock
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
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    color: '#5A5D54',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    color: '#121212',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#5A5D54',
    textAlign: 'center',
  },
});
