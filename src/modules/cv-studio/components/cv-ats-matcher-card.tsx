import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Target, Check, Plus, Sparkles } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { ATSMatchResult } from '../cv.types';

export interface TargetJobOption {
  id: string;
  title: string;
  company: string;
}

export interface CvAtsMatcherCardProps {
  targetJobs: TargetJobOption[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  atsResult: ATSMatchResult | null;
  isCalculating: boolean;
}

export const CvAtsMatcherCard: React.FC<CvAtsMatcherCardProps> = ({
  targetJobs,
  selectedJobId,
  onSelectJob,
  atsResult,
  isCalculating,
}) => {
  const handleSelectJob = (id: string) => {
    Haptics.selectionAsync();
    onSelectJob(id);
  };

  const score = atsResult?.score ?? 85;
  const isHighMatch = score >= 80;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.iconCircle}>
            <Target size={14} color="#121212" />
          </View>
          <Heading style={styles.sectionTitle}>ATS BENCHMARK & GAP ANALYSIS</Heading>
        </View>
        <Label style={styles.countBadge}>TARGET ALIGNMENT</Label>
      </View>

      {/* Target Job Selector Pills */}
      {targetJobs.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.jobPillsContainer}>
          {targetJobs.map(job => {
            const isSelected = job.id === selectedJobId;
            return (
              <TouchableOpacity
                key={job.id}
                onPress={() => handleSelectJob(job.id)}
                activeOpacity={0.8}
                style={[
                  styles.jobPill,
                  isSelected ? styles.jobPillActive : styles.jobPillInactive,
                ]}>
                <Body
                  style={[
                    styles.jobPillCompany,
                    isSelected && styles.jobPillTextActive,
                  ]}>
                  {job.company}
                </Body>
                <Label
                  style={[
                    styles.jobPillTitle,
                    isSelected && styles.jobPillSubActive,
                  ]}>
                  {job.title}
                </Label>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      {/* Main Analysis Card */}
      <View style={styles.card}>
        {isCalculating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#121212" />
            <Body style={styles.loadingText}>Benchmarking against vacancy criteria...</Body>
          </View>
        ) : (
          <>
            {/* Score Row */}
            <View style={styles.scoreRow}>
              <View style={styles.scoreInfo}>
                <Heading style={styles.scoreHeading}>Keyword Match Rate</Heading>
                <Body style={styles.scoreSub}>
                  Calculated against current target requirements
                </Body>
              </View>
              <View
                style={[
                  styles.scoreBadge,
                  isHighMatch ? styles.scoreBadgeHigh : styles.scoreBadgeMed,
                ]}>
                <Heading
                  style={[
                    styles.scoreText,
                    isHighMatch ? styles.scoreTextHigh : styles.scoreTextMed,
                  ]}>
                  {score}%
                </Heading>
              </View>
            </View>

            {/* Visual Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${score}%` },
                  isHighMatch ? styles.barFillHigh : styles.barFillMed,
                ]}
              />
            </View>

            {/* Keyword Columns */}
            <View style={styles.keywordsBlock}>
              {/* Matched Keywords */}
              <View style={styles.keywordSection}>
                <Label style={styles.keywordSectionLabel}>MATCHED KEYWORDS</Label>
                <View style={styles.chipsWrap}>
                  {atsResult?.matchedKeywords && atsResult.matchedKeywords.length > 0 ? (
                    atsResult.matchedKeywords.map((kw, i) => (
                      <View key={i} style={styles.matchedChip}>
                        <Check size={11} color="#2F4F00" />
                        <Body style={styles.matchedChipText}>{kw}</Body>
                      </View>
                    ))
                  ) : (
                    <Body style={styles.emptyKeywordText}>No direct keyword matches yet</Body>
                  )}
                </View>
              </View>

              {/* Missing Gaps */}
              <View style={styles.keywordSection}>
                <Label style={styles.keywordSectionLabel}>KEYWORD GAPS (RECOMMENDED)</Label>
                <View style={styles.chipsWrap}>
                  {atsResult?.missingKeywords && atsResult.missingKeywords.length > 0 ? (
                    atsResult.missingKeywords.map((kw, i) => (
                      <View key={i} style={styles.missingChip}>
                        <Plus size={11} color="#5A5D54" />
                        <Body style={styles.missingChipText}>{kw}</Body>
                      </View>
                    ))
                  ) : (
                    <Body style={styles.emptyKeywordText}>No missing keywords detected!</Body>
                  )}
                </View>
              </View>
            </View>

            {/* Tailor Tip */}
            {atsResult?.suggestions && atsResult.suggestions.length > 0 ? (
              <View style={styles.suggestionBox}>
                <View style={styles.suggestionHeader}>
                  <Sparkles size={13} color="#2F4F00" />
                  <Label style={styles.suggestionTitle}>TAILORING RECOMMENDATION</Label>
                </View>
                {atsResult.suggestions.map((sug, i) => (
                  <Body key={i} style={styles.suggestionText}>
                    • {sug}
                  </Body>
                ))}
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.5,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  jobPillsContainer: {
    gap: 8,
    paddingBottom: 12,
  },
  jobPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: 2,
  },
  jobPillActive: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  jobPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.light.border,
  },
  jobPillCompany: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
  },
  jobPillTitle: {
    fontSize: 10,
    color: '#5A5D54',
  },
  jobPillTextActive: {
    color: '#FFFFFF',
  },
  jobPillSubActive: {
    color: '#E8ECDF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#5A5D54',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreInfo: {
    flex: 1,
    gap: 2,
  },
  scoreHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#121212',
  },
  scoreSub: {
    fontSize: 12,
    color: '#5A5D54',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  scoreBadgeHigh: {
    backgroundColor: '#EFFCD3',
    borderColor: '#B8F23E',
  },
  scoreBadgeMed: {
    backgroundColor: '#FDF7E7',
    borderColor: '#F1D888',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreTextHigh: {
    color: '#2F4F00',
  },
  scoreTextMed: {
    color: '#8A5D00',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F4F6F0',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9999,
  },
  barFillHigh: {
    backgroundColor: '#B8F23E',
  },
  barFillMed: {
    backgroundColor: '#F1D888',
  },
  keywordsBlock: {
    gap: 12,
  },
  keywordSection: {
    gap: 6,
  },
  keywordSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.5,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matchedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  matchedChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2F4F00',
  },
  missingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  missingChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5A5D54',
  },
  emptyKeywordText: {
    fontSize: 12,
    color: '#5A5D54',
    fontStyle: 'italic',
  },
  suggestionBox: {
    backgroundColor: '#F9FAF7',
    borderRadius: Radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8ECDF',
    gap: 6,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2F4F00',
    letterSpacing: 0.5,
  },
  suggestionText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#343830',
  },
});
