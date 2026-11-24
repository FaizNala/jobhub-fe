import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Calendar, Bot, ArrowRight } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { Label } from '@/components/atoms/typography';

interface CareerPulseCardProps {
  nextInterviewCompany?: string;
  nextInterviewStage?: string;
  nextInterviewTime?: string;
  hunterDiscoveredCount?: number;
}

export function CareerPulseCard({
  nextInterviewCompany = 'Uber',
  nextInterviewStage = 'Technical Deep Dive',
  nextInterviewTime = 'Thursday, 2:00 PM',
  hunterDiscoveredCount = 12,
}: CareerPulseCardProps) {
  const handleOpenTracker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/jobs');
  };

  const handleOpenHunter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/agent');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Label style={styles.headerLabel}>Schedule & Pipeline</Label>
          <Text style={styles.headerSub}>Live Activity</Text>
        </View>

        {/* Row 1: Next Actionable Interview */}
        <TouchableOpacity
          onPress={handleOpenTracker}
          activeOpacity={0.8}
          style={styles.actionRow}
          accessibilityRole="button"
          accessibilityLabel="View interview schedule in Tracker">
          <View style={styles.iconCircle}>
            <Calendar size={18} color="#16A34A" strokeWidth={2.2} />
          </View>

          <View style={styles.infoCol}>
            <View style={styles.labelRow}>
              <Text style={styles.rowTypeLabel}>Next Interview</Text>
              <View style={styles.activeDot} />
            </View>
            <Text style={styles.mainTitle}>
              {nextInterviewStage} · {nextInterviewCompany}
            </Text>
            <Text style={styles.subText}>{nextInterviewTime} (Stage 2 of 4)</Text>
          </View>

          <ArrowRight size={14} color="#8A8D84" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Row 2: Discovered Opportunities Feed */}
        <TouchableOpacity
          onPress={handleOpenHunter}
          activeOpacity={0.8}
          style={styles.actionRow}
          accessibilityRole="button"
          accessibilityLabel="Open AI Hunter radar">
          <View style={[styles.iconCircle, styles.hunterIconCircle]}>
            <Bot size={18} color="#0369A1" strokeWidth={2.2} />
          </View>

          <View style={styles.infoCol}>
            <View style={styles.labelRow}>
              <Text style={styles.rowTypeLabel}>Discovered Matches</Text>
            </View>
            <Text style={styles.mainTitle}>
              {hunterDiscoveredCount} opportunities pending review
            </Text>
            <Text style={styles.subText}>Synced from your active agent queue</Text>
          </View>

          <ArrowRight size={14} color="#8A8D84" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    padding: 16,
    gap: 12,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#73786B',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hunterIconCircle: {
    backgroundColor: '#E0F2FE',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTypeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5A5D54',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#16A34A',
  },
  mainTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#121212',
  },
  subText: {
    fontSize: 11.5,
    color: '#73786B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F3EA',
  },
});
