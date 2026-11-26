import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { Radius } from '@/constants/theme';
import { Heading } from '@/components/atoms/typography';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { Job } from '../jobs.types';

interface DailyMatchHeroBannerProps {
  onOpenDeck: () => void;
  onInspectTopJob?: () => void;
  topJob?: Job;
  count?: number;
  topScore?: number;
}

function HeroDarkScoreRing({ score }: { score: number }) {
  const size = 46;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.scoreGaugeWrapper}>
      <View style={styles.gaugeSizeBox}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={strokeWidth}
            fill="rgba(184, 242, 62, 0.08)"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#B8F23E"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.gaugeCenterLabel}>
            <Text style={styles.gaugeScoreText}>{score}%</Text>
          </View>
        </View>
      </View>
      <Text style={styles.gaugeSublabel}>MATCH</Text>
    </View>
  );
}

export function DailyMatchHeroBanner({
  onOpenDeck,
  onInspectTopJob,
  topJob,
  count = 0,
  topScore = 94,
}: DailyMatchHeroBannerProps) {
  const roleTitle = topJob?.title || 'Curated Match Queue';
  const companyName = topJob?.company || 'Verified Employer';
  const salaryLabel = topJob?.salary;
  const locationLabel = topJob
    ? `${topJob.location} (${topJob.workplaceType})`
    : 'Location flexible';
  const tags = topJob?.tags ? topJob.tags.slice(0, 2) : [];

  const handlePressDeck = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onOpenDeck();
  };

  const handleInspect = () => {
    if (!onInspectTopJob) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onInspectTopJob();
  };

  const heroPreviewContent = (
    <>
      {/* Role Title + Company/Location + Score Gauge */}
      <View style={styles.jobHeaderGroup}>
        <View style={styles.titleInfoCol}>
          <Heading style={styles.roleTitle} numberOfLines={2}>
            {roleTitle}
          </Heading>
          <View style={styles.companyRow}>
            <CompanyLogo company={companyName} size={22} />
            <Text style={styles.companyText}>{companyName}</Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.locationText}>{locationLabel}</Text>
          </View>
        </View>

        <HeroDarkScoreRing score={topScore} />
      </View>

      {/* Salary & Top Skill Tags */}
      {salaryLabel || tags.length > 0 ? (
        <View style={styles.badgesRow}>
          {salaryLabel ? (
            <View style={styles.salaryPill}>
              <Text style={styles.salaryText}>{salaryLabel}</Text>
            </View>
          ) : null}
          {tags.map(tag => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Meta Header */}
        <View style={styles.topHeaderRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>TODAY&apos;S PICK</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{count} Curated</Text>
          </View>
        </View>

        {onInspectTopJob && topJob ? (
          <Pressable
            onPress={handleInspect}
            style={state => [
              styles.inspectArea,
              state.pressed && styles.pressedFade,
              Platform.OS === 'web' && (state as { focused?: boolean }).focused
                ? styles.webDarkFocusRing
                : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Inspect details for ${roleTitle} at ${companyName}`}>
            {heroPreviewContent}
          </Pressable>
        ) : (
          heroPreviewContent
        )}

        {/* Primary CTA Full-Width Button */}
        <Pressable
          onPress={handlePressDeck}
          style={state => [
            styles.actionBtn,
            state.pressed && styles.pressedFade,
            Platform.OS === 'web' && (state as { focused?: boolean }).focused
              ? styles.webDarkFocusRing
              : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Review Daily Match Deck with ${count} curated opportunities`}>
          <Text style={styles.actionBtnText}>Review Match Deck</Text>
          <View style={styles.actionBtnCircle} accessibilityElementsHidden>
            <ArrowRight size={14} color="#121212" strokeWidth={2.4} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: '#2A2D26',
    padding: 18,
    gap: 12,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#B8F23E',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.4,
  },
  countBadge: {
    backgroundColor: '#1C1E1A',
    borderWidth: 1,
    borderColor: '#2A2D26',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 0.4,
  },
  inspectArea: {
    gap: 12,
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  jobHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleInfoCol: {
    flex: 1,
    gap: 4,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 23,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  companyText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  locationText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  scoreGaugeWrapper: {
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  gaugeSizeBox: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCenterLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeScoreText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B8F23E',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  gaugeSublabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B8F23E',
    letterSpacing: 0.5,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  salaryPill: {
    backgroundColor: '#1C1E1A',
    borderWidth: 1,
    borderColor: '#365314',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: Radius.sm,
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B8F23E',
  },
  tagPill: {
    backgroundColor: '#1C1E1A',
    borderWidth: 1,
    borderColor: '#2A2D26',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  actionBtn: {
    minHeight: 48,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 18,
    paddingRight: 10,
    marginTop: 2,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.3,
  },
  actionBtnCircle: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedFade: {
    opacity: 0.82,
  },
  webDarkFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#B8F23E',
    outlineOffset: 2,
  } as any,
});
