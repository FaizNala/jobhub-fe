import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { Radius } from '@/constants/theme';
import { Heading } from '@/components/atoms/typography';
import { CompanyLogo } from '@/components/atoms/company-logo';

interface DailyMatchHeroBannerProps {
  onOpenDeck: () => void;
  count?: number;
  topRole?: string;
  topCompany?: string;
  topScore?: number;
  topSalary?: string;
  topLocation?: string;
  topWorkplace?: string;
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
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.12)"
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
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
  count = 5,
  topRole = 'Senior Mobile Engineer',
  topCompany = 'Stripe',
  topScore = 94,
  topSalary = '$145k - $175k / yr',
  topLocation = 'San Francisco, CA',
  topWorkplace = 'Remote',
}: DailyMatchHeroBannerProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onOpenDeck();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Meta Header */}
        <View style={styles.topHeaderRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>TODAY'S PICK</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{count} Curated</Text>
          </View>
        </View>

        {/* 1 & 2. Role Title + Company/Location tightly grouped */}
        <View style={styles.jobHeaderGroup}>
          <View style={styles.titleInfoCol}>
            <Heading style={styles.roleTitle} numberOfLines={2}>
              {topRole}
            </Heading>
            <View style={styles.companyRow}>
              <CompanyLogo company={topCompany} size={22} />
              <Text style={styles.companyText}>{topCompany}</Text>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.locationText}>
                {topLocation} ({topWorkplace})
              </Text>
            </View>
          </View>

          <HeroDarkScoreRing score={topScore} />
        </View>

        {/* 3 & 4. Salary Pill & Requirement Keywords grouped on the same line */}
        <View style={styles.badgesRow}>
          <View style={styles.salaryPill}>
            <Text style={styles.salaryText}>{topSalary}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>React Native</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>TypeScript</Text>
          </View>
        </View>

        {/* Primary CTA Full-Width Button */}
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel="Open Daily Match Deck to review curated opportunities">
          <Text style={styles.actionBtnText}>Review Match Deck ({count})</Text>
          <View style={styles.actionBtnCircle}>
            <ArrowRight size={14} color="#121212" strokeWidth={2.4} />
          </View>
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
    backgroundColor: '#121212',
    borderRadius: Radius.xl,
    padding: 16,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 4,
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
    fontSize: 9.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.4,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  countBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 0.4,
  },
  jobHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleInfoCol: {
    flex: 1,
    gap: 4, // Tight, cohesive gap between Role and Company/Location!
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
    color: '#E5E7EB',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  scoreGaugeWrapper: {
    alignItems: 'center',
    gap: 1,
    marginTop: 2,
  },
  gaugeScoreText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B8F23E',
    letterSpacing: -0.3,
  },
  gaugeSublabel: {
    fontSize: 7.5,
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
    backgroundColor: 'rgba(184, 242, 62, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(184, 242, 62, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
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
    backgroundColor: '#B8F23E',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
    marginTop: 2,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.3,
  },
  actionBtnCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
