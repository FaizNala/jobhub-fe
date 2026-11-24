import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react-native';
import { Heading, Body, Label } from '@/components/atoms/typography';

interface MatchDeckEmptyProps {
  trackedCount: number;
  onResetDeck: () => void;
}

export function MatchDeckEmpty({ trackedCount, onResetDeck }: MatchDeckEmptyProps) {
  const handleOpenTracker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.replace('/jobs');
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onResetDeck();
  };

  return (
    <View style={styles.container}>
      {/* Icon Circle */}
      <View style={styles.celebrationCircle}>
        <CheckCircle2 size={36} color="#2F4F00" strokeWidth={2.2} />
      </View>

      {/* Title & Body */}
      <Heading style={styles.title}>All Caught Up for Today!</Heading>
      <Body style={styles.subtitle}>
        You have triaged all curated opportunities in today’s daily deck. AI Hunter is actively scouting new matches across greenhouse, lever & ashby boards.
      </Body>

      {/* Action 1: Jump to Tracker */}
      <TouchableOpacity
        onPress={handleOpenTracker}
        style={styles.trackerBtn}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Go to Tracker">
        <Text style={styles.trackerBtnText}>
          VIEW IN TRACKER ({trackedCount} ACTIVE)
        </Text>
        <ArrowRight size={15} color="#121212" strokeWidth={2.4} />
      </TouchableOpacity>

      {/* Action 2: Reset Deck */}
      <TouchableOpacity
        onPress={handleReset}
        style={styles.resetBtn}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Review matches again">
        <RotateCcw size={14} color="#5A5D54" />
        <Label style={styles.resetBtnText}>REVIEW MATCHES AGAIN</Label>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  celebrationCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFFCD3',
    borderWidth: 1.5,
    borderColor: '#B8F23E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#121212',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackerBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#B8F23E',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  trackerBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#121212',
    letterSpacing: 0.5,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.4,
  },
});
