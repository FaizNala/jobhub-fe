import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Briefcase, MapPin } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { WorkExperience } from '../cv.types';

export interface CvExperienceListProps {
  experiences: WorkExperience[];
}

export const CvExperienceList: React.FC<CvExperienceListProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Work Experience Section */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Briefcase size={15} color="#121212" />
          <Heading style={styles.sectionTitle}>Work Experience</Heading>
        </View>
        <Label style={styles.countBadge}>{experiences.length} POSITIONS</Label>
      </View>

      <View style={styles.list}>
        {experiences.map(exp => (
          <View key={exp.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Heading style={styles.roleTitle}>{exp.role}</Heading>
                <View style={styles.companyRow}>
                  <Body style={styles.companyName}>{exp.company}</Body>
                  {exp.location ? (
                    <>
                      <View style={styles.dot} />
                      <MapPin size={11} color="#5A5D54" />
                      <Body style={styles.locationText}>{exp.location}</Body>
                    </>
                  ) : null}
                </View>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{exp.period}</Label>
              </View>
            </View>

            {/* Highlights */}
            <View style={styles.highlightsContainer}>
              {exp.highlights.map((highlight, index) => {
                const isQuantified = /%|\$|\d+k|\d+M/i.test(highlight);
                return (
                  <View key={index} style={styles.bulletRow}>
                    <View
                      style={[
                        styles.bulletDot,
                        isQuantified && styles.bulletDotQuantified,
                      ]}
                    />
                    <Body style={styles.bulletText}>{highlight}</Body>
                  </View>
                );
              })}
            </View>
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
    color: '#5A5D54',
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
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  companyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F4F00',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CCD2C0',
  },
  locationText: {
    fontSize: 11,
    color: '#5A5D54',
  },
  periodPill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E6DC',
  },
  periodText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5A5D54',
  },
  highlightsContainer: {
    gap: 6,
    paddingTop: 4,
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
    backgroundColor: '#5A5D54',
    marginTop: 7,
  },
  bulletDotQuantified: {
    backgroundColor: '#2F4F00',
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#343830',
  },
});
