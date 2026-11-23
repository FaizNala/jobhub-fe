import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, ShieldCheck, Mail, Briefcase, Award } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { PillButton } from '@/components/atoms/pill-button';
import { CandidateAvatar } from '@/components/atoms/candidate-avatar';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <User size={16} color="#121212" />
            </View>
            <Label style={styles.badgeText}>CANDIDATE DOSSIER</Label>
          </View>

          <Display style={styles.title}>
            APPLICANT{'\n'}PROFILE
          </Display>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <CandidateAvatar size={64} />

          <Heading style={styles.name}>Michel Clark</Heading>
          <Body style={styles.role}>Staff Frontend & Mobile Engineer</Body>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Mail size={13} color="#5A5D54" />
              <Body style={styles.metaText}>michel.clark@work.dev</Body>
            </View>
            <View style={styles.metaItem}>
              <ShieldCheck size={13} color="#2F4F00" />
              <Body style={styles.metaText}>Verified Profile</Body>
            </View>
          </View>

          <View style={styles.skillsRow}>
            <BadgeChip label="React Native" variant="lime" />
            <BadgeChip label="TypeScript" variant="neutral" />
            <BadgeChip label="Expo SDK" variant="neutral" />
            <BadgeChip label="Design Systems" variant="neutral" />
          </View>
        </View>

        {/* Application Status Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Briefcase size={18} color="#121212" />
            <Display style={styles.metricValue}>12</Display>
            <Body style={styles.metricLabel}>Submitted</Body>
          </View>

          <View style={styles.metricBox}>
            <Award size={18} color="#2F4F00" />
            <Display style={[styles.metricValue, { color: '#2F4F00' }]}>3</Display>
            <Body style={styles.metricLabel}>Interviews</Body>
          </View>
        </View>

        <View style={styles.actionSection}>
          <PillButton
            label="EDIT CANDIDATE PROFILE"
            variant="dark"
            onPress={() => {}}
            style={{ width: '100%' }}
          />
        </View>
      </ScrollView>
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
    paddingBottom: 16,
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 12,
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
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#5A5D54',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 34,
    color: '#121212',
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    color: '#5A5D54',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
