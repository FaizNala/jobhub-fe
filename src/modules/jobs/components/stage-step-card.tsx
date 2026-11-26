import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ArrowUpRight, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { InterviewStage } from '@/types/job';
import { Heading, Body, Label } from '@/components/atoms/typography';

interface StageStepCardProps {
  stage: InterviewStage;
  onPress?: () => void;
}

export function StageStepCard({ stage, onPress }: StageStepCardProps) {
  const isFirst = stage.stageNumber === 1;

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Stage ${stage.stageNumber}: ${stage.title}`}
      style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.stageBadge, isFirst ? styles.stageBadgeActive : styles.stageBadgeNeutral]}>
          <Label style={styles.stageNumberText}>STAGE {stage.stageNumber}</Label>
        </View>

        <View style={styles.arrowCircle}>
          <ArrowUpRight size={16} color="#121212" strokeWidth={2.2} />
        </View>
      </View>

      <Heading style={styles.title}>{stage.title}</Heading>
      <Body style={styles.description}>{stage.description}</Body>

      {stage.duration ? (
        <View style={styles.durationRow}>
          <Clock size={12} color="#5A5D54" />
          <Body style={styles.durationText}>{stage.duration}</Body>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    padding: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.xs,
  },
  stageBadgeActive: {
    backgroundColor: Colors.light.primary, // Electric Lime for active stage
  },
  stageBadgeNeutral: {
    backgroundColor: Colors.light.tagBackground, // Clean soft neutral
  },
  stageNumberText: {
    fontSize: 11,
    color: '#121212',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#F4F6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#5A5D54',
    lineHeight: 18,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#5A5D54',
  },
});
