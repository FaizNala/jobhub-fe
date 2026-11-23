import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ArrowUpRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '@/constants/theme';
import { Job } from '@/types/job';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { BadgeChip } from '@/components/atoms/badge-chip';
import { CompanyLogo } from '@/components/atoms/company-logo';

interface BentoJobCardProps {
  job: Job;
  onPress: (job: Job) => void;
}

export function BentoJobCard({ job, onPress }: BentoJobCardProps) {
  const scale = useSharedValue(1);
  const isDarkHero = Boolean(job.isFeatured);

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
          isDarkHero ? styles.cardHero : styles.cardLight,
        ]}>
        {/* Header row: Real Brand Logo + Info + Arrow Button */}
        <View style={styles.headerRow}>
          <View style={styles.companyInfo}>
            <CompanyLogo company={job.company} size={42} />
            <View>
              <Label style={[styles.companyName, isDarkHero && styles.textWhite]}>
                {job.company}
              </Label>
              <Body style={[styles.locationText, isDarkHero && styles.textMuted]}>
                {job.location} · {job.workplaceType}
              </Body>
            </View>
          </View>

          <View style={[styles.actionCircle, isDarkHero ? styles.actionCircleHero : styles.actionCircleLight]}>
            <ArrowUpRight
              size={18}
              color={isDarkHero ? '#121212' : '#121212'}
              strokeWidth={2.4}
            />
          </View>
        </View>

        {/* Job Title */}
        <Heading style={[styles.jobTitle, isDarkHero && styles.textWhite]}>
          {job.title}
        </Heading>

        {/* Tags and Salary row */}
        <View style={styles.bottomRow}>
          <BadgeChip
            label={job.salary}
            variant="lime"
          />
          <BadgeChip
            label={job.employmentType}
            variant={isDarkHero ? 'dark' : 'neutral'}
            style={isDarkHero ? { backgroundColor: 'rgba(255,255,255,0.14)' } : undefined}
          />
          {job.tags[0] ? (
            <BadgeChip
              label={job.tags[0]}
              variant={isDarkHero ? 'dark' : 'neutral'}
              style={isDarkHero ? { backgroundColor: 'rgba(255,255,255,0.14)' } : undefined}
            />
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
    gap: 14,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHero: {
    backgroundColor: '#121212',
    borderWidth: 1.5,
    borderColor: '#22241F',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
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
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#121212',
  },
  locationText: {
    fontSize: 12,
    color: '#5A5D54',
  },
  actionCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleLight: {
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionCircleHero: {
    backgroundColor: Colors.light.primary, // Electric Lime in dark hero card
  },
  jobTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#121212',
  },
  bottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textMuted: {
    color: '#A0A49B',
  },
});
