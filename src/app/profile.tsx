import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, ShieldCheck, Mail, Briefcase, Award } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Display, Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { PillButton } from '@/components/atoms/pill-button';

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
          <View style={styles.avatarBig}>
            <Label style={styles.avatarText}>MC</Label>
          </View>

          <Heading style={styles.name}>Michel Clark</Heading>
          <Body style={styles.role}>Staff Frontend & Mobile Engineer</Body>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Mail size={13} color="#6B6D66" />
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
            <BadgeChip label="Design Systems" variant="purple" />
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
    paddingBottom: 100,
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
    backgroundColor: Colors.light.primary,
    borderWidth: 1.5,
    borderColor: '#121212',
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
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 8,
  },
  avatarBig: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#121212',
    marginBottom: 6,
  },
  avatarText: {
    fontSize: 20,
    color: '#121212',
  },
  name: {
    fontSize: 20,
    color: '#121212',
  },
  role: {
    fontSize: 13,
    color: '#6B6D66',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#6B6D66',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 4,
  },
  metricValue: {
    fontSize: 26,
    lineHeight: 30,
    color: '#121212',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B6D66',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
