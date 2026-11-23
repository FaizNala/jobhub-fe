import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ArrowUpRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Job } from '@/types/job';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';

interface BentoJobCardProps {
  job: Job;
  onPress: (job: Job) => void;
}

export function BentoJobCard({ job, onPress }: BentoJobCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 14, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress(job);
  };

  const getCardAppearance = () => {
    switch (job.cardVariant) {
      case 'uber':
        return {
          bg: '#F5F2FF',
          borderColor: '#E4DCFF',
          companyInitialBg: '#635BFF',
          companyInitialColor: '#FFFFFF',
          tagVariant: 'purple' as const,
        };
      case 'amazon':
        return {
          bg: '#FFF9EB',
          borderColor: '#FEE8B6',
          companyInitialBg: '#F5C242',
          companyInitialColor: '#121212',
          tagVariant: 'yellow' as const,
        };
      case 'spotify':
        return {
          bg: '#F6FEE8',
          borderColor: '#DCF9A6',
          companyInitialBg: '#B8F23E',
          companyInitialColor: '#121212',
          tagVariant: 'lime' as const,
        };
      case 'google':
      default:
        return {
          bg: '#FFFFFF',
          borderColor: Colors.light.border,
          companyInitialBg: '#121212',
          companyInitialColor: '#FFFFFF',
          tagVariant: 'neutral' as const,
        };
    }
  };

  const current = getCardAppearance();

  return (
    <Animated.View style={[animatedStyle, styles.outerWrapper]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${job.title} at ${job.company}`}
        style={[
          styles.card,
          {
            backgroundColor: current.bg,
            borderColor: current.borderColor,
          },
        ]}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.companyInfo}>
            <View
              style={[
                styles.companyLogo,
                { backgroundColor: current.companyInitialBg },
              ]}>
              <Label style={{ color: current.companyInitialColor, fontSize: 14 }}>
                {job.companyInitial}
              </Label>
            </View>
            <View>
              <Label style={styles.companyName}>{job.company}</Label>
              <Body style={styles.locationText}>
                {job.location} · {job.workplaceType}
              </Body>
            </View>
          </View>

          <View style={styles.actionCircle}>
            <ArrowUpRight size={18} color="#121212" />
          </View>
        </View>

        {/* Job Title */}
        <Heading style={styles.jobTitle}>{job.title}</Heading>

        {/* Tags and Salary row */}
        <View style={styles.bottomRow}>
          <BadgeChip label={job.salary} variant="dark" />
          <BadgeChip label={job.employmentType} variant={current.tagVariant} />
          {job.tags[0] ? (
            <BadgeChip label={job.tags[0]} variant="neutral" />
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginHorizontal: 20,
    marginVertical: 6,
  },
  card: {
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1.5,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyLogo: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 15,
    color: '#121212',
  },
  locationText: {
    fontSize: 12,
    color: '#6B6D66',
  },
  actionCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 19,
    lineHeight: 24,
    color: '#121212',
  },
  bottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
});
