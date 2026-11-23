import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Briefcase, GraduationCap } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import { WorkExperience, Education } from '../cv.types';

export interface CvExperienceListProps {
  experiences: WorkExperience[];
  education: Education[];
}

export const CvExperienceList: React.FC<CvExperienceListProps> = ({
  experiences,
  education,
}) => {
  return (
    <View style={styles.container}>
      {/* Work Experience Section */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.iconCircle}>
            <Briefcase size={14} color="#121212" />
          </View>
          <Heading style={styles.sectionTitle}>WORK EXPERIENCE</Heading>
        </View>
        <Label style={styles.countBadge}>{experiences.length} ROLES</Label>
      </View>

      <View style={styles.list}>
        {experiences.map(exp => (
          <View key={exp.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Heading style={styles.roleTitle}>{exp.role}</Heading>
                <Body style={styles.companyName}>{exp.company}</Body>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{exp.period}</Label>
              </View>
            </View>

            {/* Highlights */}
            <View style={styles.highlightsContainer}>
              {exp.highlights.map((highlight, index) => (
                <View key={index} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Body style={styles.bulletText}>{highlight}</Body>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Education Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.iconCircle}>
            <GraduationCap size={15} color="#121212" />
          </View>
          <Heading style={styles.sectionTitle}>EDUCATION & CREDENTIALS</Heading>
        </View>
        <Label style={styles.countBadge}>{education.length} DEGREE</Label>
      </View>

      <View style={styles.list}>
        {education.map(edu => (
          <View key={edu.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Heading style={styles.roleTitle}>{edu.degree}</Heading>
                <Body style={styles.companyName}>{edu.school}</Body>
              </View>
              <View style={styles.periodPill}>
                <Label style={styles.periodText}>{edu.year}</Label>
              </View>
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
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#121212',
  },
  companyName: {
    fontSize: 13,
    color: '#5A5D54',
    fontWeight: '500',
  },
  periodPill: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  periodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A5D54',
  },
  highlightsContainer: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
    paddingTop: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 9999,
    backgroundColor: '#2F4F00',
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#343830',
  },
});
