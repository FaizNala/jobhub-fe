import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bookmark } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { Job, BentoJobCard, JobDetailModal } from '@/modules/jobs';
import { usePipeline } from '@/modules/pipeline';

export default function JobsScreen() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { items } = usePipeline();

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
            <Label style={styles.badgeText}>APPLICATION PIPELINE</Label>
          </View>

          <Display style={styles.title}>
            TRACKED{'\n'}POSITIONS
          </Display>
          <Body style={styles.subtitle}>
            Monitor your scouted leads, active submissions, and interview milestones.
          </Body>
        </View>

        <View style={styles.listHeader}>
          <Heading style={styles.listTitle}>Active Applications</Heading>
          <Body style={styles.countText}>{items.length} In Tracking</Body>
        </View>

        {items.map(item => (
          <BentoJobCard
            key={item.id}
            job={item.job}
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
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#121212',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: '#121212',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5A5D54',
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
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    color: '#5A5D54',
    fontWeight: '500',
  },
});
