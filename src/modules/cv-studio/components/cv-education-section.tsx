import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { Education } from '../cv.types';

export interface CvEducationSectionProps {
  education: Education[];
}

export const CvEducationSection: React.FC<CvEducationSectionProps> = ({ education }) => {
  if (!education || education.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <GraduationCap size={16} color="#121212" />
          <Heading style={styles.sectionTitle}>Education</Heading>
        </View>
        <Label style={styles.countBadge}>{education.length} DEGREE</Label>
      </View>

      <View style={styles.list}>
        {education.map(edu => (
          <View key={edu.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.titleBlock}>
                <Heading style={styles.degreeTitle}>{edu.degree}</Heading>
                {edu.field ? (
                  <Body style={styles.fieldTitle}>{edu.field}</Body>
                ) : null}
                <Body style={styles.schoolName}>{edu.school}</Body>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{edu.year}</Label>
              </View>
            </View>

            {edu.gpa ? (
              <View style={styles.gpaContainer}>
                <Label style={styles.gpaText}>{edu.gpa}</Label>
              </View>
            ) : null}

            {edu.highlights && edu.highlights.length > 0 ? (
              <View style={styles.highlightsContainer}>
                {edu.highlights.map((h, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Body style={styles.bulletText}>{h}</Body>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  countBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#73786B',
    letterSpacing: 0.5,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  degreeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  fieldTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2F4F00',
  },
  schoolName: {
    fontSize: 12,
    color: '#5A5D54',
    marginTop: 2,
  },
  periodPill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  periodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5A5D54',
  },
  gpaContainer: {
    backgroundColor: '#F9FAF7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  gpaText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4A4D44',
  },
  highlightsContainer: {
    gap: 6,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#73786B',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 11.5,
    color: '#343830',
    lineHeight: 18,
  },
});
