import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bookmark } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { MOCK_JOBS } from '@/constants/mock-jobs';
import { Job } from '@/types/job';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { BentoJobCard } from '@/components/organisms/bento-job-card';
import { JobDetailModal } from '@/components/organisms/job-detail-modal';

export default function JobsScreen() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Showing first 2 jobs as saved
  const savedJobs = MOCK_JOBS.slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <Bookmark size={16} color="#121212" fill="#B8F23E" />
            </View>
            <Label style={styles.badgeText}>SAVED ROLES</Label>
          </View>

          <Display style={styles.title}>
            BOOKMARKED{'\n'}POSITIONS
          </Display>
          <Body style={styles.subtitle}>
            Review your shortlisted roles and track active interview deadlines.
          </Body>
        </View>

        <View style={styles.listHeader}>
          <Heading style={styles.listTitle}>Shortlisted</Heading>
          <Body style={styles.countText}>{savedJobs.length} Saved Roles</Body>
        </View>

        {savedJobs.map(job => (
          <BentoJobCard
            key={job.id}
            job={job}
            onPress={jobItem => setSelectedJob(jobItem)}
          />
        ))}
      </ScrollView>

      <JobDetailModal
        job={selectedJob}
        visible={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
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
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#121212',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    color: '#121212',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6D66',
    lineHeight: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 16,
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
});
