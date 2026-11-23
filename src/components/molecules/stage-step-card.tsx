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
  const getStageColor = () => {
    switch (stage.colorVariant) {
      case 'purple':
        return {
          bg: '#F3F0FF',
          badgeBg: '#635BFF',
          badgeText: '#FFFFFF',
        };
      case 'coral':
        return {
          bg: '#FFF1EE',
          badgeBg: '#FF6B57',
          badgeText: '#FFFFFF',
        };
      case 'yellow':
        return {
          bg: '#FFFBEB',
          badgeBg: '#F5C242',
          badgeText: '#121212',
        };
      case 'lime':
      default:
        return {
          bg: '#F5FDE8',
          badgeBg: '#B8F23E',
          badgeText: '#121212',
        };
    }
  };

  const colors = getStageColor();

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
      style={[styles.card, { backgroundColor: colors.bg }]}>
      <View style={styles.topRow}>
        <View style={[styles.stageBadge, { backgroundColor: colors.badgeBg }]}>
          <Label style={{ color: colors.badgeText, fontSize: 11 }}>
            STAGE {stage.stageNumber}
          </Label>
        </View>

        {stage.duration ? (
          <View style={styles.durationChip}>
            <Clock size={12} color={Colors.light.textSecondary} />
            <Body style={styles.durationText}>{stage.duration}</Body>
          </View>
        ) : null}

        <View style={styles.arrowCircle}>
          <ArrowUpRight size={14} color="#121212" />
        </View>
      </View>

      <Heading style={styles.title}>{stage.title}</Heading>
      <Body style={styles.description}>{stage.description}</Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    marginRight: 10,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: '#121212',
  },
  description: {
    fontSize: 13,
    color: '#4B4D46',
    lineHeight: 18,
  },
});
