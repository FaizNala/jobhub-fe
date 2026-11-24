import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MapPin, Info, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Job } from '../jobs.types';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { CompanyLogo } from '@/components/atoms/company-logo';
import { Radius } from '@/constants/theme';

interface MatchDeckCardProps {
  job: Job;
  score?: number;
  onPressDetails: (job: Job) => void;
}

function DeckRadialScore({ score }: { score: number }) {
  const size = 46;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const strokeColor = progress >= 90 ? '#38A100' : progress >= 80 ? '#16A34A' : '#0284C7';
  const trackColor = progress >= 90 ? '#E2F7BE' : progress >= 80 ? '#DCFCE7' : '#E0F2FE';
  const fillColor = progress >= 90 ? '#F4FDE8' : progress >= 80 ? '#F0FDF4' : '#F0F9FF';
  const textColor = progress >= 90 ? '#1E4600' : progress >= 80 ? '#14532D' : '#0369A1';

  return (
    <View style={styles.scoreGaugeWrapper}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill={fillColor}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
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
            <Text style={[styles.gaugeScoreText, { color: textColor }]}>{score}%</Text>
          </View>
        </View>
      </View>
      <Label style={styles.gaugeSublabel}>CV FIT</Label>
    </View>
  );
}

export function MatchDeckCard({
  job,
  score = 94,
  onPressDetails,
}: MatchDeckCardProps) {
  const handleDetailsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPressDetails(job);
  };

  return (
    <View style={styles.cardContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardScrollContent}>
        {/* 1 & 2. Company Logo + Role Title + Company/Location (PipelineCard layout) */}
        <View style={styles.jobHeaderGroup}>
          <CompanyLogo company={job.company} size={42} />
          <View style={styles.titleInfoCol}>
            <Heading style={styles.jobTitle} numberOfLines={2}>
              {job.title}
            </Heading>
            <View style={styles.companyRow}>
              <Text style={styles.companyName}>{job.company}</Text>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.locationText}>
                {job.location} ({job.workplaceType})
              </Text>
            </View>
          </View>

          <DeckRadialScore score={score} />
        </View>

        {/* 3 & 4. Salary Pill & Tech Keyword Tags */}
        <View style={styles.badgesRow}>
          <View style={styles.salaryPill}>
            <Text style={styles.salaryText}>{job.salary}</Text>
          </View>
          <View style={styles.typePill}>
            <Text style={styles.typeText}>{job.employmentType}</Text>
          </View>
          {job.tags.map(tag => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 5. Key Fit Highlights */}
        <View style={styles.highlightsSection}>
          <Label style={styles.sectionHeading}>KEY FIT HIGHLIGHTS</Label>

          <View style={styles.bulletRow}>
            <CheckCircle2 size={13} color="#2F4F00" style={styles.bulletIcon} />
            <Body style={styles.bulletText}>
              Direct ownership of production architecture with modern Expo & React Native.
            </Body>
          </View>

          <View style={styles.bulletRow}>
            <CheckCircle2 size={13} color="#2F4F00" style={styles.bulletIcon} />
            <Body style={styles.bulletText}>
              High profile match: 94% keyword alignment with your validated CV achievements.
            </Body>
          </View>

          <View style={styles.bulletRow}>
            <CheckCircle2 size={13} color="#2F4F00" style={styles.bulletIcon} />
            <Body style={styles.bulletText}>
              Includes competitive equity package, $3,000 learning stipend & top tier healthcare.
            </Body>
          </View>
        </View>

        {/* 6. Interview Process */}
        {job.interviewStages && job.interviewStages.length > 0 ? (
          <View style={styles.interviewPreviewSection}>
            <Label style={styles.sectionHeading}>
              INTERVIEW PROCESS ({job.interviewStages.length} STAGES)
            </Label>
            <View style={styles.stagesTrack}>
              {job.interviewStages.map((st, idx) => (
                <View key={st.stageNumber} style={styles.stageChip}>
                  <Text style={styles.stageNum}>{idx + 1}</Text>
                  <Text style={styles.stageName} numberOfLines={1}>
                    {st.title.replace(/\s+Call|\s+Screen/i, '')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* 7. Tap For Full Details Link */}
        <TouchableOpacity
          onPress={handleDetailsPress}
          style={styles.detailsLinkBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Read full job description and requirements">
          <Info size={13} color="#5A5D54" />
          <Text style={styles.detailsLinkText}>Tap to view full description & requirements</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardScrollContent: {
    padding: 18,
    gap: 13,
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
  jobTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  companyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
    letterSpacing: -0.2,
  },
  dotSeparator: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  locationText: {
    fontSize: 12,
    color: '#73786B',
    fontWeight: '500',
  },
  scoreGaugeWrapper: {
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  gaugeScoreText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  gaugeSublabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#5A5D54',
    letterSpacing: 0.6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  salaryPill: {
    backgroundColor: '#F7FEE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#D9F99D',
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E4600',
  },
  typePill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
  },
  tagChip: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  highlightsSection: {
    backgroundColor: '#F8FAF6',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E9EFE2',
    padding: 12,
    gap: 8,
  },
  sectionHeading: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#5A5D54',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 17,
    flex: 1,
  },
  interviewPreviewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#ECEFE7',
    padding: 12,
    gap: 8,
  },
  stagesTrack: {
    flexDirection: 'row',
    gap: 8,
  },
  stageChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stageNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#121212',
    backgroundColor: '#FFFFFF',
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  stageName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#121212',
    flex: 1,
  },
  detailsLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    marginTop: 2,
  },
  detailsLinkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#5A5D54',
  },
});
